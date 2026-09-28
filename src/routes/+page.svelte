<script lang="ts">
	import type { Book } from '$lib/data/books';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import {
		ArrowRight,
		ArrowLeft,
		Truck,
		ShieldCheck,
		ArrowLeftRight,
		BadgePercent,
		Sparkles,
		Search,
		MessagesSquare,
		Handshake,
		LibraryBig,
		Banknote,
		Star,
		Quote,
		BookOpenText,
		ChevronRight
	} from '@lucide/svelte';

	let { data }: { data: { books: Book[] } } = $props();

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

	const bestsellers = data.books.slice(0, 6);
	const deals = data.books.filter((b) => b.listingType === 'BARTER');
	const heroBook = data.books[0];

	let track: HTMLElement | null = $state(null);
	const scrollBy = (dx: number) => track?.scrollBy({ left: dx, behavior: 'smooth' });

	const usps = [
		{ icon: Truck, title: 'COD fleksibel', desc: 'Atur lokasi bertemu di kotamu' },
		{ icon: BadgePercent, title: 'Gratis pasang', desc: 'Listing tanpa biaya apapun' },
		{ icon: ShieldCheck, title: 'Periksa dulu', desc: 'Cek kondisi sebelum sepakat' },
		{ icon: ArrowLeftRight, title: 'Bisa barter', desc: 'Tukar dengan buku impianmu' }
	];

	const tips = [
		{ icon: Search, tag: 'Panduan', title: 'Cara menilai kondisi buku bekas', desc: 'Bedakan kondisi Baru, Baik, dan Cukup sebelum kamu chat penjual.' },
		{ icon: MessagesSquare, tag: 'Tips chat', title: '5 pertanyaan wajib sebelum COD', desc: 'Dari foto halaman dalam sampai riwayat noda dan lipatan.' },
		{ icon: Handshake, tag: 'Keamanan', title: 'COD aman untuk pertama kali', desc: 'Pilih tempat ramai, bawa teman, dan simpan bukti chat.' }
	];
</script>

<svelte:head><title>Tukarbuku — Jual dan barter buku bekas</title></svelte:head>

