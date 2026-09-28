<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
	let name = $state(data.session.user.name ?? '');
	let city = $state('');
	let phone = $state('');
</script>

<svelte:head><title>Lengkapi Profil — Tukarbuku</title></svelte:head>

<div class="mx-auto grid max-w-6xl place-items-center px-4 py-12 md:py-20">
	<Card class="w-full max-w-xl p-6 md:p-10">
		<p class="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Akun</p>
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Lengkapi profil pembaca</h1>
		<p class="mt-2 text-sm text-muted-foreground">Nama dan kota ditampilkan di listing buku-mu agar pembeli bisa menentukan lokasi COD.</p>

		<form
			method="POST"
			class="mt-8 flex flex-col gap-5"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="grid gap-2">
					<Label for="name">Nama tampilan</Label>
					<Input id="name" name="name" type="text" bind:value={name} required maxlength="120" />
				</div>
				<div class="grid gap-2">
					<Label for="city">Kota domisili *</Label>
					<Input id="city" name="city" type="text" bind:value={city} required maxlength="100" placeholder="Contoh: Bandung" />
				</div>
			</div>
			<div class="grid gap-2">
				<Label for="phone">Nomor HP <span class="font-normal text-muted-foreground">— opsional</span></Label>
				<Input id="phone" name="phone" type="tel" bind:value={phone} maxlength="32" placeholder="08xxxxxxxxxx" autocomplete="tel" />
			</div>

			{#if form?.error}
				<p class="rounded-md border-l-4 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">{form.error}</p>
			{/if}

			<div class="pt-2">
				<Button type="submit" disabled={loading} class="w-full sm:w-auto">{loading ? 'Menyimpan…' : 'Simpan profil'}</Button>
			</div>
		</form>

		<p class="mt-5 border-t pt-4 text-xs text-muted-foreground">Profil hanya digunakan untuk memfasilitasi transaksi COD. Nomor HP tidak ditampilkan di listing.</p>
	</Card>
</div>
