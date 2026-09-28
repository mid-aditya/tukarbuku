<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
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

	interface Conversation {
		id: string;
		bookId: string | null;
		bookTitle?: string;
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
			if (!res.ok) throw new Error('Gagal mengirim pesan.');
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
	async function loadConversation() {
		try {
			const res = await fetch('/api/conversations');
			if (!res.ok) return;
			const convs: Conversation[] = await res.json();
			conversation = convs.find((c) => c.id === conversationId) ?? null;
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
	</Card>

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
								<time class="text-[10px] opacity-70">{formatTime(msg.sentAt)}</time>
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
