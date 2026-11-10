<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import ListingForm from '$lib/components/dashboard/listing-form.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deleting = $state(false);

	function confirmDelete(event: SubmitEvent) {
		if (!window.confirm('Hapus listing ini? Tindakan ini tidak bisa dibatalkan.')) event.preventDefault();
	}

	const book = $derived(data.book);
	const priceInitial = $derived(book.listingType === 'JUAL' && book.price != null ? String(book.price) : '');
</script>

<svelte:head><title>Edit {book.title} — Tukarbuku</title></svelte:head>

<main class="mx-auto max-w-6xl px-4 py-10">
	<div class="mx-auto max-w-2xl">
		<nav aria-label="Kembali" class="mb-3">
			<a href="/dashboard" class="text-sm font-semibold text-primary hover:underline">← Kembali ke dashboard</a>
		</nav>
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Ubah listing</h1>
		<div class="mt-3 flex flex-wrap items-center gap-2">
			<span class="text-sm text-muted-foreground">{book.title}</span>
			<Badge variant={book.listingType === 'JUAL' ? 'jual' : 'barter'} class="text-[10px] font-bold uppercase">
				{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}
			</Badge>
			<Badge variant="secondary" class="text-[10px] font-bold uppercase">{book.status}</Badge>
		</div>

		<Card class="mt-8 p-6 md:p-8">
			<ListingForm
				form={form}
				submitLabel="Simpan perubahan"
				action="?/update"
				initial={{
					title: book.title,
					author: book.author,
					condition: book.condition,
					description: book.description,
					listingType: book.listingType === 'BARTER' ? 'BARTER' : 'JUAL',
					price: priceInitial,
					wantedInExchange: book.wantedInExchange ?? '',
					city: book.city,
					coverImageUrl: book.coverImageUrl
				}}
			/>
		</Card>

		<Card class="mt-4 border-destructive/40 bg-destructive/5 p-4 md:p-6">
			<p class="text-sm font-bold text-destructive">Zona bahaya</p>
			<p class="mt-1 text-xs text-muted-foreground">Menghapus listing menghilangkannya dari katalog secara permanen.</p>
			{#if form?.deleteError}
				<p class="mt-3 rounded-md border-l-4 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">{form.deleteError}</p>
			{/if}
			<form
				method="POST"
				action="?/delete"
				onsubmit={confirmDelete}
				class="mt-3"
				use:enhance={() => {
					deleting = true;
					return async ({ update }) => {
						await update({ reset: false });
						deleting = false;
					};
				}}
			>
				<Button type="submit" variant="destructive" disabled={deleting}>{deleting ? 'Menghapus…' : 'Hapus listing'}</Button>
			</form>
		</Card>
	</div>
</main>
