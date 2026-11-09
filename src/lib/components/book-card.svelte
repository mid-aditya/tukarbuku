<script lang="ts">
	import Badge from '$lib/components/ui/badge.svelte';
	import { cn } from '$lib/components/ui/utils';
	import { Heart, Star, MapPin } from '@lucide/svelte';
	import type { Book } from '$lib/data/books';

	let {
		book,
		formatPrice,
		variant = 'grid',
		showRating = true,
		compact = false
	}: {
		book: Book;
		formatPrice: (n: number) => string;
		/** grid: catalog tiles; shelf: horizontal carousel on the homepage. */
		variant?: 'grid' | 'shelf';
		showRating?: boolean;
		compact?: boolean;
	} = $props();

	const isGrid = $derived(variant === 'grid');

	const lowestLabel = $derived(
		isGrid || compact || book.listingType !== 'JUAL' || !book.price
			? null
			: `Harga terendah ${formatPrice(Math.round(book.price * 0.92))}`
	);
</script>

<article class={cn(isGrid ? 'group flex h-full flex-col bg-card' : 'group w-[10.75rem] shrink-0 snap-start sm:w-[12.5rem] md:w-[14rem]')}>
	<a
		href={`/buku/${book.id}`}
		class={cn(
			'relative block transition-colors',
			isGrid
				? 'bg-muted/80 p-4 hover:bg-muted'
				: 'aspect-[4/5] bg-[hsl(40_8%_93%)] p-5 hover:bg-[hsl(40_8%_90%)] dark:bg-muted/80'
		)}
	>
		<button
			type="button"
			class={cn(
				'absolute z-10 grid place-items-center transition-colors',
				isGrid
					? 'right-3 top-3 size-8 rounded-full bg-card/90 text-muted-foreground opacity-0 shadow-sm group-hover:opacity-100'
					: 'right-2 top-2 size-9 text-foreground/70 hover:text-foreground'
			)}
			aria-label="Simpan ke favorit"
			onclick={(e) => e.preventDefault()}
		>
			<Heart class={isGrid ? 'size-4' : 'size-[1.35rem] stroke-[1.25]'} />
		</button>

		<img
			src={book.cover}
			alt={`Sampul ${book.title}`}
			loading="lazy"
			width={isGrid ? 160 : 280}
			height={isGrid ? 220 : 350}
			class={cn(
				'mx-auto object-contain',
				isGrid ? 'h-48 w-auto md:h-52' : 'h-full max-h-[85%] w-full object-bottom'
			)}
		/>

		{#if isGrid}
			<Badge
				variant={book.listingType === 'JUAL' ? 'jual' : 'barter'}
				class="absolute left-2 top-2 rounded-sm text-[10px] font-bold uppercase"
			>
				{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}
			</Badge>
		{/if}
	</a>

	<div class={cn(isGrid ? 'flex flex-1 flex-col space-y-1 px-2 pb-3 pt-2' : 'space-y-1.5 px-0.5 pb-1 pt-3')}>
		{#if showRating}
			<div class="flex gap-0.5" aria-hidden="true">
				{#each Array(5) as _, i}
					<Star
						class={cn(
							isGrid ? 'size-3.5' : 'size-[0.9rem]',
							i < 4
								? 'fill-foreground text-foreground'
								: isGrid
									? 'text-muted-foreground/40'
									: 'fill-none text-muted-foreground/35'
						)}
						strokeWidth={isGrid ? undefined : i < 4 ? 0 : 1.5}
					/>
				{/each}
			</div>
		{/if}

		<p
			class={cn(
				'truncate text-[11px] font-bold uppercase',
				isGrid ? 'tracking-wide text-muted-foreground' : 'tracking-[0.04em] text-foreground'
			)}
		>
			{book.author}
		</p>

		<a
			href={`/buku/${book.id}`}
			class={cn(
				'line-clamp-2 hover:underline',
				isGrid ? 'text-sm font-medium leading-snug' : 'text-[13px] font-normal leading-snug text-foreground'
			)}
		>
			{book.title}
		</a>

		{#if isGrid}
			<p class="text-lg font-bold tracking-tight">
				{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : book.wantedInExchange ?? 'Tukar buku'}
			</p>
			<div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
				<span class="rounded-sm bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">{book.condition}</span>
				<span class="inline-flex items-center gap-1"><MapPin class="size-3" />{book.city}</span>
			</div>
		{:else if !compact}
			<p class="pt-0.5 text-[15px] font-bold leading-none tracking-tight">
				{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : 'Tukar buku'}
			</p>
			{#if lowestLabel}
				<p class="text-[11px] text-muted-foreground">{lowestLabel}</p>
			{/if}
		{/if}
	</div>
</article>
