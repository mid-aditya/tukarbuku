<script lang="ts">
	import type { PageData } from './$types';
	import Badge from '$lib/components/ui/badge.svelte';
	import Avatar from '$lib/components/ui/avatar.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	let { data }: { data: PageData } = $props();
	let saved = $state(false);
	let price = $derived(data.book.listingType === 'JUAL'
		? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.book.price ?? 0)
		: data.book.wantedInExchange);
</script>

<svelte:head>
	<title>{data.book.title} oleh {data.book.author} — Tukarbuku</title>
	<meta name="description" content={`${data.book.title} oleh ${data.book.author}, kondisi ${data.book.condition}, tersedia di ${data.book.city}.`} />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8">
	<nav class="flex gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb"><a href="/" class="text-primary">Koleksi</a><span>/</span><span class="truncate">{data.book.title}</span></nav>

	<div class="mt-6 grid gap-10 md:grid-cols-2">
		<section>
			<div class="grid h-[480px] place-items-center rounded-xl border bg-muted/50">
				<img src={data.book.cover} alt={`Sampul ${data.book.title}`} width="360" height="500" class="h-96 w-64 object-cover shadow-lg" />
			</div>
			<div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
				<img src={data.book.cover} alt="Tampilan sampul depan" class="h-16 w-12 rounded border object-cover" />
				<div><p class="font-semibold text-foreground">1 foto</p><p>Diunggah pemilik</p></div>
			</div>
		</section>

		<section>
			<div class="flex items-center justify-between">
				<Badge variant={data.book.listingType === 'JUAL' ? 'jual' : 'barter'}>{data.book.listingType === 'JUAL' ? 'DIJUAL' : 'BARTER'}</Badge>
				<Button variant="link" size="sm" onclick={() => (saved = !saved)}>{saved ? 'Tersimpan' : 'Simpan buku'}</Button>
			</div>
			<h1 class="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{data.book.title}</h1>
			<p class="mt-1 text-muted-foreground">{data.book.author}</p>

			<div class="mt-6 flex flex-col gap-1 border-y py-4">
				<span class="text-xs font-bold uppercase tracking-widest text-muted-foreground">{data.book.listingType === 'JUAL' ? 'Harga' : 'Dicari sebagai pengganti'}</span>
				<strong class="text-2xl text-primary">{price}</strong>
			</div>

			<dl class="grid grid-cols-2 border-b text-sm">
				<div class="border-b py-3"><dt class="text-xs text-muted-foreground">Kondisi</dt><dd class="font-medium">{data.book.condition}</dd></div>
				<div class="border-b py-3"><dt class="text-xs text-muted-foreground">Lokasi COD</dt><dd class="font-medium">{data.book.city}</dd></div>
				<div class="py-3"><dt class="text-xs text-muted-foreground">Status</dt><dd class="font-medium">● Tersedia</dd></div>
				<div class="py-3"><dt class="text-xs text-muted-foreground">Diposting</dt><dd class="font-medium">Baru-baru ini</dd></div>
			</dl>

			<Card class="mt-4 bg-muted/50 p-5">
				<h2 class="font-semibold">Catatan kondisi</h2>
				<p class="mt-1 text-sm text-muted-foreground">Buku masih layak dibaca dan siap berpindah tangan. Tanyakan detail noda, lipatan, atau coretan kepada pemilik melalui chat.</p>
			</Card>

			<Card class="mt-4 flex items-center gap-3 p-4">
				<Avatar name={data.book.seller} />
				<div class="min-w-0 flex-1">
					<p class="text-xs text-muted-foreground">Pemilik buku</p>
					<p class="truncate text-sm font-bold">{data.book.seller}</p>
					<p class="text-xs text-muted-foreground">{data.book.city}</p>
				</div>
				<Button href={`/login?redirectTo=/buku/${data.book.id}`} variant="outline" size="sm">Lihat profil</Button>
			</Card>

			<Button href={`/login?redirectTo=/buku/${data.book.id}`} size="lg" class="mt-4 w-full">{data.book.listingType === 'JUAL' ? 'Chat penjual' : 'Ajukan barter'}</Button>
			<p class="mt-2 text-center text-xs text-muted-foreground">Masuk dengan Google untuk memulai percakapan.</p>
		</section>
	</div>

	<Card class="mt-12 grid gap-6 bg-muted/50 p-6 md:grid-cols-[240px_1fr]">
		<div><p class="text-xs font-bold uppercase tracking-widest text-primary">Panduan transaksi</p><h2 class="text-xl font-bold">Periksa sebelum sepakat.</h2></div>
		<ul class="grid gap-4 text-sm md:grid-cols-3">
			<li><p class="font-semibold">Bertemu di tempat umum.</p><p class="text-muted-foreground">Pilih lokasi ramai dan waktu yang aman.</p></li>
			<li><p class="font-semibold">Periksa kondisi buku.</p><p class="text-muted-foreground">Pastikan sesuai foto dan deskripsi.</p></li>
			<li><p class="font-semibold">Tetap gunakan chat.</p><p class="text-muted-foreground">Simpan riwayat kesepakatan di Tukarbuku.</p></li>
		</ul>
	</Card>
</div>
