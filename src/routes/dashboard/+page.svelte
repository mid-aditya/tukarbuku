<script lang="ts">
	import type { PageData } from './$types';
	import { SignOut } from '@auth/sveltekit/components';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';

	let { data }: { data: PageData } = $props();

	const formatPrice = (price?: number | null) =>
		price == null
			? 'Barter'
			: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
					price
				);
	const formatDate = (iso: string) =>
		new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(iso));
</script>

<svelte:head><title>Dashboard — Tukarbuku</title></svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="mb-1 text-xs font-bold uppercase tracking-widest text-primary">Dashboard</p>
			<h1 class="text-3xl font-bold tracking-tight md:text-5xl">
				Selamat datang, {data.session?.user?.name?.split(' ')[0] ?? 'Pembaca'}
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Kelola listing, penawaran, dan percakapan dari satu tempat.
				<SignOut><span slot="submitButton" class="ml-2 cursor-pointer text-primary underline">Keluar</span></SignOut>
			</p>
		</div>
		<Button href="/dashboard/buku-baru">Pasang buku</Button>
	</div>

	{#if !data.dbAvailable}
		<Card class="mt-6 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
			Database belum tersedia, jadi angka di bawah belum bisa dimuat.
		</Card>
	{/if}

	<div class="mt-8 grid gap-4 md:grid-cols-3">
		<Card class="p-6">
			<p class="text-sm text-muted-foreground">Listing aktif</p>
			<p class="mt-1 text-3xl font-bold">{data.summary.activeListings}</p>
			<p class="text-xs text-muted-foreground">
				{data.summary.activeListings ? 'Tayang di katalog' : 'Belum ada buku'}
			</p>
		</Card>
		<Card class="p-6">
			<p class="text-sm text-muted-foreground">Penawaran masuk</p>
			<p class="mt-1 text-3xl font-bold">{data.summary.pendingOffers}</p>
			<p class="text-xs text-muted-foreground">
				{data.summary.pendingOffers ? 'Menunggu jawabanmu' : 'Tidak ada yang menunggu'}
			</p>
		</Card>
		<Card class="p-6">
			<p class="text-sm text-muted-foreground">Pesan belum dibaca</p>
			<p class="mt-1 text-3xl font-bold">{data.summary.unreadMessages}</p>
			<p class="text-xs text-muted-foreground">
				{data.summary.unreadMessages ? 'Balas dari halaman pesan' : 'Semua sudah dibaca'}
			</p>
		</Card>
	</div>

	<div class="mt-4 grid gap-4 md:grid-cols-[1fr_320px]">
		<Card class="p-6">
			<div class="mb-4 flex items-center justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-widest text-primary">Buku saya</p>
					<h2 class="text-xl font-bold">Listing terbaru</h2>
				</div>
				<Button href="/dashboard/buku-baru" variant="outline" size="sm">Tambah baru</Button>
			</div>

			{#if data.summary.recentListings.length}
				<ul class="divide-y">
					{#each data.summary.recentListings as book (book.id)}
						<li class="flex items-center gap-3 py-3">
							<img
								src={book.cover}
								alt={`Sampul ${book.title}`}
								class="h-14 w-10 rounded-sm border object-cover"
								loading="lazy"
								decoding="async"
							/>
							<div class="min-w-0 flex-1">
								<a href={`/buku/${book.id}`} class="line-clamp-1 text-sm font-semibold hover:underline">
									{book.title}
								</a>
								<p class="truncate text-xs text-muted-foreground">{book.author} · {book.city}</p>
								<p class="text-xs text-muted-foreground">Dipasang {formatDate(book.createdAt)}</p>
							</div>
							<div class="flex shrink-0 flex-col items-end gap-1">
								<a href={`/dashboard/buku/${book.id}/edit`} class="text-xs font-semibold text-primary hover:underline">Edit</a>
								<Badge variant={book.listingType === 'JUAL' ? 'jual' : 'barter'} class="text-[10px] font-bold uppercase">
									{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}
								</Badge>
								<span class="text-xs font-semibold">{formatPrice(book.price)}</span>
							</div>
						</li>
					{/each}
				</ul>
				<div class="mt-3">
					<Button href="/koleksi" variant="link" size="sm">Lihat di katalog</Button>
				</div>
			{:else}
				<div class="rounded-lg bg-muted/50 p-8 text-center">
					<h3 class="font-semibold">Belum ada buku yang dipasang</h3>
					<p class="mt-1 text-sm text-muted-foreground">Mulai dari satu buku yang sudah selesai kamu baca.</p>
					<Button href="/dashboard/buku-baru" size="sm" class="mt-4">Pasang buku pertama</Button>
				</div>
			{/if}
		</Card>

		<Card class="p-6">
			<p class="text-xs font-bold uppercase tracking-widest text-primary">Aktivitas</p>
			<h2 class="text-xl font-bold">Terbaru</h2>
			<div class="mt-4 flex flex-col gap-3">
				<a href="/dashboard/pesanku" class="rounded-lg bg-muted/50 p-4 hover:bg-muted">
					<p class="text-sm font-semibold">Pesan</p>
					<p class="text-xs text-muted-foreground">
						{data.summary.unreadMessages
							? `${data.summary.unreadMessages} pesan belum dibaca`
							: 'Tidak ada pesan baru'}
					</p>
				</a>
				<a href="/dashboard/buku-baru" class="rounded-lg bg-muted/50 p-4 hover:bg-muted">
					<p class="text-sm font-semibold">Pasang listing baru</p>
					<p class="text-xs text-muted-foreground">Gratis, langsung tayang di katalog</p>
				</a>
			</div>
		</Card>
	</div>

	<Card class="mt-4 bg-muted/50 p-6">
		<p class="font-semibold">Transaksi aman dimulai dari kebiasaan sederhana.</p>
		<p class="mt-1 text-sm text-muted-foreground">
			Gunakan chat Tukarbuku, bertemu di tempat umum, dan periksa kondisi buku sebelum membayar.
		</p>
	</Card>
</div>
