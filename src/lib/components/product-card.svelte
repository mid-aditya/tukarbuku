<script lang="ts">
	import { Heart, Star } from '@lucide/svelte';
	import type { Book } from '$lib/data/books';

	let {
		book,
		formatPrice,
		showRating = true,
		compact = false
	}: {
		book: Book;
		formatPrice: (n: number) => string;
		showRating?: boolean;
		compact?: boolean;
	} = $props();

	const lowestLabel = $derived(
		book.listingType === 'JUAL' && book.price ? `Harga terendah ${formatPrice(Math.round(book.price * 0.92))}` : null
	);
</script>

<article class="group w-[10.75rem] shrink-0 snap-start sm:w-[12.5rem] md:w-[14rem]">
	<a
		href={`/buku/${book.id}`}
		class="relative block aspect-[4/5] bg-[hsl(40_8%_93%)] p-5 transition-colors hover:bg-[hsl(40_8%_90%)] dark:bg-muted/80"
	>
		<button
			type="button"
			class="absolute right-2 top-2 z-10 grid size-9 place-items-center text-foreground/70 transition-colors hover:text-foreground"
			aria-label="Simpan ke favorit"
			onclick={(e) => e.preventDefault()}
		>
			<Heart class="size-[1.35rem] stroke-[1.25]" />
		</button>
		<img
			src={book.cover}
			alt={`Sampul ${book.title}`}
			loading="lazy"
			width="280"
			height="350"
			class="mx-auto h-full max-h-[85%] w-full object-contain object-bottom"
		/>
	</a>

	<div class="space-y-1.5 bg-transparent px-0.5 pb-1 pt-3">
		{#if showRating}
			<div class="flex gap-0.5" aria-hidden="true">
				{#each Array(5) as _, i}
					<Star
						class="size-[0.9rem] {i < 4 ? 'fill-foreground text-foreground' : 'fill-none text-muted-foreground/35'}"
						strokeWidth={i < 4 ? 0 : 1.5}
					/>
				{/each}
			</div>
		{/if}

		<p class="truncate text-[11px] font-bold uppercase tracking-[0.04em] text-foreground">{book.author}</p>

		<a href={`/buku/${book.id}`} class="line-clamp-2 text-[13px] font-normal leading-snug text-foreground hover:underline">
			{book.title}
		</a>

		{#if !compact}
			<p class="pt-0.5 text-[15px] font-bold leading-none tracking-tight">
				{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : 'Tukar buku'}
			</p>
			{#if lowestLabel}
				<p class="text-[11px] text-muted-foreground">{lowestLabel}</p>
			{/if}
		{/if}
	</div>
</article>