<main class="mx-auto max-w-7xl px-4">
	<!-- HERO -->
	<section class="grid gap-3 py-5 lg:grid-cols-3" aria-label="Promo utama">
		<a
			href="/koleksi"
			class="group relative overflow-hidden rounded-3xl bg-foreground text-background lg:col-span-2"
		>
			<div class="flex min-h-72 flex-col justify-end p-6 md:min-h-96 md:p-10">
				<p class="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-widest text-accent-foreground">
					<Sparkles class="size-3.5" /> Koleksi komunitas
				</p>
				<h1 class="mt-3 max-w-xl text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
					Buku next-mu ada di tetanggamu
				</h1>
				<p class="mt-3 max-w-md font-medium opacity-80">Beli atau barter langsung dengan pemiliknya. Chat, COD, beres.</p>
				<span class="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-black uppercase text-foreground transition-transform group-hover:translate-x-1">
					Belanja sekarang <ArrowRight class="size-4" />
				</span>
			</div>
			{#if heroBook}
				<img
					src={heroBook.cover}
					alt=""
					aria-hidden="true"
					class="pointer-events-none absolute -right-8 top-1/2 hidden w-56 -translate-y-1/2 rotate-6 rounded-2xl opacity-90 shadow-2xl md:block lg:w-64"
				/>
			{/if}
		</a>
		<div class="grid gap-3">
			<a href="/koleksi?type=BARTER" class="group flex items-center gap-4 overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground">
				<span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-black/15"><ArrowLeftRight class="size-6" /></span>
				<span>
					<span class="block text-lg font-black uppercase leading-tight">Coba barter</span>
					<span class="text-sm opacity-80">Tukar dengan buku impianmu</span>
				</span>
				<ChevronRight class="ml-auto size-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a href="/dashboard/buku-baru" class="group flex items-center gap-4 overflow-hidden rounded-3xl bg-accent p-5 text-accent-foreground">
				<span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-black/15"><Banknote class="size-6" /></span>
				<span>
					<span class="block text-lg font-black uppercase leading-tight">Jual bukumu</span>
					<span class="text-sm opacity-80">Pasang listing gratis</span>
				</span>
				<ChevronRight class="ml-auto size-5 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</section>

	<!-- USP -->
	<section class="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Keunggulan">
		{#each usps as u}
			<div class="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5">
				<span class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><u.icon class="size-5" /></span>
				<span><span class="block text-sm font-black uppercase">{u.title}</span><span class="block text-xs text-muted-foreground">{u.desc}</span></span>
			</div>
		{/each}
	</section>

	<!-- BESTSELLER CAROUSEL -->
	<section class="py-10" aria-label="Buku terlaris">
		<div class="mb-5 flex items-end justify-between gap-3">
			<div>
				<p class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary"><Star class="size-4" /> Paling dicari</p>
				<h2 class="mt-1 text-3xl font-black uppercase tracking-tight md:text-4xl">Bestseller</h2>
			</div>
			<div class="flex items-center gap-2">
				<button onclick={() => scrollBy(-320)} aria-label="Geser kiri" class="grid size-10 place-items-center rounded-full border hover:bg-muted"><ArrowLeft class="size-4" /></button>
				<button onclick={() => scrollBy(320)} aria-label="Geser kanan" class="grid size-10 place-items-center rounded-full border hover:bg-muted"><ArrowRight class="size-4" /></button>
				<Button href="/koleksi" variant="outline" size="sm" class="hidden rounded-full font-bold uppercase sm:inline-flex">Semua</Button>
			</div>
		</div>
		<div bind:this={track} class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{#each bestsellers as book, i (book.id)}
				<article class="w-44 shrink-0 snap-start overflow-hidden rounded-2xl border bg-card md:w-52">
					<a href={`/buku/${book.id}`} class="relative block bg-muted/60 p-3">
						<img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" width="160" height="220" class="mx-auto h-44 rounded-md object-cover shadow md:h-52" />
						<Badge variant={book.listingType === 'JUAL' ? 'jual' : 'barter'} class="absolute left-2 top-2 rounded-full text-[10px] font-black uppercase">
							{book.listingType === 'JUAL' ? 'Dijual' : 'Barter'}
						</Badge>
						{#if i < 3}
							<span class="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-foreground text-xs font-black text-background">#{i + 1}</span>
						{/if}
					</a>
					<div class="space-y-1 p-3">
						<p class="truncate text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{book.author}</p>
						<a href={`/buku/${book.id}`} class="line-clamp-1 text-sm font-bold hover:underline">{book.title}</a>
						<p class="font-black">{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : 'Barter'}</p>
					</div>
				</article>
			{/each}
			<a href="/koleksi" class="grid w-44 shrink-0 snap-start place-items-center rounded-2xl border border-dashed text-sm font-black uppercase text-muted-foreground hover:bg-muted md:w-52">
				Lihat semua →
			</a>
		</div>
	</section>

	<!-- CATEGORY TILES -->
	<section class="grid gap-3 sm:grid-cols-3" aria-label="Belanja per kategori">
		{#each [{ t: 'Dijual', d: 'Harga langsung dari pemilik', href: '/koleksi?type=JUAL', icon: Banknote }, { t: 'Barter', d: 'Tukar dengan koleksimu', href: '/koleksi?type=BARTER', icon: ArrowLeftRight }, { t: 'Semua koleksi', d: 'Jelajahi semua listing', href: '/koleksi', icon: LibraryBig }] as c}
			<a href={c.href} class="group flex items-center gap-4 rounded-3xl border bg-card p-5 transition-colors hover:bg-muted">
				<span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground"><c.icon class="size-6" /></span>
				<span><span class="block font-black uppercase">{c.t}</span><span class="block text-sm text-muted-foreground">{c.d}</span></span>
				<ArrowRight class="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
			</a>
		{/each}
	</section>

	<!-- GOLDEN DEALS -->
	<section class="my-10 overflow-hidden rounded-3xl bg-accent text-accent-foreground" aria-label="Penawaran barter">
		<div class="flex flex-col gap-5 p-6 md:flex-row md:items-center md:p-10">
			<div class="md:max-w-sm">
				<p class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><BadgePercent class="size-4" /> Penawaran spesial</p>
				<h2 class="mt-2 text-3xl font-black uppercase leading-none md:text-4xl">Barter favorit komunitas</h2>
				<p class="mt-2 text-sm font-medium opacity-80">Tukar buku yang sudah tamat dengan bacaan barumu. Tanpa uang keluar.</p>
				<Button href="/koleksi?type=BARTER" class="mt-4 rounded-full bg-foreground font-black uppercase text-background hover:opacity-90">Lihat barter</Button>
			</div>
			<div class="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
				{#each deals.slice(0, 3) as book (book.id)}
					<a href={`/buku/${book.id}`} class="overflow-hidden rounded-2xl bg-black/10 p-3 backdrop-blur transition-transform hover:-translate-y-1">
						<img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" width="160" height="220" class="mx-auto h-36 rounded-md object-cover shadow md:h-44" />
						<p class="mt-2 line-clamp-1 text-sm font-bold">{book.title}</p>
						<p class="truncate text-xs opacity-75">{book.wantedInExchange}</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- SPLIT BANNERS -->
	<section class="grid gap-3 md:grid-cols-2" aria-label="Promo">
		<a href="/dashboard/buku-baru" class="group overflow-hidden rounded-3xl bg-foreground p-6 text-background md:p-8">
			<BookOpenText class="size-8" />
			<h3 class="mt-3 text-2xl font-black uppercase leading-none">Rakmu penuh? Jual yang sudah tamat</h3>
			<p class="mt-2 text-sm opacity-70">Pasang listing dalam 2 menit, gratis.</p>
			<span class="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase">Pasang buku <ArrowRight class="size-4 transition-transform group-hover:translate-x-1" /></span>
		</a>
		<a href="/cara-kerja" class="group overflow-hidden rounded-3xl border bg-card p-6 md:p-8">
			<ShieldCheck class="size-8 text-primary" />
			<h3 class="mt-3 text-2xl font-black uppercase leading-none">Baru pertama kali COD buku?</h3>
			<p class="mt-2 text-sm text-muted-foreground">Pelajari 3 langkah tukar buku yang aman.</p>
			<span class="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase text-primary">Cara kerja <ArrowRight class="size-4 transition-transform group-hover:translate-x-1" /></span>
		</a>
	</section>

	<!-- TIPS -->
	<section class="py-10" aria-label="Tips membaca">
		<p class="text-xs font-black uppercase tracking-widest text-primary">Panduan pembaca</p>
		<h2 class="mt-1 text-3xl font-black uppercase tracking-tight">Tips & panduan</h2>
		<div class="mt-5 grid gap-4 md:grid-cols-3">
			{#each tips as t}
				<Card class="rounded-3xl p-6">
					<span class="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-black uppercase text-secondary-foreground"><t.icon class="size-3.5" />{t.tag}</span>
					<h3 class="mt-3 font-black leading-snug">{t.title}</h3>
					<p class="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
				</Card>
			{/each}
		</div>
	</section>

	<!-- REVIEWS -->
	<section class="mb-12 overflow-hidden rounded-3xl border bg-card p-6 md:p-10" aria-label="Ulasan komunitas">
		<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
			<div>
				<p class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary"><Star class="size-4" /> Komunitas suka</p>
				<h2 class="mt-1 text-3xl font-black uppercase tracking-tight">4.9 dari pembaca</h2>
			</div>
			<div class="flex gap-1" aria-label="Rating 4.9 dari 5">
				{#each Array(5) as _}<Star class="size-5 fill-accent text-accent" />{/each}
			</div>
		</div>
		<div class="mt-6 grid gap-4 md:grid-cols-3">
			{#each [['Rani, Bandung', 'Dapat Laut Bercerita kondisi mulus, COD di kafe dekat kampus. Cepat dan aman.'], ['Dimas, Jakarta', 'Barter Filosofi Teras dengan buku psikologi. Chat-nya responsif banget.'], ['Alya, Surabaya', 'Sudah 6 buku terjual dari rak. Pasang listing-nya gampang.']] as [name, text]}
				<figure class="rounded-2xl bg-muted/60 p-5">
					<Quote class="size-5 text-primary" />
					<blockquote class="mt-2 text-sm leading-relaxed">{text}</blockquote>
					<figcaption class="mt-3 text-xs font-black uppercase tracking-widest text-muted-foreground">{name}</figcaption>
				</figure>
			{/each}
		</div>
	</section>
</main>
