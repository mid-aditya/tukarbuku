<script lang="ts">
	import { cities, type Book, type Condition, type ListingType } from '$lib/data/books';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Select from '$lib/components/ui/select.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Avatar from '$lib/components/ui/avatar.svelte';
	import { Search, MapPin, ArrowRight } from '@lucide/svelte';

	export let data: { books: Book[] };
	let query = '';
	let type: 'SEMUA' | ListingType = 'SEMUA';
	let condition: 'Semua kondisi' | Condition = 'Semua kondisi';
	let city = 'Semua kota';
	let page = 1;
	const pageSize = 6;

	$: filteredBooks = data.books.filter((book) => {
		const term = query.trim().toLowerCase();
		return (
			(!term || `${book.title} ${book.author}`.toLowerCase().includes(term)) &&
			(type === 'SEMUA' || book.listingType === type) &&
			(condition === 'Semua kondisi' || book.condition === condition) &&
			(city === 'Semua kota' || book.city === city)
		);
	});
	$: totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
	$: page = Math.min(page, totalPages);
	$: visibleBooks = filteredBooks.slice((page - 1) * pageSize, page * pageSize);

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
	const resetFilters = () => { query = ''; type = 'SEMUA'; condition = 'Semua kondisi'; city = 'Semua kota'; page = 1; };
</script>

<svelte:head><title>Tukarbuku — Jual dan barter buku bekas</title></svelte:head>

<main>
	<section class="border-b bg-muted/50">
		<div class="mx-auto max-w-6xl px-4 py-12 md:py-16">
			<p class="text-xs font-semibold uppercase tracking-widest text-primary">Buku bekas dari pembaca di sekitarmu</p>
			<h1 class="mt-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">Cari buku yang ingin kamu baca berikutnya.</h1>
			<p class="mt-4 max-w-xl text-muted-foreground">Beli atau barter langsung dengan pemiliknya. Atur COD lewat chat dan periksa kondisi buku saat bertemu.</p>
		</div>
	</section>

	<section class="border-b bg-background" aria-label="Pencarian buku">
		<div class="mx-auto grid max-w-6xl gap-3 px-4 py-4 md:grid-cols-[1fr_auto_auto_auto]">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input bind:value={query} type="search" placeholder="Judul buku atau nama penulis" class="pl-9" />
			</div>
			<div class="flex rounded-md border p-1">
				{#each ['SEMUA', 'JUAL', 'BARTER'] as t}
					<button on:click={() => { type = t; page = 1; }} class="rounded px-3 py-1.5 text-sm font-medium {type === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}">{t === 'SEMUA' ? 'Semua' : t === 'JUAL' ? 'Dijual' : 'Barter'}</button>
				{/each}
			</div>
			<Select bind:value={condition} on:change={() => (page = 1)} class="md:w-40">
				<option>Semua kondisi</option><option>Baru</option><option>Baik</option><option>Cukup</option><option>Rusak ringan</option>
			</Select>
			<Select bind:value={city} on:change={() => (page = 1)} class="md:w-40">
				{#each cities as cityName}<option>{cityName}</option>{/each}
			</Select>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-4 py-10" id="koleksi">
		<div class="mb-6 flex items-end justify-between">
			<div><p class="text-xs font-semibold uppercase tracking-widest text-primary">Koleksi komunitas</p><h2 class="text-2xl font-bold tracking-tight">Buku tersedia</h2></div>
			<p class="text-sm text-muted-foreground">{filteredBooks.length} hasil</p>
		</div>

		{#if visibleBooks.length}
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each visibleBooks as book (book.id)}
					<Card class="overflow-hidden">
						<a href={`/buku/${book.id}`} class="relative block bg-muted">
							<img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" class="mx-auto h-60 w-auto object-cover py-4" width="160" height="220" />
							<Badge variant={book.listingType === 'JUAL' ? 'jual' : 'barter'} class="absolute left-3 top-3">{book.listingType === 'JUAL' ? 'DIJUAL' : 'BARTER'}</Badge>
						</a>
						<div class="space-y-2 p-4">
							<a href={`/buku/${book.id}`} class="font-semibold leading-snug hover:underline">{book.title}</a>
							<p class="text-sm text-muted-foreground">{book.author}</p>
							<p class="text-sm font-semibold text-primary">{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : book.wantedInExchange}</p>
							<div class="flex gap-2 text-xs text-muted-foreground"><span class="rounded bg-secondary px-2 py-0.5">{book.condition}</span><span class="inline-flex items-center gap-1"><MapPin class="size-3" />{book.city}</span></div>
							<div class="flex items-center gap-2 border-t pt-3 text-sm">
								<Avatar name={book.seller} class="size-7" />
								<span class="truncate text-muted-foreground">{book.seller}</span>
								<a href={`/buku/${book.id}`} class="ml-auto inline-flex items-center gap-1 text-primary hover:underline">Detail <ArrowRight class="size-3" /></a>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		{:else}
			<Card class="p-10 text-center">
				<h3 class="font-semibold">Tidak ada buku yang cocok</h3>
				<p class="mt-1 text-sm text-muted-foreground">Ubah kata kunci atau hapus filter.</p>
				<Button on:click={resetFilters} class="mt-4">Hapus semua filter</Button>
			</Card>
		{/if}

		<div class="mt-8 flex items-center justify-between text-sm">
			<span class="text-muted-foreground">{page} / {totalPages}</span>
			<div class="flex gap-2">
				<Button variant="outline" size="sm" disabled={page === 1} on:click={() => (page -= 1)}>Sebelumnya</Button>
				<Button variant="outline" size="sm" disabled={page === totalPages} on:click={() => (page += 1)}>Berikutnya</Button>
			</div>
		</div>
	</section>

	<section class="bg-primary text-primary-foreground" id="cara-kerja">
		<div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
			{#each [['01', 'Temukan buku', 'Cari berdasarkan judul, kondisi, dan kota COD.'], ['02', 'Chat pemilik', 'Tanyakan detail dan sepakati waktu bertemu.'], ['03', 'Periksa dan tukar', 'Temui di tempat umum dan periksa buku.']] as [n, t, d]}
				<div class="border-t border-white/20 pt-4"><p class="text-xs opacity-70">{n}</p><h2 class="mt-2 text-lg font-semibold">{t}</h2><p class="mt-1 text-sm opacity-80">{d}</p></div>
			{/each}
		</div>
	</section>
</main>
