<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { io, type Socket } from 'socket.io-client';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';

	interface Message {
		id: string;
		conversationId: string;
		senderId: string;
		content: string;
		sentAt: string;
		readAt: string | null;
		senderName?: string;
		tempId?: string;
	}

	type ReadReceipt = {
		conversationId: string;
		readerId: string;
		messageIds: string[];
		readAt: string;
	};

	type BookStatus = 'tersedia' | 'proses' | 'selesai' | 'dibatalkan';

	interface Conversation {
		id: string;
		bookId: string | null;
		bookTitle?: string;
		bookStatus?: BookStatus | null;
		otherUserName?: string;
	}

	const conversationId = $page.params.conversationId ?? '';

	let messages: Message[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);
	let messageInput = $state('');
	let sending = $state(false);
	let messagesEl: HTMLDivElement | undefined = $state(undefined);
	let currentUserId: string | null = $state(null);
	let conversation: Conversation | null = $state(null);

	// ---- Realtime state -----------------------------------------------------
	// Production (node server.js) exposes Socket.IO; `npm run dev` (Vite) does
	// not, so the client falls back to REST polling while disconnected.
	let socket: Socket | null = null;
	let live = $state(false);
	let fallbackNote: string | null = $state(null);
	let pollTimer: ReturnType<typeof setInterval> | null = null;

	// ---- Kesepakatan (transaksi) --------------------------------------------
	let bookStatus: BookStatus | null = $state(null);
	let proposing = $state(false);
	let dealMessage: string | null = $state(null);
	let dealError: string | null = $state(null);

	async function proposeDeal() {
		if (proposing || !conversationId) return;
		proposing = true;
		dealError = null;
		try {
			const res = await fetch('/api/transactions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ conversationId })
			});
			if (!res.ok) {
				let detail = 'Gagal mengajukan kesepakatan.';
				try {
					const data = (await res.json()) as { message?: string };
					if (data?.message) detail = data.message;
				} catch {
					// keep generic
				}
				throw new Error(detail);
			}
			const saved = (await res.json()) as { bookStatus: BookStatus };
			bookStatus = saved.bookStatus;
			dealMessage = 'Kesepakatan diajukan. Listing terkunci status “Sedang diproses” — lacak di dashboard → Transaksi.';
		} catch (e) {
			dealError = e instanceof Error ? e.message : 'Gagal mengajukan kesepakatan.';
		} finally {
			proposing = false;
		}
	}

	let { data }: { data: { userId: string } } = $props();
	// svelte-ignore state_referenced_locally
	currentUserId = data.userId;

	function formatTime(iso: string): string {
		return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
	}
	function formatDate(iso: string): string {
		const d = new Date(iso);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		if (d.toDateString() === today.toDateString()) return 'Hari ini';
		if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
		return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}
	function groupByDate(msgs: Message[]): { date: string; messages: Message[] }[] {
		const groups: Record<string, Message[]> = {};
		for (const msg of msgs) {
			const key = new Date(msg.sentAt).toDateString();
			if (!groups[key]) groups[key] = [];
			groups[key].push(msg);
		}
		return Object.entries(groups).map(([, v]) => ({ date: v[0].sentAt, messages: v }));
	}
	let dateGroups = $derived(groupByDate(messages));

	async function scrollToBottom() {
		await tick();
		if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
	}
	async function loadMessages() {
		try {
			const res = await fetch(`/api/conversations/${conversationId}/messages`);
			if (res.status === 401) {
				window.location.href = `/login?redirectTo=/dashboard/pesanku/${conversationId}`;
				return;
			}
			if (!res.ok) throw new Error('Gagal memuat pesan.');
			messages = await res.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Gagal memuat pesan.';
		} finally {
			loading = false;
		}
	}
	async function sendMessage() {
		if (!messageInput.trim() || sending) return;
		const content = messageInput.trim();
		messageInput = '';
		sending = true;
		const tempId = `temp-${Date.now()}`;
		const optimisticMsg: Message = { id: tempId, conversationId, senderId: currentUserId ?? '', content, sentAt: new Date().toISOString(), readAt: null, tempId };
		messages = [...messages, optimisticMsg];
		await scrollToBottom();
		try {
			const res = await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ conversationId, content })
			});
			if (!res.ok) {
				let detail = 'Gagal mengirim pesan.';
				try {
					const data = (await res.json()) as { message?: string };
					if (data?.message) detail = data.message;
				} catch {
					// keep the generic message
				}
				throw new Error(detail);
			}
			const saved = await res.json();
			messages = messages.map((m) => (m.tempId === tempId ? { ...saved, tempId: undefined } : m));
		} catch (e) {
			messages = messages.filter((m) => m.tempId !== tempId);
			messageInput = content;
			error = e instanceof Error ? e.message : 'Gagal mengirim pesan.';
		} finally {
			sending = false;
		}
	}
	// ---- Realtime connection ------------------------------------------------
	function handleIncomingMessage(msg: Message) {
		if (msg.conversationId !== conversationId) return;
		// Own message: REST response already replaced the optimistic bubble with
		// the persisted row (same id), or the socket beat the REST response —
		// either way, match a pending optimistic bubble by content.
		const pending = messages.find(
			(m) => m.tempId && m.senderId === msg.senderId && m.content === msg.content
		);
		if (pending) {
			messages = messages.map((m) => (m.tempId === pending.tempId ? { ...msg } : m));
			return;
		}
		if (messages.some((m) => m.id === msg.id)) return;
		messages = [...messages, msg];
		void scrollToBottom();
		// We just read everything the other person sent.
		if (msg.senderId !== currentUserId) socket?.emit('message:read', conversationId);
	}
	function handleReadReceipt(receipt: ReadReceipt) {
		if (receipt.readerId === currentUserId || receipt.conversationId !== conversationId) return;
		messages = messages.map((m) =>
			receipt.messageIds.includes(m.id) && !m.readAt ? { ...m, readAt: receipt.readAt } : m
		);
	}
	function startPolling() {
		if (pollTimer) return;
		pollTimer = setInterval(() => {
			void loadMessages();
		}, 5000);
	}
	function stopPolling() {
		if (pollTimer) {
			clearInterval(pollTimer);
			pollTimer = null;
		}
	}
	function connectSocket() {
		if (socket) return;
		// Same-origin: the custom production server hosts Socket.IO. Under Vite
		// dev this URL 404s, the client lands in the polling fallback below.
		socket = io({ withCredentials: true });
		socket.on('connect', () => {
			live = true;
			fallbackNote = null;
			stopPolling();
			socket?.emit(
				'join:conversation',
				conversationId,
				(res: { ok: boolean; reason?: string }) => {
					if (res?.ok) {
						socket?.emit('message:read', conversationId);
					} else {
						// Not a participant → the REST messages endpoint 403s anyway.
						console.warn('[socket] join ditolak:', res?.reason);
					}
				}
			);
		});
		socket.on('message:new', handleIncomingMessage);
		socket.on('message:read', handleReadReceipt);
		socket.on('connect_error', (err: Error) => {
			// Dev server has no /socket.io/ route; other failures (logout expiry,
			// server restart) also degrade to polling instead of error spam.
			live = false;
			fallbackNote = err.message;
			startPolling();
		});
		socket.on('disconnect', () => {
			live = false;
			startPolling();
		});
	}

	async function loadConversation() {
		try {
			const res = await fetch('/api/conversations');
			if (!res.ok) return;
			const convs: Conversation[] = await res.json();
			conversation = convs.find((c) => c.id === conversationId) ?? null;
			// Jangan menimpa status yang baru berubah lewat proposeDeal.
			if (bookStatus === null) bookStatus = conversation?.bookStatus ?? null;
		} catch { /* non-critical */ }
	}
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	onMount(async () => {
		await loadConversation();
		await loadMessages();
		await scrollToBottom();
		connectSocket();
	});

	onDestroy(() => {
		socket?.disconnect();
		socket = null;
		stopPolling();
	});
