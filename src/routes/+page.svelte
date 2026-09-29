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
		Star,
		Quote,
		BookOpenText,
		Flame,
		Sparkles,
		Timer,
		Handshake,
		Search,
		MessagesSquare
	} from '@lucide/svelte';

	let { data }: { data: { books: Book[] } } = $props();

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

	const jual = data.books.filter((b) => b.listingType === 'JUAL');
	const barter = data.books.filter((b) => b.listingType === 'BARTER');
	const newest = [...data.books].slice().reverse();

	let bestTrack: HTMLElement | null = $state(null);
	let newTrack: HTMLElement | null = $state(null);
	const slide = (el: HTMLElement | null, dx: number) => el?.scrollBy({ left: dx, behavior: 'smooth' });
</script>

<svelte:head><title>Tukarbuku — Jual dan barter buku bekas</title></svelte:head>

<main>
	<!-- 1. HERO -->
	<section class="mx-auto max-w-7xl px-4 pt-5" aria-label="Promo utama">
		<a
			href="/koleksi"
			class="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl bg-foreground p-6 text-background md:min-h-[420px] md:p-12"
		>
			{#if data.books[0]}
				<img
					src={data.books[0].cover}
					alt=""
					aria-hidden="true"
					class="absolute inset-0 h-full w-full object-cover opacity-25 transition-transform duration-500 group-hover:scale-105"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
			{/if}
			<div class="relative">
				<p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Pekan buku bekas</p>
				<h1 class="mt-2 max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
					Hemat hingga 50% dari harga baru
				</h1>
				<span class="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground">
					Belanja sekarang <ArrowRight class="size-4" />
				</span>
			</div>
		</a>
	</section>

	<!-- 2. BESTSELLER -->
	<section class="mx-auto max-w-7xl px-4 pt-12" aria-label="Buku terlaris">
		<div class="mb-5 flex items-end justify-between">
			<h2 class="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight md:text-3xl">
				<Flame class="size-6 text-primary" /> Bestseller
			</h2>
			<div class="flex items-center gap-2">
				<button onclick={() => slide(bestTrack, -320)} aria-label="Geser kiri" class="grid size-9 place-items-center rounded-full border hover:bg-muted"><ArrowLeft class="size-4" /></button>
				<button onclick={() => slide(bestTrack, 320)} aria-label="Geser kanan" class="grid size-9 place-items-center rounded-full border hover:bg-muted"><ArrowRight class="size-4" /></button>
				<a href="/koleksi" class="ml-1 hidden text-sm font-bold text-primary hover:underline sm:inline">Lihat semua</a>
			</div>
		</div>
		<div bind:this={bestTrack} class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{#each jual.slice(0, 6) as book (book.id)}
				<article class="w-44 shrink-0 snap-start overflow-hidden rounded-xl border bg-card md:w-52">
					<a href={`/buku/${book.id}`} class="relative block aspect-[4/5] bg-muted">
						<img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" width="300" height="375" class="h-full w-full object-cover" />
					</a>
					<div class="p-3">
						<p class="truncate text-xs text-muted-foreground">{book.author}</p>
						<a href={`/buku/${book.id}`} class="line-clamp-1 text-sm font-bold hover:underline">{book.title}</a>
						<div class="mt-1.5 flex items-center gap-2">
							<Badge variant="jual" class="rounded-md text-[10px] font-bold uppercase">Dijual</Badge>
							<span class="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-secondary-foreground">{book.condition}</span>
						</div>
						<p class="mt-1.5 font-extrabold">{formatPrice(book.price ?? 0)}</p>
						<p class="text-xs text-muted-foreground">{book.city}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- 3. BENTO -->
	<section class="mx-auto grid max-w-7xl gap-3 px-4 pt-10 lg:grid-cols-3" aria-label="Sorotan">
		<a href="/koleksi?type=BARTER" class="group flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-foreground p-6 text-background lg:col-span-2 lg:row-span-2 lg:min-h-80 lg:p-8">
			<ArrowLeftRight class="size-8 text-primary" />
			<h3 class="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">Barter: buku lama jadi bacaan baru</h3>
			<p class="mt-1 text-sm opacity-70">Tukar langsung dengan sesama pembaca, tanpa uang keluar.</p>
			<span class="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-background px-5 py-2.5 text-xs font-bold uppercase text-foreground">Coba barter <ArrowRight class="size-3.5" /></span>
		</a>
		<a href="/koleksi?kondisi=Baru" class="group flex items-center gap-4 rounded-2xl border bg-card p-5">
			<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles class="size-5" /></span>
			<span><span class="block font-extrabold">Kondisi Baru</span><span class="block text-sm text-muted-foreground">Belum pernah dibaca</span></span>
		</a>
		<a href="/dashboard/buku-baru" class="group flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground">
			<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-black/15"><BookOpenText class="size-5" /></span>
			<span><span class="block font-extrabold">Jual bukumu</span><span class="block text-sm opacity-80">Gratis, 2 menit jadi</span></span>
		</a>
	</section>

	<!-- 4. GOLDEN DEALS -->
	<section class="mt-12 border-y bg-muted/60" aria-label="Penawaran barter">
		<div class="mx-auto max-w-7xl px-4 py-10">
			<div class="mb-5 flex items-end justify-between">
				<h2 class="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight md:text-3xl">
					<Timer class="size-6 text-primary" /> Kesempatan barter
				</h2>
				<a href="/koleksi?type=BARTER" class="text-sm font-bold text-primary hover:underline">Lihat semua</a>
			</div>
			<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{#each barter.slice(0, 4) as book (book.id)}
					<article class="overflow-hidden rounded-xl border bg-card">
						<a href={`/buku/${book.id}`} class="relative block aspect-[4/5] bg-muted">
							<img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" width="300" height="375" class="h-full w-full object-cover" />
							<Badge variant="barter" class="absolute left-2 top-2 rounded-md text-[10px] font-bold uppercase">Barter</Badge>
						</a>
						<div class="p-3">
							<p class="truncate text-xs text-muted-foreground">{book.author}</p>
							<a href={`/buku/${book.id}`} class="line-clamp-1 text-sm font-bold hover:underline">{book.title}</a>
							<p class="mt-1 line-clamp-1 text-xs text-muted-foreground">Tukar: {book.wantedInExchange}</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- 5. SPLIT BANNERS -->
	<section class="mx-auto grid max-w-7xl gap-3 px-4 pt-10 md:grid-cols-2" aria-label="Promo">
		<a href="/koleksi?type=JUAL" class="group rounded-2xl bg-foreground p-6 text-background md:p-8">
			<BadgePercent class="size-7 text-primary" />
			<h3 class="mt-3 text-xl font-extrabold tracking-tight md:text-2xl">Buku dijual di kotamu</h3>
			<p class="mt-1 text-sm opacity-70">Harga langsung dari pemilik, COD dan periksa di tempat.</p>
			<span class="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase">Jelajahi <ArrowRight class="size-4 text-primary transition-transform group-hover:translate-x-1" /></span>
		</a>
		<a href="/cara-kerja" class="group rounded-2xl border bg-card p-6 md:p-8">
			<ShieldCheck class="size-7 text-primary" />
			<h3 class="mt-3 text-xl font-extrabold tracking-tight md:text-2xl">Baru pertama kali tukar buku?</h3>
			<p class="mt-1 text-sm text-muted-foreground">Tiga langkah mudah dan aman bertransaksi.</p>
			<span class="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase text-primary">Cara kerja <ArrowRight class="size-4 transition-transform group-hover:translate-x-1" /></span>
		</a>
	</section>

	<!-- 6. NEW ARRIVALS -->
	<section class="mx-auto max-w-7xl px-4 pt-12" aria-label="Buku terbaru">
		<div class="mb-5 flex items-end justify-between">
			<h2 class="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight md:text-3xl">
				<Sparkles class="size-6 text-primary" /> Baru & hangat
			</h2>
			<div class="flex items-center gap-2">
				<button onclick={() => slide(newTrack, -320)} aria-label="Geser kiri" class="grid size-9 place-items-center rounded-full border hover:bg-muted"><ArrowLeft class="size-4" /></button>
				<button onclick={() => slide(newTrack, 320)} aria-label="Geser kanan" class="grid size-9 place-items-center rounded-full border hover:bg-muted"><ArrowRight class="size-4" /></button>
			</div>
		</div>
		<div bind:this={newTrack} class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{#each newest as book (book.id)}
				<article class="w-44 shrink-0 snap-start overflow-hidden rounded-xl border bg-card md:w-52">
					<a href={`/buku/${book.id}`} class="relative block aspect-[4/5] bg-muted">
						<img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" width="300" height="375" class="h-full w-full object-cover" />
						<Badge variant="outline" class="absolute left-2 top-2 rounded-md bg-background/90 text-[10px] font-bold uppercase">Baru masuk</Badge>
					</a>
					<div class="p-3">
						<p class="truncate text-xs text-muted-foreground">{book.author}</p>
						<a href={`/buku/${book.id}`} class="line-clamp-1 text-sm font-bold hover:underline">{book.title}</a>
						<p class="mt-1.5 font-extrabold">{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : 'Barter'}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- 7. ABOUT / SEO -->
	<section class="mx-auto max-w-7xl px-4 pt-12" aria-label="Tentang Tukarbuku">
		<div class="grid gap-8 rounded-2xl border bg-card p-6 md:grid-cols-3 md:p-10">
			<div>
				<h3 class="font-extrabold">Buku bekas berkualitas</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">Temukan novel, nonfiksi, dan sastra Indonesia preloved dari sesama pembaca. Setiap listing mencantumkan kondisi jujur — Baru, Baik, Cukup, atau Rusak ringan.</p>
			</div>
			<div>
				<h3 class="font-extrabold">Jual atau barter sesukamu</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">Pasang harga sendiri atau tukar dengan buku impianmu. Tanpa biaya listing, tanpa perantara — kesepakatan terjadi langsung lewat chat.</p>
			</div>
			<div>
				<h3 class="font-extrabold">COD yang aman</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">Bertemu di tempat umum, periksa kondisi buku sebelum membayar atau menukar. Semua riwayat kesepakatan tersimpan di chat Tukarbuku.</p>
			</div>
		</div>
	</section>

	<!-- 8. GUIDE -->
	<section class="mx-auto max-w-7xl px-4 pt-12" aria-label="Panduan pembaca">
		<div class="mb-5 flex items-end justify-between">
			<h2 class="text-2xl font-extrabold tracking-tight md:text-3xl">Panduan pembaca</h2>
			<a href="/cara-kerja" class="text-sm font-bold text-primary hover:underline">Cara kerja</a>
		</div>
		<div class="grid gap-4 md:grid-cols-3">
			{#each [{ icon: Search, tag: 'Panduan', title: 'Cara menilai kondisi buku bekas', desc: 'Bedakan kondisi Baru, Baik, dan Cukup sebelum chat penjual.' }, { icon: MessagesSquare, tag: 'Tips chat', title: '5 pertanyaan wajib sebelum COD', desc: 'Dari foto halaman dalam sampai riwayat noda dan lipatan.' }, { icon: Handshake, tag: 'Keamanan', title: 'COD aman untuk pertama kali', desc: 'Pilih tempat ramai dan simpan bukti chat kesepakatan.' }] as t}
				<Card class="rounded-2xl p-6">
					<span class="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase text-secondary-foreground"><t.icon class="size-3.5" />{t.tag}</span>
					<h3 class="mt-3 font-extrabold leading-snug">{t.title}</h3>
					<p class="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
				</Card>
			{/each}
		</div>
	</section>

	<!-- 9. REVIEWS -->
	<section class="mx-auto max-w-7xl px-4 py-12" aria-label="Ulasan komunitas">
		<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
			<h2 class="text-2xl font-extrabold tracking-tight md:text-3xl">Komunitas kami suka</h2>
			<div class="flex items-center gap-2">
				<div class="flex gap-0.5" aria-label="Rating 4.9 dari 5">
					{#each Array(5) as _}<Star class="size-4 fill-primary text-primary" />{/each}
				</div>
				<span class="text-sm font-bold">4.9/5</span>
			</div>
		</div>
		<div class="mt-5 grid gap-4 md:grid-cols-3">
			{#each [['Rani, Bandung', 'Dapat buku kondisi mulus, COD di kafe dekat kampus. Cepat dan aman.'], ['Dimas, Jakarta', 'Barter berjalan lancar, chat-nya responsif banget.'], ['Alya, Surabaya', 'Sudah 6 buku terjual dari rak. Pasang listing-nya gampang.']] as [name, text]}
				<figure class="rounded-2xl border bg-card p-5">
					<Quote class="size-5 text-primary" />
					<blockquote class="mt-2 text-sm leading-relaxed">{text}</blockquote>
					<figcaption class="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{name}</figcaption>
				</figure>
			{/each}
		</div>

		<!-- USP strip -->
		<div class="mt-8 grid grid-cols-1 gap-3 rounded-2xl bg-foreground p-5 text-background sm:grid-cols-3 md:p-6">
			<span class="inline-flex items-center gap-2 text-sm font-bold"><Truck class="size-4 text-primary" /> COD fleksibel di kotamu</span>
			<span class="inline-flex items-center gap-2 text-sm font-bold"><ShieldCheck class="size-4 text-primary" /> Periksa sebelum sepakat</span>
			<span class="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeftRight class="size-4 text-primary" /> Jual atau barter gratis</span>
		</div>
	</section>
</main>
