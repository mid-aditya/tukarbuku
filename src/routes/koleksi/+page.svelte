<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import DropdownMenu from '$lib/components/ui/dropdown-menu.svelte';
	import BookCard from '$lib/components/book-card.svelte';
	import { sortLabels, type Condition, type ListingType, type SortOption } from '$lib/data/books';
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

	let { data }: { data: PageData } = $props();

	type Filters = {
		q: string;
		type: 'SEMUA' | ListingType;
		condition: '' | Condition;
		city: string;
		sort: SortOption;
		page: number;
	};

	const current = $derived<Filters>({
		q: data.filters.q,
		type: (data.filters.type ?? 'SEMUA') as Filters['type'],
		condition: data.filters.condition as Filters['condition'],
		city: data.filters.city,
		sort: data.filters.sort,
		page: data.filters.page
	});

	// svelte-ignore state_referenced_locally
	let query = $state(data.filters.q);
	$effect(() => {
		// Sinkronkan input saat navigasi (back/forward atau reset filter).
		query = data.filters.q;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.pageSize)));
	const activeCount = $derived(
		Number(current.condition !== '') + Number(current.city !== '') + Number(current.type !== 'SEMUA')
	);

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

	function apply(next: Partial<Filters>, pushHistory = false) {
		const merged = { ...current, page: 1, ...next };
		const params = new URLSearchParams();

		if (merged.q.trim()) params.set('q', merged.q.trim());
		if (merged.type !== 'SEMUA') params.set('type', merged.type);
		if (merged.condition) params.set('kondisi', merged.condition);
		if (merged.city) params.set('kota', merged.city);
		if (merged.sort !== 'terbaru') params.set('sort', merged.sort);
		if (merged.page > 1) params.set('page', String(merged.page));

		const qs = params.toString();
		goto(qs ? `${page.url.pathname}?${qs}` : page.url.pathname, {
			keepFocus: true,
			noScroll: true,
			replaceState: !pushHistory
		});
	}

	let searchTimer: ReturnType<typeof setTimeout> | undefined;
	function onSearchInput() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => apply({ q: query }), 350);
	}

	function resetFilters() {
		query = '';
		clearTimeout(searchTimer);
		goto(page.url.pathname, { keepFocus: true, noScroll: true, replaceState: true });
	}

	const hasResults = $derived(data.books.length > 0);
</script>