</script>

<svelte:head><title>Percakapan — Tukarbuku</title></svelte:head>

<div class="mx-auto flex max-w-6xl flex-col px-4 py-6">
	<Card class="flex items-center gap-3 p-3">
		<Button href="/dashboard/pesanku" variant="ghost" size="sm" aria-label="Kembali ke daftar pesan">←</Button>
		<div class="min-w-0">
			{#if conversation}
				<p class="truncate text-sm font-bold">{conversation.otherUserName ?? 'Percakapan'}{#if conversation.bookTitle}<span class="font-normal text-muted-foreground"> · {conversation.bookTitle}</span>{/if}</p>
			{:else}
				<p class="text-sm text-muted-foreground">Memuat…</p>
			{/if}
		</div>
		{#if live}
			<span class="ml-auto flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-600" title="Terhubung secara realtime">
				<span class="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span> Langsung
			</span>
		{:else}
			<span class="ml-auto flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground" title={fallbackNote ? `Realtime tidak tersedia: ${fallbackNote}. Pesan baru dimuat otomatis tiap 5 detik.` : 'Menghubungkan realtime…'}>
				<span class="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true"></span> Langsung tidak aktif
			</span>
		{/if}
	</Card>

	{#if conversation?.bookId && bookStatus === 'tersedia'}
		<Card class="mt-4 flex flex-wrap items-center gap-3 border-primary/40 bg-primary/5 p-4">
			<div class="min-w-0 flex-1">
				<p class="text-sm font-bold">Sudah sepakat dengan {conversation.otherUserName ?? 'dia'}?</p>
				<p class="mt-0.5 text-xs text-muted-foreground">Mengajukan kesepakatan mengunci listing ini (status: Sedang diproses) dan membuatnya muncul di dashboard → Transaksi.</p>
			</div>
			<Button onclick={() => proposeDeal()} disabled={proposing}>{proposing ? 'Mengajukan…' : 'Ajukan kesepakatan'}</Button>
		</Card>
	{:else if dealMessage}
		<Card class="mt-4 border-primary/40 bg-primary/5 p-4 text-sm" role="status">{dealMessage}</Card>
	{:else if dealError}
		<Card class="mt-4 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive" role="alert">{dealError}</Card>
	{/if}

	{#if loading}
		<Card class="mt-4 p-12 text-center text-sm text-muted-foreground"><p>Memuat pesan…</p></Card>
	{:else if error && !messages.length}
		<Card class="mt-4 flex flex-col items-center gap-3 p-12 text-sm text-destructive">
			<p>{error}</p>
			<Button variant="outline" size="sm" onclick={() => loadMessages()}>Coba lagi</Button>
		</Card>
	{:else}
		<Card class="mt-4 flex h-[55vh] flex-col overflow-hidden p-0">
			<div class="flex flex-1 flex-col gap-1 overflow-y-auto p-4" bind:this={messagesEl}>
				{#each dateGroups as group}
					<div class="my-2 flex justify-center"><span class="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{formatDate(group.date)}</span></div>
					{#each group.messages as msg (msg.id)}
						<div class="flex" class:justify-end={msg.senderId === currentUserId}>
							<div class="max-w-[78%] rounded-xl border px-3 py-2" class:bg-primary={msg.senderId === currentUserId} class:text-primary-foreground={msg.senderId === currentUserId} class:bg-background={msg.senderId !== currentUserId}>
								<p class="m-0 text-sm whitespace-pre-wrap break-words">{msg.content}</p>
								<time class="text-[10px] opacity-70">{formatTime(msg.sentAt)}{#if msg.senderId === currentUserId}{msg.readAt ? ' ✓✓' : ' ✓'}{/if}</time>
							</div>
						</div>
					{/each}
				{/each}
			</div>
			<div class="flex items-center gap-2 border-t p-3">
				<Input bind:value={messageInput} onkeydown={handleKeydown} placeholder="Ketik pesan…" maxlength="2000" aria-label="Isi pesan" class="flex-1" />
				<Button onclick={() => sendMessage()} disabled={!messageInput.trim() || sending} aria-label="Kirim pesan">Kirim</Button>
			</div>
		</Card>
	{/if}
</div>
