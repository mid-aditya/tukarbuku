<script lang="ts">
	import type { PageData } from './$types';
	import BookCard from '$lib/components/book-card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { Heart } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
</script>

<svelte:head>
	<title>Favorit — Tukarbuku</title>
	<meta name="description" content="Buku yang kamu simpan di Tukarbuku." />
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-8">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<p class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
				<Heart class="size-4" /> Koleksi pribadi
			</p>
			<h1 class="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Favorit</h1>
		</div>
		<p class="rounded-full bg-secondary px-3 py-1 text-sm font-bold">{data.books.length} buku</p>
	</div>

	{#if !data.dbAvailable}
		<Card class="mt-6 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
			Database belum tersedia, jadi daftar favorit belum bisa dimuat. Coba lagi sebentar lagi.
		</Card>
	{/if}

	{#if data.books.length}
		<p class="mt-4 text-sm text-muted-foreground">Klik ikon hati untuk menghapus buku dari daftar favorit.</p>
		<div class="mt-4 grid grid-cols-2 gap-5 lg:grid-cols-3">
			{#each data.books as book (book.id)}
				<BookCard {book} {formatPrice} />
			{/each}
		</div>
	{:else if data.dbAvailable}
		<Card class="mt-6 p-10 text-center">
			<Heart class="mx-auto size-10 text-muted-foreground" />
			<h2 class="mt-3 font-bold">Belum ada buku favorit</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Simpan buku yang menarik dengan ikon hati, lalu temukan semuanya di sini.
			</p>
			<Button href="/koleksi" class="mt-4 rounded-full">Telusuri koleksi</Button>
		</Card>
	{/if}
</main>
