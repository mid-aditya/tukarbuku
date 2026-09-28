<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { page } from '$app/stores';

	interface Message {
		id: string;
		conversationId: string;
		senderId: string;
		content: string;
		sentAt: string;
		readAt: string | null;
		senderName?: string;
		tempId?: string; // client-side only, for optimistic UI
	}

	interface Conversation {
		id: string;
		bookId: string | null;
		bookTitle?: string;
		otherUserName?: string;
	}

	const conversationId = $page.params.conversationId ?? '';

	let messages: Message[] = [];
	let loading = true;
	let error: string | null = null;
	let messageInput = '';
	let sending = false;
	let messagesEl: HTMLDivElement;
	let currentUserId: string | null = null;
	let conversation: Conversation | null = null;

	function formatTime(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
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

	// Group messages by date for display
	function groupByDate(msgs: Message[]): { date: string; messages: Message[] }[] {
		const groups: Record<string, Message[]> = {};
		for (const msg of msgs) {
			const key = new Date(msg.sentAt).toDateString();
			if (!groups[key]) groups[key] = [];
			groups[key].push(msg);
		}
		return Object.entries(groups).map(([, msgs]) => ({
			date: groups[Object.keys(groups).find(k => groups[k] === msgs)!][0].sentAt,
			messages: msgs,
		}));
	}

	async function scrollToBottom() {
		await tick();
		if (messagesEl) {
			messagesEl.scrollTop = messagesEl.scrollHeight;
		}
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

		// Optimistic update
		const optimisticMsg: Message = {
			id: tempId,
			conversationId,
			senderId: currentUserId ?? '',
			content,
			sentAt: new Date().toISOString(),
			readAt: null,
			tempId,
		};
		messages = [...messages, optimisticMsg];
		await scrollToBottom();

		try {
			const res = await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ conversationId, content }),
			});

			if (!res.ok) throw new Error('Gagal mengirim pesan.');

			const saved = await res.json();

			// Replace optimistic message with real one
			messages = messages.map(m => m.tempId === tempId ? { ...saved, tempId: undefined } : m);
		} catch (e) {
			// Remove optimistic message on failure
			messages = messages.filter(m => m.tempId !== tempId);
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
			conversation = convs.find(c => c.id === conversationId) ?? null;
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



	$: dateGroups = groupByDate(messages);
</script>

<svelte:head>
	<title>Percakapan — Tukarbuku</title>
</svelte:head>

<header class="chat-header">
	<a class="back-btn" href="/dashboard/pesanku" aria-label="Kembali ke daftar pesan">
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path d="M11 4L6 9L11 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</a>
	<div class="header-info">
		{#if conversation}
			<strong>{conversation.otherUserName ?? 'Percakapan'}</strong>
			{#if conversation.bookTitle}
				<span>· {conversation.bookTitle}</span>
			{/if}
		{:else}
			<strong>Memuat…</strong>
		{/if}
	</div>
</header>

<main class="chat-shell">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Memuat pesan…</p>
		</div>
	{:else if error}
		<div class="error-state">
			<p>{error}</p>
			<button on:click={loadMessages}>Coba lagi</button>
		</div>
	{:else}
		<div class="messages-area" bind:this={messagesEl}>
			{#each dateGroups as group}
				<div class="date-separator">
					<span>{formatDate(group.date)}</span>
				</div>
				{#each group.messages as msg (msg.id)}
					<div class="message" class:own={msg.senderId === currentUserId}>
						<div class="bubble">
							<p>{msg.content}</p>
							<time>{formatTime(msg.sentAt)}</time>
						</div>
					</div>
				{/each}
			{/each}
		</div>
	{/if}
</main>

<div class="input-bar">
	<textarea
		bind:value={messageInput}
		on:keydown={handleKeydown}
		placeholder="Ketik pesan…"
		rows="1"
		maxlength="2000"
		aria-label="Isi pesan"
	></textarea>
	<button on:click={sendMessage} disabled={!messageInput.trim() || sending} aria-label="Kirim pesan">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path d="M3 10L17 3L10 17L9 11L3 10Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
		</svg>
	</button>
</div>

<style>
	.chat-header {
		height: 64px;
		padding: 0 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		background: white;
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.back-btn {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		color: var(--stone);
		text-decoration: none;
		border-radius: 4px;
		transition: background .12s ease;
	}
	.back-btn:hover { background: var(--muted); }
	.header-info { min-width: 0; }
	.header-info strong { display: block; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.header-info span { font-size: 12px; color: var(--stone); }

	.chat-shell {
		flex: 1;
		overflow: hidden;
	}
	.loading-state, .error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 14px;
		height: 100%;
		min-height: 300px;
		color: var(--stone);
		font-size: 14px;
	}
	.spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--leaf); border-radius: 50%; animation: spin .7s linear infinite; }
	@keyframes spin { to { transform: rotate(360deg); } }
	.error-state button { padding: 8px 16px; background: var(--leaf); color: white; border: 0; border-radius: 4px; font-size: 13px; font-weight: 700; cursor: pointer; }

	.messages-area {
		height: calc(100vh - 130px);
		overflow-y: auto;
		padding: 16px 16px 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.date-separator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 14px 0 8px;
	}
	.date-separator span {
		padding: 4px 10px;
		background: var(--muted);
		border-radius: 20px;
		font-size: 11px;
		color: var(--stone);
		font-weight: 700;
	}
	.message { display: flex; margin-bottom: 2px; }
	.message.own { justify-content: flex-end; }
	.bubble {
		max-width: min(380px, 78%);
		padding: 10px 14px;
		background: white;
		border: 1px solid var(--border);
		border-radius: 12px 12px 12px 4px;
	}
	.message.own .bubble { background: #e8f2ec; border-color: #c8dac9; border-radius: 12px 12px 4px 12px; }
	.bubble p { margin: 0 0 4px; font-size: 14px; line-height: 1.55; word-break: break-word; white-space: pre-wrap; }
	.bubble time { font-size: 10px; color: var(--stone); }

	.input-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: flex-end;
		gap: 10px;
		padding: 12px 14px;
		background: white;
		border-top: 1px solid var(--border);
	}
	.input-bar textarea {
		flex: 1;
		min-height: 44px;
		max-height: 140px;
		padding: 10px 14px;
		border: 1px solid var(--border);
		border-radius: 22px;
		background: white;
		color: var(--ink);
		font-size: 14px;
		resize: none;
		line-height: 1.5;
		transition: border-color .15s ease;
	}
	.input-bar textarea:focus { outline: 0; border-color: var(--leaf); }
	.input-bar button {
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: 50%;
		background: var(--leaf);
		color: white;
		display: grid;
		place-items: center;
		cursor: pointer;
		flex-shrink: 0;
		transition: background .15s ease, opacity .15s ease;
	}
	.input-bar button:hover:not(:disabled) { background: var(--leaf-dark); }
	.input-bar button:disabled { opacity: .4; cursor: not-allowed; }
</style>
