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
	<!-- Hero ala Proteinbolaget: banner hitam bold + CTA -->
	<section class="bg-muted/40">
		<div class="mx-auto max-w-7xl px-4 py-6">
			<div class="relative overflow-hidden rounded-3xl bg-neutral-950 px-6 py-12 text-white md:px-12 md:py-16 dark:bg-black dark:border">
				<p class="inline-flex rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-black">Buku bekas • Jual & barter</p>
				<h1 class="mt-4 max-w-2xl text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">Buku next-mu ada di tetanggamu.</h1>
				<p class="mt-4 max-w-xl font-medium text-neutral-300">Beli atau barter langsung dengan pemiliknya. Chat, COD, periksa kondisi — beres.</p>
				<div class="mt-6 flex flex-wrap gap-3">
					<Button href="#koleksi" size="lg" class="rounded-full bg-amber-400 font-black uppercase text-black hover:bg-amber-300">Belanja sekarang</Button>
					<Button href="/dashboard/buku-baru" size="lg" variant="outline" class="rounded-full border-white/30 font-black uppercase text-white hover:bg-white/10">Jual bukumu</Button>
				</div>
			</div>
			<!-- USP row -->
			<div class="mt-4 grid gap-3 text-sm font-bold uppercase tracking-wide sm:grid-cols-3">
				<div class="rounded-2xl border bg-background px-4 py-3">COD aman di kotamu</div>
				<div class="rounded-2xl border bg-background px-4 py-3">Tanpa perantara</div>
				<div class="rounded-2xl border bg-background px-4 py-3">Bisa barter</div>
			</div>
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

	<section class="mx-auto max-w-7xl px-4 py-10" id="koleksi">
		<div class="mb-6 flex items-end justify-between">
			<div><p class="text-xs font-black uppercase tracking-widest text-primary">Koleksi komunitas</p><h2 class="text-3xl font-black uppercase tracking-tight">Buku tersedia</h2></div>
			<p class="rounded-full bg-accent px-3 py-1 text-sm font-bold">{filteredBooks.length} hasil</p>
		</div>

		{#if visibleBooks.length}
			<div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
				{#each visibleBooks as book (book.id)}
					<Card class="group overflow-hidden rounded-2xl">
						<a href={`/buku/${book.id}`} class="relative block bg-muted/60 p-4">
							<img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" class="mx-auto h-52 w-auto rounded-md object-cover shadow-md transition-transform group-hover:-translate-y-1 md:h-60" width="160" height="220" />
							<Badge variant={book.listingType === 'JUAL' ? 'jual' : 'barter'} class="absolute left-3 top-3 rounded-full font-black uppercase">{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}</Badge>
						</a>
						<div class="space-y-1.5 p-4">
							<p class="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{book.author}</p>
							<a href={`/buku/${book.id}`} class="line-clamp-1 font-bold leading-snug hover:underline">{book.title}</a>
							<p class="text-lg font-black">{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : book.wantedInExchange}</p>
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

	<section class="bg-neutral-950 text-white dark:bg-black dark:border-y" id="cara-kerja">
		<div class="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3">
			{#each [['01', 'Temukan buku', 'Cari berdasarkan judul, kondisi, dan kota COD.'], ['02', 'Chat pemilik', 'Tanyakan detail dan sepakati waktu bertemu.'], ['03', 'Periksa dan tukar', 'Temui di tempat umum dan periksa buku.']] as [n, t, d]}
				<div class="rounded-2xl border border-white/15 p-6"><p class="text-xs font-black text-amber-400">{n}</p><h2 class="mt-2 text-xl font-black uppercase">{t}</h2><p class="mt-1 text-sm text-neutral-300">{d}</p></div>
			{/each}
		</div>
	</section>
</main>
