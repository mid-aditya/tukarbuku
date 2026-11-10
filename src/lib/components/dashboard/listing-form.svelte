<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/input.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import Select from '$lib/components/ui/select.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import type { ListingFormData } from '$lib/validation/book';

	type ListingValues = {
		title: string;
		author: string;
		condition: string;
		description: string;
		listingType: 'JUAL' | 'BARTER';
		price: string;
		wantedInExchange: string;
		city: string;
		coverImageUrl: string;
	};

	let {
		action,
		initial = {},
		form = null,
		submitLabel = 'Pasang listing',
		cancelHref = '/dashboard'
	}: {
		action?: string;
		initial?: Partial<ListingValues>;
		form?: ListingFormData | null;
		submitLabel?: string;
		cancelHref?: string;
	} = $props();

	// svelte-ignore state_referenced_locally
	let listingType: 'JUAL' | 'BARTER' = $state(initial.listingType ?? 'JUAL');
	// svelte-ignore state_referenced_locally
	let coverUrl = $state(initial.coverImageUrl ?? '');
	let loading = $state(false);

	const errors = $derived(form?.errors ?? {});
	const fieldError = (name: string) => errors[name as keyof typeof errors]?.[0];
	const coverLooksValid = $derived(/^https?:\/\//i.test(coverUrl.trim()));
</script>

<form
	method="POST"
	{action}
	class="flex flex-col gap-5"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			// Jangan reset agar error submit tidak mengosongkan isian user.
			await update({ reset: false });
			loading = false;
		};
	}}
>
	<fieldset class="grid gap-3 sm:grid-cols-2">
		<legend class="mb-2 text-sm font-medium">Tipe listing</legend>
		{#each [{ value: 'JUAL' as const, label: 'Dijual', desc: 'Pembeli membayar harga yang kamu tentukan.' }, { value: 'BARTER' as const, label: 'Barter', desc: 'Kamu menukar dengan buku lain yang kamu inginkan.' }] as type}
			<label
				class="cursor-pointer rounded-lg border p-4 transition-colors"
				class:border-primary={listingType === type.value}
				class:bg-muted={listingType === type.value}
			>
				<input type="radio" name="listingType" value={type.value} bind:group={listingType} class="sr-only" />
				<span class="block text-sm font-bold">{type.label}</span>
				<span class="block text-xs text-muted-foreground">{type.desc}</span>
			</label>
		{/each}
	</fieldset>

	<div class="grid gap-4 sm:grid-cols-2">
		<div class="grid gap-2">
			<Label for="title">Judul buku *</Label>
			<Input id="title" name="title" type="text" required maxlength="200" placeholder="Contoh: Laut Bercerita" value={initial.title} aria-invalid={!!fieldError('title')} />
			{#if fieldError('title')}<p class="text-xs font-semibold text-destructive">{fieldError('title')}</p>{/if}
		</div>
		<div class="grid gap-2">
			<Label for="author">Penulis *</Label>
			<Input id="author" name="author" type="text" required maxlength="160" placeholder="Contoh: Leila S. Chudori" value={initial.author} aria-invalid={!!fieldError('author')} />
			{#if fieldError('author')}<p class="text-xs font-semibold text-destructive">{fieldError('author')}</p>{/if}
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<div class="grid gap-2">
			<Label for="condition">Kondisi *</Label>
			<Select id="condition" name="condition" required aria-invalid={!!fieldError('condition')}>
				<option value="" selected={!initial.condition} disabled>Pilih kondisi</option>
				<option value="baru" selected={initial.condition === 'baru'}>Baru — belum pernah dibaca</option>
				<option value="baik" selected={initial.condition === 'baik'}>Baik — layak dibaca, tanpa kerusakan berarti</option>
				<option value="cukup" selected={initial.condition === 'cukup'}>Cukup — ada kerusakan ringan</option>
				<option value="rusak-ringan" selected={initial.condition === 'rusak-ringan'}>Rusak Ringan — perlu perbaikan kecil</option>
			</Select>
			{#if fieldError('condition')}<p class="text-xs font-semibold text-destructive">{fieldError('condition')}</p>{/if}
		</div>
		<div class="grid gap-2">
			<Label for="city">Kota COD *</Label>
			<Input id="city" name="city" type="text" required maxlength="100" placeholder="Contoh: Bandung" value={initial.city} aria-invalid={!!fieldError('city')} />
			{#if fieldError('city')}<p class="text-xs font-semibold text-destructive">{fieldError('city')}</p>{/if}
		</div>
	</div>

	<div class="grid gap-2">
		<Label for="description">Deskripsi kondisi *</Label>
		<Textarea id="description" name="description" required maxlength="5000" rows={4} placeholder="Ceritakan kondisi buku secara detail." value={initial.description ?? ''} aria-invalid={!!fieldError('description')} />
		{#if fieldError('description')}<p class="text-xs font-semibold text-destructive">{fieldError('description')}</p>{/if}
	</div>

	<div class="grid gap-2">
		<Label for="coverImageUrl">URL Foto Sampul *</Label>
		<Input
			id="coverImageUrl"
			name="coverImageUrl"
			type="url"
			required
			maxlength="2048"
			placeholder="https://..."
			bind:value={coverUrl}
			aria-invalid={!!fieldError('coverImageUrl')}
		/>
		<p class="text-xs text-muted-foreground">Tempelkan URL gambar sampul buku. Format yang didukung: JPG, PNG, WebP.</p>
		{#if fieldError('coverImageUrl')}<p class="text-xs font-semibold text-destructive">{fieldError('coverImageUrl')}</p>{/if}
		{#if coverLooksValid}
			<img
				src={coverUrl}
				alt="Pratinjau sampul buku"
				class="h-36 w-24 rounded-sm border object-cover"
				loading="lazy"
				decoding="async"
			/>
		{/if}
	</div>

	{#if listingType === 'JUAL'}
		<div class="grid gap-2">
			<Label for="price">Harga *</Label>
			<div class="flex items-center overflow-hidden rounded-md border" class:border-destructive={!!fieldError('price')}>
				<span class="flex h-9 items-center border-r bg-muted px-3 text-sm font-bold text-muted-foreground">Rp</span>
				<Input id="price" name="price" type="number" min="0" max="100000000" step="1000" placeholder="65000" value={initial.price} class="rounded-none border-0 shadow-none" />
			</div>
			{#if fieldError('price')}<p class="text-xs font-semibold text-destructive">{fieldError('price')}</p>{/if}
		</div>
	{:else}
		<div class="grid gap-2">
			<Label for="wantedInExchange">Buku yang kamu inginkan *</Label>
			<Textarea id="wantedInExchange" name="wantedInExchange" maxlength="1000" rows={3} placeholder="Contoh: Buku nonfiksi tentang psikologi." value={initial.wantedInExchange ?? ''} aria-invalid={!!fieldError('wantedInExchange')} />
			{#if fieldError('wantedInExchange')}<p class="text-xs font-semibold text-destructive">{fieldError('wantedInExchange')}</p>{/if}
		</div>
	{/if}

	{#if form?.error}
		<p class="rounded-md border-l-4 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">{form.error}</p>
	{/if}

	<div class="flex items-center justify-end gap-2 pt-2">
		<Button href={cancelHref} variant="ghost">Batal</Button>
		<Button type="submit" disabled={loading}>{loading ? 'Menyimpan…' : submitLabel}</Button>
	</div>
</form>
