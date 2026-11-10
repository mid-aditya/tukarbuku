<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import ListingForm from '$lib/components/dashboard/listing-form.svelte';
	import Card from '$lib/components/ui/card.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Pasang Buku — Tukarbuku</title></svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="mx-auto max-w-2xl">
		<p class="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Pasang listing baru</p>
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Ceritakan buku yang ingin berpindah.</h1>
		<p class="mt-2 text-sm text-muted-foreground">Semakin lengkap deskripsinya, semakin cepat pembeli menemukan dan tertarik.</p>

		<Card class="mt-8 p-6 md:p-8">
			<ListingForm form={form} initial={{ city: data.userCity ?? undefined }} />
		</Card>
	</div>
</div>
