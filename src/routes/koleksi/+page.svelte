<script lang="ts">
	import { cities, type Book, type Condition, type ListingType } from '$lib/data/books';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import DropdownMenu from '$lib/components/ui/dropdown-menu.svelte';
	import BookCard from '$lib/components/book-card.svelte';
	import {
		Search,
		ArrowDownWideNarrow,
		SlidersHorizontal,
		Banknote,
		ArrowLeftRight,
		LayoutGrid,
		LibraryBig,
		ChevronDown,
		RotateCcw
	} from '@lucide/svelte';

	export let data: { books: Book[] };
	import { page as pageState } from '$app/state';

	const params = pageState.url.searchParams;
	const qParam = params.get('q') ?? '';
	const typeParam = params.get('type');
	const kondisiParam = params.get('kondisi');

	let query = qParam;
	let type: 'SEMUA' | ListingType = typeParam === 'JUAL' || typeParam === 'BARTER' ? typeParam : 'SEMUA';
	let condition: 'Semua kondisi' | Condition =
		kondisiParam === 'Baru' || kondisiParam === 'Baik' || kondisiParam === 'Cukup' || kondisiParam === 'Rusak ringan'
			? kondisiParam
			: 'Semua kondisi';
	let city = 'Semua kota';
	let sort: 'terbaru' | 'termurah' | 'termahal' = 'terbaru';
	let page = 1;
	const pageSize = 9;

	const sortLabels = { terbaru: 'Terbaru', termurah: 'Termurah', termahal: 'Termahal' };

	$: filtered = data.books.filter((book) => {
		const term = query.trim().toLowerCase();
		return (
			(!term || `${book.title} ${book.author}`.toLowerCase().includes(term)) &&
			(type === 'SEMUA' || book.listingType === type) &&
			(condition === 'Semua kondisi' || book.condition === condition) &&
			(city === 'Semua kota' || book.city === city)
		);
	});
	$: sorted = [...filtered].sort((a, b) => {
		if (sort === 'termurah') return (a.price ?? Infinity) - (b.price ?? Infinity);
		if (sort === 'termahal') return (b.price ?? -1) - (a.price ?? -1);
		return a.id - b.id;
	});
	$: totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	$: page = Math.min(page, totalPages);
	$: visible = sorted.slice((page - 1) * pageSize, page * pageSize);
	$: activeCount =
		Number(condition !== 'Semua kondisi') + Number(city !== 'Semua kota') + Number(type !== 'SEMUA');

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
	const resetFilters = () => {
		query = '';
		type = 'SEMUA';
		condition = 'Semua kondisi';
		city = 'Semua kota';
		sort = 'terbaru';
		page = 1;
	};
</script>

<svelte:head>
	<title>Koleksi — Tukarbuku</title>
	<meta name="description" content="Jelajahi koleksi buku bekas komunitas: beli atau barter langsung dengan pemiliknya." />
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-8">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<p class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
				<LibraryBig class="size-4" /> Koleksi komunitas
			</p>
			<h1 class="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Jelajahi buku</h1>
		</div>
		<p class="rounded-full bg-secondary px-3 py-1 text-sm font-bold">{filtered.length} hasil</p>
	</div>

	<!-- Toolbar -->
	<div class="mt-6 flex flex-col gap-3 rounded-sm border bg-card p-3 md:flex-row md:items-center">
		<div class="relative flex-1">
			<Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input bind:value={query} type="search" placeholder="Cari judul atau penulis…" class="rounded-sm pl-9" />
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex rounded-xl border p-1">
				{#each [{ v: 'SEMUA' as const, label: 'Semua', icon: LayoutGrid }, { v: 'JUAL' as const, label: 'Dijual', icon: Banknote }, { v: 'BARTER' as const, label: 'Barter', icon: ArrowLeftRight }] as t}
					<button
						onclick={() => { type = t.v; page = 1; }}
						class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold {type === t.v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
					>
						<t.icon class="size-3.5" />{t.label}
					</button>
				{/each}
			</div>

			<DropdownMenu
				items={[
					{ label: 'Semua kondisi', value: 'Semua kondisi' },
					{ label: 'Baru', value: 'Baru' },
					{ label: 'Baik', value: 'Baik' },
					{ label: 'Cukup', value: 'Cukup' },
					{ label: 'Rusak ringan', value: 'Rusak ringan' }
				]}
				onSelect={(v) => { condition = v as typeof condition; page = 1; }}
				class="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-background px-3 text-sm font-bold hover:bg-muted"
			>
				{#snippet trigger()}
					<SlidersHorizontal class="size-4 text-muted-foreground" />
					{condition}
					<ChevronDown class="size-3.5 text-muted-foreground" />
				{/snippet}
			</DropdownMenu>

			<DropdownMenu
				items={cities.map((c) => ({ label: c, value: c }))}
				onSelect={(v) => { city = v; page = 1; }}
				class="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-background px-3 text-sm font-bold hover:bg-muted"
			>
				{#snippet trigger()}
					{city}
					<ChevronDown class="size-3.5 text-muted-foreground" />
				{/snippet}
			</DropdownMenu>

			<DropdownMenu
				items={Object.entries(sortLabels).map(([value, label]) => ({ label, value }))}
				onSelect={(v) => { sort = v as typeof sort; page = 1; }}
				class="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-background px-3 text-sm font-bold hover:bg-muted"
			>
				{#snippet trigger()}
					<ArrowDownWideNarrow class="size-4 text-muted-foreground" />
					{sortLabels[sort]}
					<ChevronDown class="size-3.5 text-muted-foreground" />
				{/snippet}
			</DropdownMenu>

			{#if activeCount > 0}
				<Button variant="ghost" size="sm" onclick={resetFilters} class="rounded-xl font-bold">
					<RotateCcw class="size-3.5" /> Reset ({activeCount})
				</Button>
			{/if}
		</div>
	</div>

	<!-- Grid -->
	{#if visible.length}
		<div class="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3">
			{#each visible as book (book.id)}
				<BookCard {book} {formatPrice} />
			{/each}
		</div>
	{:else}
		<Card class="mt-6 p-10 text-center">
			<h3 class="font-bold">Tidak ada buku yang cocok</h3>
			<p class="mt-1 text-sm text-muted-foreground">Ubah kata kunci atau hapus filter.</p>
			<Button onclick={resetFilters} class="mt-4 rounded-full">Hapus semua filter</Button>
		</Card>
	{/if}

	<div class="mt-8 flex items-center justify-between text-sm">
		<span class="text-muted-foreground">Halaman {page} / {totalPages}</span>
		<div class="flex gap-2">
			<Button variant="outline" size="sm" disabled={page === 1} onclick={() => (page -= 1)} class="rounded-full">Sebelumnya</Button>
			<Button variant="outline" size="sm" disabled={page === totalPages} onclick={() => (page += 1)} class="rounded-full">Berikutnya</Button>
		</div>
	</div>
</main>
