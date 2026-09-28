<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import {
		Search,
		MessagesSquare,
		Handshake,
		ShieldCheck,
		MapPin,
		Camera,
		BadgeCheck,
		CircleHelp,
		ArrowRight
	} from '@lucide/svelte';

	const steps = [
		{
			icon: Search,
			no: '01',
			title: 'Temukan buku',
			desc: 'Cari berdasarkan judul, penulis, kondisi, dan kota tempat COD. Bandingkan beberapa listing sebelum menghubungi pemilik.'
		},
		{
			icon: MessagesSquare,
			no: '02',
			title: 'Chat pemilik',
			desc: 'Tanyakan detail kondisi — noda, lipatan, coretan — lalu sepakati harga, barang barter, waktu, dan lokasi bertemu.'
		},
		{
			icon: Handshake,
			no: '03',
			title: 'Periksa dan tukar',
			desc: 'Temui di tempat umum yang ramai. Periksa buku sesuai foto dan deskripsi sebelum membayar atau menukar.'
		}
	];

	const tips = [
		{ icon: MapPin, title: 'Bertemu di tempat umum', desc: 'Pilih kafe, kampus, atau stasiun di jam ramai.' },
		{ icon: Camera, title: 'Minta foto tambahan', desc: 'Minta foto halaman dalam dan bagian yang cacat.' },
		{ icon: BadgeCheck, title: 'Cek reputasi penjual', desc: 'Lihat riwayat listing dan respons chat penjual.' },
		{ icon: ShieldCheck, title: 'Simpan bukti chat', desc: 'Semua kesepakatan tercatat di chat Tukarbuku.' }
	];

	const faqs = [
		{ q: 'Apakah perlu membuat akun?', a: 'Ya, masuk dengan Google agar kamu bisa chat pemilik buku, memasang listing, dan melihat riwayat percakapan.' },
		{ q: 'Bagaimana sistem barter bekerja?', a: 'Tulis buku yang kamu inginkan sebagai pengganti di listing. Tawar menawar lewat chat sampai kedua pihak sepakat.' },
		{ q: 'Apakah ada biaya transaksi?', a: 'Tidak. Tukarbuku gratis — pembayaran dan penukaran dilakukan langsung saat COD.' },
		{ q: 'Bagaimana kalau kondisi buku tidak sesuai?', a: 'Kamu berhak membatalkan di tempat. Itulah gunanya memeriksa buku sebelum membayar atau menukar.' }
	];

	let openFaq: number | null = $state(0);
</script>

<svelte:head>
	<title>Cara kerja — Tukarbuku</title>
	<meta name="description" content="Pelajari cara membeli, menjual, dan barter buku bekas dengan aman di Tukarbuku." />
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-8">
	<div class="overflow-hidden rounded-3xl bg-foreground px-6 py-12 text-background md:px-12">
		<p class="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-widest text-accent-foreground">
			<CircleHelp class="size-3.5" /> Panduan
		</p>
		<h1 class="mt-4 max-w-2xl text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
			Tukar buku dalam 3 langkah.
		</h1>
		<p class="mt-4 max-w-xl font-medium opacity-80">Tanpa perantara, tanpa ribet. Semua kesepakatan terjadi lewat chat dan COD.</p>
		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="/koleksi" size="lg" class="rounded-full font-black uppercase">
				Mulai cari buku <ArrowRight class="size-4" />
			</Button>
		</div>
	</div>

	<section class="mt-10 grid gap-4 md:grid-cols-3" aria-label="Langkah-langkah">
		{#each steps as s}
			<Card class="rounded-2xl p-6">
				<div class="flex items-center justify-between">
					<span class="inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
						<s.icon class="size-5" />
					</span>
					<span class="text-sm font-black text-muted-foreground">{s.no}</span>
				</div>
				<h2 class="mt-4 text-lg font-black uppercase">{s.title}</h2>
				<p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
			</Card>
		{/each}
	</section>

	<section class="mt-10" aria-label="Tips aman">
		<h2 class="text-2xl font-black uppercase tracking-tight">Transaksi aman</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each tips as t}
				<Card class="rounded-2xl p-5">
					<span class="inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
						<t.icon class="size-5" />
					</span>
					<h3 class="mt-3 font-bold">{t.title}</h3>
					<p class="mt-1 text-sm text-muted-foreground">{t.desc}</p>
				</Card>
			{/each}
		</div>
	</section>

	<section class="mx-auto mt-10 max-w-3xl" aria-label="Pertanyaan umum">
		<h2 class="text-2xl font-black uppercase tracking-tight">Pertanyaan umum</h2>
		<div class="mt-4 space-y-2">
			{#each faqs as f, i}
				<Card class="overflow-hidden rounded-2xl">
					<button onclick={() => (openFaq = openFaq === i ? null : i)} class="flex w-full items-center gap-3 px-5 py-4 text-left font-bold">
						<CircleHelp class="size-4 shrink-0 text-primary" />
						<span class="flex-1">{f.q}</span>
						<span class="text-muted-foreground">{openFaq === i ? '−' : '+'}</span>
					</button>
				{#if openFaq === i}
						<p class="border-t px-5 py-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
					{/if}
				</Card>
			{/each}
			</div>
		</section>
	</main>
