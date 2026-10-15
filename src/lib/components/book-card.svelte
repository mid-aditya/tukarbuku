<script lang="ts">
	import Badge from '$lib/components/ui/badge.svelte';
	import { Heart, Star, MapPin } from '@lucide/svelte';
	import type { Book } from '$lib/data/books';

	let { book, formatPrice }: { book: Book; formatPrice: (n: number) => string } = $props();
</script>

<article class="group flex h-full flex-col bg-card">
	<a href={`/buku/${book.id}`} class="relative block bg-muted/80 p-4 transition-colors hover:bg-muted">
		<button
			type="button"
			class="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-card/90 text-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
			aria-label="Simpan ke favorit"
			onclick={(e) => e.preventDefault()}
		>
			<Heart class="size-4" />
		</button>
		<img
			src={book.cover}
			alt={`Sampul ${book.title}`}
			loading="lazy"
			width="160"
			height="220"
			class="mx-auto h-48 w-auto object-contain md:h-52"
		/>
		<Badge
			variant={book.listingType === 'JUAL' ? 'jual' : 'barter'}
			class="absolute left-2 top-2 rounded-sm text-[10px] font-bold uppercase"
		>
			{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}
		</Badge>
	</a>
	<div class="flex flex-1 flex-col space-y-1 px-2 pb-3 pt-2">
		<div class="flex gap-0.5" aria-hidden="true">
			{#each Array(5) as _, i}
				<Star class="size-3.5 {i < 4 ? 'fill-foreground text-foreground' : 'text-muted-foreground/40'}" />
			{/each}
		</div>
		<p class="truncate text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{book.author}</p>
		<a href={`/buku/${book.id}`} class="line-clamp-2 text-sm font-medium leading-snug hover:underline">{book.title}</a>
		<p class="text-lg font-bold tracking-tight">
			{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : book.wantedInExchange ?? 'Tukar buku'}
		</p>
		<div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
			<span class="rounded-sm bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">{book.condition}</span>
			<span class="inline-flex items-center gap-1"><MapPin class="size-3" />{book.city}</span>
		</div>
	</div>
</article>
