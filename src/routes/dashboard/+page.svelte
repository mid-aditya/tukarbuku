<script lang="ts">
	import type { PageData } from './$types';
	import { SignOut } from '@auth/sveltekit/components';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Dashboard — Tukarbuku</title></svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="mb-1 text-xs font-bold uppercase tracking-widest text-primary">Dashboard</p>
			<h1 class="text-3xl font-bold tracking-tight md:text-5xl">Selamat datang, {data.session?.user?.name?.split(' ')[0] ?? 'Pembaca'}</h1>
			<p class="mt-2 text-sm text-muted-foreground">Kelola listing, penawaran, dan percakapan dari satu tempat. <span class="ml-2">{data.session?.user?.name ?? 'Pembaca'}</span>
				<SignOut><span slot="submitButton" class="cursor-pointer text-primary underline">Keluar</span></SignOut>
			</p>
		</div>
		<Button href="/dashboard/buku-baru">Pasang buku</Button>
	</div>

	<div class="mt-8 grid gap-4 md:grid-cols-3">
		<Card class="p-6"><p class="text-sm text-muted-foreground">Listing aktif</p><p class="mt-1 text-3xl font-bold">0</p><p class="text-xs text-muted-foreground">Belum ada buku</p></Card>
		<Card class="p-6"><p class="text-sm text-muted-foreground">Penawaran masuk</p><p class="mt-1 text-3xl font-bold">0</p><p class="text-xs text-muted-foreground">Tidak ada yang menunggu</p></Card>
		<Card class="p-6"><p class="text-sm text-muted-foreground">Pesan belum dibaca</p><p class="mt-1 text-3xl font-bold">0</p><p class="text-xs text-muted-foreground">Semua sudah dibaca</p></Card>
	</div>

	<div class="mt-4 grid gap-4 md:grid-cols-[1fr_320px]">
		<Card class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<div><p class="text-xs font-bold uppercase tracking-widest text-primary">Buku saya</p><h2 class="text-xl font-bold">Listing terbaru</h2></div>
				<Button href="/dashboard/buku-baru" variant="outline" size="sm">Tambah baru</Button>
			</div>
			<div class="rounded-lg bg-muted/50 p-8 text-center">
				<h3 class="font-semibold">Belum ada buku yang dipasang</h3>
				<p class="mt-1 text-sm text-muted-foreground">Mulai dari satu buku yang sudah selesai kamu baca.</p>
				<Button href="/dashboard/buku-baru" size="sm" class="mt-4">Pasang buku pertama</Button>
			</div>
		</Card>
		<Card class="p-6">
			<p class="text-xs font-bold uppercase tracking-widest text-primary">Aktivitas</p>
			<h2 class="text-xl font-bold">Terbaru</h2>
			<div class="mt-4 rounded-lg bg-muted/50 p-6 text-center text-sm text-muted-foreground">
				<p class="font-medium text-foreground">Belum ada aktivitas.</p>
				<p class="mt-1 text-xs">Pesan dan perubahan status transaksi akan muncul di sini.</p>
			</div>
		</Card>
	</div>

	<Card class="mt-4 bg-muted/50 p-6">
		<p class="font-semibold">Transaksi aman dimulai dari kebiasaan sederhana.</p>
		<p class="mt-1 text-sm text-muted-foreground">Gunakan chat Tukarbuku, bertemu di tempat umum, dan periksa kondisi buku sebelum membayar.</p>
	</Card>
</div>
