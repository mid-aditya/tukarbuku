<script lang="ts">
	import type { Book } from '$lib/data/books';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import ProductCard from '$lib/components/product-card.svelte';
	import {
		ArrowRight,
		ArrowLeft,
		Truck,
		ShieldCheck,
		ArrowLeftRight,
		BadgePercent,
		Star,
		Quote,
		Sparkles,
		Timer,
		Handshake,
		Search,
		MessagesSquare,
		Pause
	} from '@lucide/svelte';

	let { data }: { data: { books: Book[] } } = $props();

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

	let heroIndex = $state(0);

	const jual = $derived(data.books.filter((b) => b.listingType === 'JUAL'));
	const barter = $derived(data.books.filter((b) => b.listingType === 'BARTER'));
	const newest = $derived([...data.books].slice().reverse());

	const heroSlides = $derived([
		{
			tag: 'Pekan buku bekas',
			title: 'Gaji + promo buku = cocok!',
			accent: 'Diskon hingga 60%',
			cta: 'Belanja sekarang',
			href: '/koleksi',
			image: data.books[0]?.cover
		},
		{
			tag: 'Merek pilihan',
			title: 'Novel & nonfiksi terlaris',
			accent: 'Mulai dari 25 rb',
			cta: 'Lihat koleksi',
			href: '/koleksi?type=JUAL',
			image: data.books[1]?.cover ?? data.books[0]?.cover
		},
		{
			tag: 'Barter gratis',
			title: 'Buku lama jadi bacaan baru',
			accent: 'Tanpa biaya listing',
			cta: 'Coba barter',
			href: '/koleksi?type=BARTER',
			image: data.books.find((b) => b.listingType === 'BARTER')?.cover ?? data.books[0]?.cover
		}
	]);

	let bestTrack: HTMLElement | null = $state(null);
	let newTrack: HTMLElement | null = $state(null);
	const slide = (el: HTMLElement | null, dx: number) => el?.scrollBy({ left: dx, behavior: 'smooth' });

	const activeHero = $derived(heroSlides[heroIndex] ?? heroSlides[0]);
</script>

<svelte:head><title>Tukarbuku — Jual dan barter buku bekas</title></svelte:head>

