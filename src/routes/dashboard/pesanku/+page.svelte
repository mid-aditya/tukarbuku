<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Avatar from '$lib/components/ui/avatar.svelte';

	interface ConversationPreview {
		id: string;
		bookId: string | null;
		bookTitle: string | null;
		otherUserName: string | null;
		createdAt: string;
	}

	let conversations: ConversationPreview[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);

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

<svelte:head><title>Pesan — Tukarbuku</title></svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="mx-auto max-w-2xl">
		<p class="mb-1 text-xs font-bold uppercase tracking-widest text-primary">Percakapan</p>
		<h1 class="text-3xl font-bold tracking-tight">Pesan</h1>

		{#if loading}
			<Card class="mt-6 p-12 text-center text-sm text-muted-foreground"><p>Memuat percakapan…</p></Card>
		{:else if error}
			<Card class="mt-6 p-12 text-center text-sm text-destructive"><p>{error}</p></Card>
		{:else if !conversations.length}
			<Card class="mt-6 p-12 text-center">
				<h2 class="text-lg font-bold">Belum ada percakapan</h2>
				<p class="mt-1 text-sm text-muted-foreground">Mulai chat dari halaman detail buku untuk menghubungi penjual atau pembeli.</p>
				<Button href="/" class="mt-4">Telusuri koleksi</Button>
			</Card>
		{:else}
			<Card class="mt-6 divide-y p-0">
				{#each conversations as conv (conv.id)}
					<a href="/dashboard/pesanku/{conv.id}" class="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50">
						<Avatar name={conv.otherUserName ?? '?'} />
						<div class="flex min-w-0 flex-1 items-center justify-between gap-3">
							<div class="min-w-0">
								<p class="truncate text-sm font-bold">{conv.otherUserName ?? 'Tanpa nama'}</p>
								{#if conv.bookTitle}<p class="truncate text-xs text-muted-foreground">{conv.bookTitle}</p>{/if}
							</div>
							<time class="shrink-0 text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</time>
						</div>
					</a>
				{/each}
			</Card>
		{/if}
	</div>
</div>
