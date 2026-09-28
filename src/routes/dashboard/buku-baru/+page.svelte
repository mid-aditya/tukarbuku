<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import Select from '$lib/components/ui/select.svelte';
	import Label from '$lib/components/ui/label.svelte';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
	let listingType: 'JUAL' | 'BARTER' = $state('JUAL');
</script>

<svelte:head><title>Pasang Buku — Tukarbuku</title></svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="mx-auto max-w-2xl">
		<p class="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Pasang listing baru</p>
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Ceritakan buku yang ingin berpindah.</h1>
		<p class="mt-2 text-sm text-muted-foreground">Semakin lengkap deskripsinya, semakin cepat pembeli menemukan dan tertarik.</p>

		<Card class="mt-8 p-6 md:p-8">
			<form
				method="POST"
				class="flex flex-col gap-5"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<fieldset class="grid gap-3 sm:grid-cols-2">
					<legend class="mb-2 text-sm font-medium">Tipe listing</legend>
					<label class="cursor-pointer rounded-lg border p-4 transition-colors" class:border-primary={listingType === 'JUAL'} class:bg-muted={listingType === 'JUAL'}>
						<input type="radio" name="listingType" value="JUAL" bind:group={listingType} class="sr-only" />
						<span class="block text-sm font-bold">Dijual</span>
						<span class="block text-xs text-muted-foreground">Pembeli membayar harga yang kamu tentukan.</span>
					</label>
					<label class="cursor-pointer rounded-lg border p-4 transition-colors" class:border-primary={listingType === 'BARTER'} class:bg-muted={listingType === 'BARTER'}>
						<input type="radio" name="listingType" value="BARTER" bind:group={listingType} class="sr-only" />
						<span class="block text-sm font-bold">Barter</span>
						<span class="block text-xs text-muted-foreground">Kamu menukar dengan buku lain yang kamu inginkan.</span>
					</label>
				</fieldset>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="grid gap-2">
						<Label for="title">Judul buku *</Label>
						<Input id="title" name="title" type="text" required maxlength="200" placeholder="Contoh: Laut Bercerita" />
					</div>
					<div class="grid gap-2">
						<Label for="author">Penulis *</Label>
						<Input id="author" name="author" type="text" required maxlength="160" placeholder="Contoh: Leila S. Chudori" />
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="grid gap-2">
						<Label for="condition">Kondisi *</Label>
						<Select id="condition" name="condition" required>
							<option value="">Pilih kondisi</option>
							<option value="baru">Baru — belum pernah dibaca</option>
							<option value="baik">Baik — layak dibaca, tanpa kerusakan berarti</option>
							<option value="cukup">Cukup — ada kerusakan ringan</option>
							<option value="rusak-ringan">Rusak Ringan — perlu perbaikan kecil</option>
						</Select>
					</div>
					<div class="grid gap-2">
						<Label for="city">Kota COD *</Label>
						<Input id="city" name="city" type="text" required maxlength="100" placeholder="Contoh: Bandung" />
					</div>
				</div>

				<div class="grid gap-2">
					<Label for="description">Deskripsi kondisi *</Label>
					<Textarea id="description" name="description" required maxlength="5000" rows={4} placeholder="Ceritakan kondisi buku secara detail."></Textarea>
				</div>

				<div class="grid gap-2">
					<Label for="coverImageUrl">URL Foto Sampul *</Label>
					<Input id="coverImageUrl" name="coverImageUrl" type="url" required maxlength="2048" placeholder="https://..." />
					<p class="text-xs text-muted-foreground">Tempelkan URL gambar sampul buku. Format yang didukung: JPG, PNG, WebP.</p>
				</div>

				{#if listingType === 'JUAL'}
					<div class="grid gap-2">
						<Label for="price">Harga *</Label>
						<div class="flex items-center overflow-hidden rounded-md border">
							<span class="flex h-9 items-center border-r bg-muted px-3 text-sm font-bold text-muted-foreground">Rp</span>
							<Input id="price" name="price" type="number" min="0" max="100000000" step="1000" placeholder="65000" class="rounded-none border-0 shadow-none" />
						</div>
					</div>
				{:else}
					<div class="grid gap-2">
						<Label for="wantedInExchange">Buku yang kamu inginkan *</Label>
						<Textarea id="wantedInExchange" name="wantedInExchange" maxlength="1000" rows={3} placeholder="Contoh: Buku nonfiksi tentang psikologi."></Textarea>
					</div>
				{/if}

				{#if form?.error}
					<p class="rounded-md border-l-4 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">{form.error}</p>
				{/if}

				<div class="flex items-center justify-end gap-2 pt-2">
					<Button href="/dashboard" variant="ghost">Batal</Button>
					<Button type="submit" disabled={loading}>{loading ? 'Menyimpan…' : 'Pasang listing'}</Button>
				</div>
			</form>
		</Card>
	</div>
</div>