<svelte:head>
	<title>Koleksi — Tukarbuku</title>
	<meta name="description" content="Jelajahi koleksi buku bekas komunitas: beli atau barter langsung dengan pemiliknya." />
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-8">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<p class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
				<LibraryBig class="size-4" /> Koleksi komunitas
			</p>
			<h1 class="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Jelajahi buku</h1>
		</div>
		<p class="rounded-full bg-secondary px-3 py-1 text-sm font-bold">{data.total} hasil</p>
	</div>

	<!-- Toolbar -->
	<div class="mt-6 flex flex-col gap-3 rounded-sm border bg-card p-3 md:flex-row md:items-center">
		<form
			class="relative flex-1"
			role="search"
			onsubmit={(e) => {
				e.preventDefault();
				clearTimeout(searchTimer);
				apply({ q: query });
			}}
		>
			<Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				bind:value={query}
				oninput={onSearchInput}
				type="search"
				placeholder="Cari judul atau penulis…"
				aria-label="Cari buku"
				class="rounded-sm pl-9"
			/>
		</form>
		<div class="flex flex-wrap items-center gap-2">
			<div class="flex rounded-xl border p-1">
				{#each [{ v: 'SEMUA' as const, label: 'Semua', icon: LayoutGrid }, { v: 'JUAL' as const, label: 'Dijual', icon: Banknote }, { v: 'BARTER' as const, label: 'Barter', icon: ArrowLeftRight }] as t}
					<button
						type="button"
						onclick={() => apply({ type: t.v })}
						aria-pressed={current.type === t.v}
						class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold {current.type === t.v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
					>
						<t.icon class="size-3.5" />{t.label}
					</button>
				{/each}
			</div>

			<DropdownMenu
				items={[
					{ label: 'Semua kondisi', value: '' },
					...(data.conditionOptions ?? []).map((c) => ({ label: c, value: c }))
				]}
				onSelect={(v) => apply({ condition: v as Filters['condition'] })}
				class="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-background px-3 text-sm font-bold hover:bg-muted"
			>
				{#snippet trigger()}
					<SlidersHorizontal class="size-4 text-muted-foreground" />
					{current.condition || 'Semua kondisi'}
					<ChevronDown class="size-3.5 text-muted-foreground" />
				{/snippet}
			</DropdownMenu>

			<DropdownMenu
				items={[{ label: 'Semua kota', value: '' }, ...data.cities.map((c) => ({ label: c, value: c }))]}
				onSelect={(v) => apply({ city: v })}
				class="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-background px-3 text-sm font-bold hover:bg-muted"
			>
				{#snippet trigger()}
					{current.city || 'Semua kota'}
					<ChevronDown class="size-3.5 text-muted-foreground" />
				{/snippet}
			</DropdownMenu>

			<DropdownMenu
				items={Object.entries(sortLabels).map(([value, label]) => ({ label, value }))}
				onSelect={(v) => apply({ sort: v as SortOption })}
				class="inline-flex h-9 items-center gap-1.5 rounded-xl border bg-background px-3 text-sm font-bold hover:bg-muted"
			>
				{#snippet trigger()}
					<ArrowDownWideNarrow class="size-4 text-muted-foreground" />
					{sortLabels[current.sort]}
					<ChevronDown class="size-3.5 text-muted-foreground" />
				{/snippet}
			</DropdownMenu>

			{#if activeCount > 0 || current.q}
				<Button variant="ghost" size="sm" onclick={resetFilters} class="rounded-xl font-bold">
					<RotateCcw class="size-3.5" /> Reset ({activeCount + Number(current.q !== '')})
				</Button>
			{/if}
		</div>
	</div>

	{#if !data.dbAvailable}
		<Card class="mt-6 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
			Database belum tersedia. Jalankan migrasi dan seed (`npm run db:migrate && npm run db:seed`), lalu muat ulang
			halaman ini.
		</Card>
	{/if}

	<!-- Grid -->
	{#if hasResults}
		<div class="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3">
			{#each data.books as book (book.id)}
				<BookCard {book} {formatPrice} />
			{/each}
		</div>
	{:else}
		<Card class="mt-6 p-10 text-center">
			<h3 class="font-bold">Tidak ada buku yang cocok</h3>
			<p class="mt-1 text-sm text-muted-foreground">
				{#if !data.dbAvailable}
					Koleksi belum bisa dimuat dari database.
				{:else if data.total === 0 && !activeCount && !current.q}
					Belum ada listing. Jadilah yang pertama memasang buku.
				{:else}
					Ubah kata kunci atau hapus filter.
				{/if}
			</p>
			<div class="mt-4 flex flex-wrap justify-center gap-2">
				{#if activeCount > 0 || current.q}
					<Button onclick={resetFilters} class="rounded-full">Hapus semua filter</Button>
				{:else}
					<Button href="/dashboard/buku-baru" class="rounded-full">Pasang buku</Button>
				{/if}
			</div>
		</Card>
	{/if}

	{#if totalPages > 1}
		<div class="mt-8 flex items-center justify-between text-sm">
			<span class="text-muted-foreground">Halaman {current.page} / {totalPages}</span>
			<div class="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={current.page <= 1}
					onclick={() => apply({ page: current.page - 1 }, true)}
					class="rounded-full">Sebelumnya</Button
				>
				<Button
					variant="outline"
					size="sm"
					disabled={current.page >= totalPages}
					onclick={() => apply({ page: current.page + 1 }, true)}
					class="rounded-full">Berikutnya</Button
				>
			</div>
		</div>
	{/if}
</main>