<main>
	<!-- Hero carousel -->
	<section class="relative mx-auto max-w-7xl px-4 pt-4" aria-label="Promo utama">
		<div class="relative min-h-[22rem] overflow-hidden md:min-h-[28rem]">
			{#if activeHero.image}
				<img src={activeHero.image} alt="" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" />
			{:else}
				<div class="absolute inset-0 bg-foreground"></div>
			{/if}
			<div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div>

			<div class="relative flex min-h-[22rem] flex-col justify-center px-6 py-10 md:min-h-[28rem] md:px-12 md:py-14">
				<p class="text-sm font-semibold text-white/90">{activeHero.tag}</p>
				<h1 class="mt-2 max-w-lg text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
					{activeHero.title}
				</h1>
				<p class="mt-2 max-w-md text-2xl font-bold text-primary md:text-4xl">{activeHero.accent}</p>
				<Button href={activeHero.href} size="lg" class="mt-6 w-fit px-8 py-3 text-sm">
					{activeHero.cta}
				</Button>
			</div>

			<button
				type="button"
				class="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-primary/90 text-primary-foreground md:left-4"
				aria-label="Slide sebelumnya"
				onclick={() => (heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length)}
			>
				<ArrowLeft class="size-5" />
			</button>
			<button
				type="button"
				class="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center bg-primary/90 text-primary-foreground md:right-4"
				aria-label="Slide berikutnya"
				onclick={() => (heroIndex = (heroIndex + 1) % heroSlides.length)}
			>
				<ArrowRight class="size-5" />
			</button>

			<div class="absolute bottom-4 left-6 flex items-center gap-2 md:left-12">
				<Pause class="size-4 text-white" aria-hidden="true" />
				{#each heroSlides as _, i}
					<button
						type="button"
						class="h-1 w-8 rounded-full transition-colors {i === heroIndex ? 'bg-primary' : 'bg-white/60'}"
						aria-label={`Slide ${i + 1}`}
						onclick={() => (heroIndex = i)}
					></button>
				{/each}
			</div>
		</div>
	</section>

	<!-- Promo strip -->
	<section class="mx-auto max-w-7xl px-4 pt-6" aria-label="Sorotan promo">
		<div class="grid gap-2 md:grid-cols-3">
			<a href="/koleksi?type=JUAL" class="flex min-h-24 items-end bg-muted p-4 transition-colors hover:bg-muted/80 md:min-h-28">
				<div>
					<p class="text-xs font-semibold uppercase text-muted-foreground">Deal hari ini</p>
					<p class="font-bold">Buku dijual · hemat hingga 50%</p>
				</div>
			</a>
			<a href="/koleksi?type=BARTER" class="flex min-h-24 items-end bg-foreground p-4 text-background md:min-h-28">
				<div>
					<p class="text-xs font-semibold uppercase opacity-70">Barter</p>
					<p class="font-bold">Tukar tanpa uang keluar</p>
				</div>
			</a>
			<a href="/dashboard/buku-baru" class="flex min-h-24 items-end bg-primary p-4 text-primary-foreground md:min-h-28">
				<div>
					<p class="text-xs font-semibold uppercase opacity-80">Jual bukumu</p>
					<p class="font-bold">Gratis pasang · 2 menit</p>
				</div>
			</a>
		</div>
	</section>

	<!-- Terlaris -->
	<section id="terlaris" class="mx-auto max-w-7xl px-4 pt-10 md:pt-12" aria-label="Buku terlaris">
		<div class="mb-6 flex items-center justify-between gap-4">
			<h2 class="text-[1.65rem] font-bold tracking-tight md:text-[1.85rem]">Terlaris</h2>
			<div class="flex items-center gap-1">
				<button
					onclick={() => slide(bestTrack, -340)}
					aria-label="Geser kiri"
					class="grid size-10 place-items-center text-foreground hover:opacity-70"
				>
					<ArrowLeft class="size-5 stroke-[1.5]" />
				</button>
				<button
					onclick={() => slide(bestTrack, 340)}
					aria-label="Geser kanan"
					class="grid size-10 place-items-center text-foreground hover:opacity-70"
				>
					<ArrowRight class="size-5 stroke-[1.5]" />
				</button>
			</div>
		</div>
		<div
			bind:this={bestTrack}
			class="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6"
		>
			{#each jual.slice(0, 8) as book (book.id)}
				<ProductCard {book} {formatPrice} />
			{/each}
		</div>
		<div class="mt-2 border-t border-border pt-6 text-center">
			<Button href="/koleksi" variant="outline" class="min-w-[12rem] border-foreground font-bold uppercase tracking-wide">
				Semua terlaris
			</Button>
		</div>
	</section>

	<!-- Penawaran emas -->
	<section id="penawaran-emas" class="mt-12 border-y border-border bg-card" aria-label="Penawaran emas">
		<div class="mx-auto max-w-7xl px-4 py-10">
			<div class="mb-5 flex items-end justify-between">
				<h2 class="inline-flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
					<Timer class="size-6 text-primary" /> Penawaran emas
				</h2>
				<a href="/koleksi?type=BARTER" class="text-sm font-semibold underline-offset-4 hover:underline">Lihat semua</a>
			</div>
			<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{#each [...barter.slice(0, 3), ...jual.slice(0, 1)] as book (book.id)}
					<article class="bg-background">
						<a href={`/buku/${book.id}`} class="relative block bg-muted/80 p-4">
							<img
								src={book.cover}
								alt={`Sampul ${book.title}`}
								loading="lazy"
								class="mx-auto h-36 w-auto object-contain md:h-44"
							/>
							<Badge variant="deal" class="absolute left-2 top-2 rounded-sm text-[10px] font-bold uppercase">
								{book.listingType === 'BARTER' ? 'Barter' : 'Golden deal'}
							</Badge>
						</a>
						<div class="space-y-1 px-1 py-2">
							<p class="truncate text-[11px] font-bold uppercase text-muted-foreground">{book.author}</p>
							<a href={`/buku/${book.id}`} class="line-clamp-2 text-sm font-medium hover:underline">{book.title}</a>
							<p class="font-bold">
								{book.listingType === 'JUAL' ? formatPrice(book.price ?? 0) : 'Tukar buku'}
							</p>
							<p class="text-[11px] text-muted-foreground">Harga terendah 30 hari</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- Banner ganda -->
	<section class="mx-auto grid max-w-7xl gap-2 px-4 pt-10 md:grid-cols-2" aria-label="Promo">
		<a href="/koleksi?type=JUAL" class="group bg-foreground p-6 text-background md:p-8">
			<BadgePercent class="size-7 text-primary" />
			<h3 class="mt-3 text-xl font-bold md:text-2xl">Buku dijual di kotamu</h3>
			<p class="mt-1 text-sm opacity-70">Harga dari pemilik · COD & periksa di tempat.</p>
			<span class="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase">
				Jelajahi <ArrowRight class="size-4 text-primary" />
			</span>
		</a>
		<a href="/cara-kerja" class="group border border-border bg-card p-6 md:p-8">
			<ShieldCheck class="size-7 text-primary" />
			<h3 class="mt-3 text-xl font-bold md:text-2xl">Pertama kali tukar buku?</h3>
			<p class="mt-1 text-sm text-muted-foreground">Tiga langkah aman bertransaksi.</p>
			<span class="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase text-primary">
				Cara kerja <ArrowRight class="size-4" />
			</span>
		</a>
	</section>

	<!-- Baru & hangat -->
	<section id="baru" class="mx-auto max-w-7xl px-4 pt-12" aria-label="Buku terbaru">
		<div class="mb-5 flex items-end justify-between">
			<h2 class="inline-flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
				<Sparkles class="size-6 text-primary" /> Baru & hangat
			</h2>
			<div class="flex items-center gap-2">
				<button onclick={() => slide(newTrack, -320)} aria-label="Geser kiri" class="grid size-9 place-items-center border bg-card hover:bg-muted">
					<ArrowLeft class="size-4" />
				</button>
				<button onclick={() => slide(newTrack, 320)} aria-label="Geser kanan" class="grid size-9 place-items-center border bg-card hover:bg-muted">
					<ArrowRight class="size-4" />
				</button>
			</div>
		</div>
		<p class="mb-4 text-sm text-muted-foreground">Temukan listing terbaru dari komunitas pembaca Indonesia.</p>
		<div bind:this={newTrack} class="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6">
			{#each newest as book (book.id)}
				<ProductCard {book} {formatPrice} />
			{/each}
		</div>
		<div class="mt-4">
			<Button href="/koleksi" variant="link">Temukan favorit baru</Button>
		</div>
	</section>

	<!-- Tentang -->
	<section class="mx-auto max-w-7xl px-4 pt-12" aria-label="Tentang Tukarbuku">
		<h2 class="mb-6 text-2xl font-bold md:text-3xl">Tentang Tukarbuku</h2>
		<div class="grid gap-6 md:grid-cols-3">
			<div>
				<h3 class="font-bold">Buku bekas berkualitas online</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
					Novel, nonfiksi, dan sastra preloved dari sesama pembaca. Setiap listing jujur soal kondisi — Baru, Baik, Cukup, atau Rusak ringan.
				</p>
			</div>
			<div>
				<h3 class="font-bold">Jual atau barter sesuai kebutuhan</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
					Pasang harga sendiri atau tukar dengan buku impianmu. Tanpa biaya listing — kesepakatan lewat chat langsung.
				</p>
			</div>
			<div>
				<h3 class="font-bold">Murah & transaksi cepat</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
					Harga bersaing dari komunitas. COD fleksibel di kotamu dan riwayat chat tersimpan aman.
				</p>
			</div>
		</div>
	</section>

	<!-- Panduan -->
	<section class="mx-auto max-w-7xl px-4 pt-12" aria-label="Panduan pembaca">
		<div class="mb-5 flex items-end justify-between">
			<h2 class="text-2xl font-bold md:text-3xl">Panduan pembaca</h2>
			<a href="/cara-kerja" class="text-sm font-semibold text-primary hover:underline">Cara kerja</a>
		</div>
		<div class="grid gap-4 md:grid-cols-3">
			{#each [{ icon: Search, tag: 'Panduan', title: 'Cara menilai kondisi buku bekas', desc: 'Bedakan Baru, Baik, dan Cukup sebelum chat penjual.' }, { icon: MessagesSquare, tag: 'Tips chat', title: '5 pertanyaan wajib sebelum COD', desc: 'Foto halaman dalam, noda, dan lipatan.' }, { icon: Handshake, tag: 'Keamanan', title: 'COD aman untuk pertama kali', desc: 'Tempat ramai & simpan bukti chat.' }] as t}
				<Card class="rounded-sm p-6">
					<span class="inline-flex items-center gap-1.5 rounded-sm bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase">{t.tag}</span>
					<h3 class="mt-3 font-bold leading-snug">{t.title}</h3>
					<p class="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
				</Card>
			{/each}
		</div>
	</section>

	<!-- Ulasan -->
	<section class="mx-auto max-w-7xl px-4 py-12" aria-label="Ulasan komunitas">
		<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
			<h2 class="text-2xl font-bold md:text-3xl">Pelanggan kami suka kami!</h2>
			<div class="flex items-center gap-2">
				<div class="flex gap-0.5" aria-label="Rating 4.9 dari 5">
					{#each Array(5) as _}<Star class="size-4 fill-primary text-primary" />{/each}
				</div>
				<span class="text-sm font-bold">4.9/5</span>
			</div>
		</div>
		<p class="mt-1 text-sm text-muted-foreground">Ribuan transaksi aman di komunitas Tukarbuku.</p>
		<div class="mt-5 grid gap-4 md:grid-cols-3">
			{#each [['Rani, Bandung', 'Buku kondisi mulus, COD di kafe dekat kampus. Cepat dan aman.'], ['Dimas, Jakarta', 'Barter lancar, chat responsif.'], ['Alya, Surabaya', 'Sudah 6 buku terjual. Pasang listing gampang.']] as [name, text]}
				<figure class="border border-border bg-card p-5">
					<Quote class="size-5 text-primary" />
					<blockquote class="mt-2 text-sm leading-relaxed">{text}</blockquote>
					<figcaption class="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{name}</figcaption>
				</figure>
			{/each}
		</div>

		<div class="mt-8 grid grid-cols-1 gap-3 bg-foreground p-5 text-background sm:grid-cols-3 md:p-6">
			<span class="inline-flex items-center gap-2 text-sm font-semibold"><Truck class="size-4 text-primary" /> COD fleksibel</span>
			<span class="inline-flex items-center gap-2 text-sm font-semibold"><ShieldCheck class="size-4 text-primary" /> Periksa sebelum sepakat</span>
			<span class="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeftRight class="size-4 text-primary" /> Jual/barter gratis</span>
		</div>
	</section>
</main>
