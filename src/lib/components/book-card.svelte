<script lang="ts">
	import Card from '$lib/components/ui/card.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Avatar from '$lib/components/ui/avatar.svelte';
	import { MapPin, ArrowUpRight } from '@lucide/svelte';
	import type { Book } from '$lib/data/books';

	let { book, formatPrice }: { book: Book; formatPrice: (n: number) => string } = $props();
</script>

<Card class="group overflow-hidden rounded-2xl transition-shadow hover:shadow-md">
	<a href={`/buku/${book.id}`} class="relative block bg-muted/60 p-4">
		<img
			src={book.cover}
			alt={`Sampul ${book.title}`}
			loading="lazy"
			width="160"
			height="220"
			class="mx-auto h-52 w-auto rounded-md object-cover shadow-md transition-transform group-hover:-translate-y-1 md:h-60"
		/>
		<Badge
			variant={book.listingType === 'JUAL' ? 'jual' : 'barter'}
			class="absolute left-3 top-3 rounded-full font-bold uppercase"
		>
			{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}
		</Badge>
	</a>
	<div class="space-y-1.5 p-4">
		<p class="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{book.author}</p>
		<a href={`/buku/${book.id}`} class="line-clamp-1 font-bold leading-snug hover:underline">{book.title}</a>
		<p class="text-lg font-black">
			{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : book.wantedInExchange}
		</p>
		<div class="flex items-center gap-2 text-xs text-muted-foreground">
			<span class="rounded-full bg-secondary px-2 py-0.5 font-semibold">{book.condition}</span>
			<span class="inline-flex items-center gap-1"><MapPin class="size-3" />{book.city}</span>
		</div>
		<div class="flex items-center gap-2 border-t pt-3 text-sm">
			<Avatar name={book.seller} class="size-7" />
			<span class="truncate text-muted-foreground">{book.seller}</span>
			<a
				href={`/buku/${book.id}`}
				aria-label={`Lihat detail ${book.title}`}
				class="ml-auto inline-flex size-8 items-center justify-center rounded-full border transition-colors hover:bg-accent"
			>
				<ArrowUpRight class="size-4" />
			</a>
		</div>
	</div>
</Card>
