<script lang="ts">
	import { onMount } from 'svelte';
	// page data loaded client-side via fetch

	// export let data: PageData; // auth-protected page; data loaded client-side

	interface ConversationPreview {
		id: string;
		bookId: string | null;
		bookTitle: string | null;
		otherUserName: string | null;
		createdAt: string;
	}

	let conversations: ConversationPreview[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const res = await fetch('/api/conversations');
			if (res.ok) {
				conversations = await res.json();
			} else if (res.status === 401) {
				window.location.href = '/login?redirectTo=/dashboard/pesanku';
			}
		} catch {
			error = 'Gagal memuat percakapan.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Pesan — Tukarbuku</title>
</svelte:head>

<header class="site-header">
	<a class="wordmark" href="/" aria-label="Tukarbuku beranda"><span>TB</span>Tukarbuku</a>
	<nav aria-label="Navigasi akun"><a href="/dashboard">Dashboard</a><a class="active" href="/dashboard/pesanku" aria-current="page">Pesan</a></nav>
</header>

<main class="pesanku-shell">
	<div class="pesanku-panel">
		<div class="panel-head">
			<p class="section-label">Percakapan</p>
			<h1>Pesan</h1>
		</div>

		{#if loading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>Memuat percakapan…</p>
			</div>
		{:else if error}
			<div class="error-state">
				<p>{error}</p>
			</div>
		{:else if !conversations.length}
			<div class="empty-state">
				<h2>Belum ada percakapan</h2>
				<p>Mulai chat dari halaman detail buku untuk menghubungi penjual atau pembeli.</p>
				<a href="/">Telusuri koleksi</a>
			</div>
		{:else}
			<ul class="conversation-list" role="list">
				{#each conversations as conv (conv.id)}
					<li>
						<a href="/dashboard/pesanku/{conv.id}" class="conversation-item">
							<div class="avatar">{conv.otherUserName?.charAt(0) ?? '?'}</div>
							<div class="conv-info">
								<div class="conv-meta">
									<strong>{conv.otherUserName ?? 'Tanpa nama'}</strong>
									{#if conv.bookTitle}
										<span class="book-ref">· {conv.bookTitle}</span>
									{/if}
								</div>
								<time>{new Date(conv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</main>

<style>
	:global(body) { background: var(--paper); }
	.site-header {
		height: 72px;
		padding: 0 clamp(20px, 5vw, 72px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--border);
		background: rgba(250, 250, 247, .96);
	}
	.wordmark { display: flex; gap: 10px; align-items: center; color: var(--ink); text-decoration: none; font-weight: 750; }
	.wordmark span { display: grid; place-items: center; width: 32px; height: 32px; background: var(--ink); color: white; font-size: 11px; }
	.site-header nav { display: flex; align-items: center; gap: 28px; }
	.site-header nav a { color: var(--stone); text-decoration: none; font-size: 14px; font-weight: 600; }
	.site-header nav a.active { color: var(--ink); }

	.pesanku-shell { min-height: calc(100vh - 72px); padding: clamp(40px, 6vw, 72px) clamp(20px, 5vw, 64px); }
	.pesanku-panel { max-width: 680px; margin: 0 auto; }
	.panel-head { margin-bottom: 28px; }
	.section-label { margin: 0 0 14px; color: var(--leaf); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 800; }
	.panel-head h1 { margin: 0; font-size: clamp(28px, 4vw, 42px); letter-spacing: -.04em; }

	.loading-state, .error-state { padding: 48px 0; text-align: center; color: var(--stone); }
	.spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--leaf); border-radius: 50%; margin: 0 auto 14px; animation: spin .7s linear infinite; }
	@keyframes spin { to { transform: rotate(360deg); } }

	.empty-state { padding: 56px 0; text-align: center; }
	.empty-state h2 { margin: 0 0 10px; font-size: 22px; }
	.empty-state p { margin: 0 0 22px; color: var(--stone); font-size: 14px; }
	.empty-state a { min-height: 46px; padding: 0 18px; display: inline-flex; align-items: center; background: var(--leaf); color: white; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 750; }

	.conversation-list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--border); }
	.conversation-item { display: flex; align-items: center; gap: 14px; padding: 18px 20px; text-decoration: none; color: inherit; border-bottom: 1px solid var(--border); transition: background .12s ease; }
	.conversation-list li:last-child .conversation-item { border-bottom: 0; }
	.conversation-item:hover { background: #f7f8f5; }
	.avatar { width: 42px; height: 42px; border-radius: 50%; background: #d4e2d9; color: var(--leaf); display: grid; place-items: center; font-weight: 800; font-size: 16px; flex-shrink: 0; }
	.conv-info { min-width: 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
	.conv-meta { min-width: 0; }
	.conv-meta strong { display: block; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.book-ref { display: block; font-size: 12px; color: var(--stone); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.conv-info time { flex-shrink: 0; font-size: 12px; color: var(--stone); }

	@media (max-width: 520px) {
		.site-header { height: 64px; padding: 0 16px; }
		.site-header nav a:not(.active) { display: none; }
		.pesanku-shell { padding: 28px 16px 52px; }
	}
</style>
