<script lang="ts">
	import '../app.css';
	import Button from '$lib/components/ui/button.svelte';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
	import { Truck, ShieldCheck, BadgePercent } from '@lucide/svelte';
	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="Tukarbuku — temukan buku bekas, jual, atau barter dengan pembaca di kotamu." />
</svelte:head>

<!-- Announcement bar ala Proteinbolaget -->
<div class="bg-neutral-950 text-white dark:bg-black">
	<div class="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 text-[11px] font-bold uppercase tracking-widest">
		<span class="hidden items-center gap-1.5 sm:inline-flex"><Truck class="size-3.5" /> COD aman di kotamu</span>
		<span class="inline-flex items-center gap-1.5 text-amber-400"><BadgePercent class="size-3.5" /> Barter & jual buku bekas</span>
		<span class="hidden items-center gap-1.5 md:inline-flex"><ShieldCheck class="size-3.5" /> Periksa sebelum sepakat</span>
	</div>
</div>

<header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
	<div class="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
		<a href="/" class="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
			<span class="grid size-9 place-items-center rounded-xl bg-neutral-950 text-xs font-black text-white dark:bg-white dark:text-black">TB</span>
			Tukarbuku
		</a>
		<nav class="hidden items-center gap-1 text-sm font-bold uppercase tracking-wide md:flex" aria-label="Navigasi utama">
			<a href="/" class="rounded-full px-4 py-2 hover:bg-accent">Home</a>
			<a href="/#koleksi" class="rounded-full px-4 py-2 hover:bg-accent">Koleksi</a>
			<a href="/#cara-kerja" class="rounded-full px-4 py-2 hover:bg-accent">Cara kerja</a>
		</nav>
		<div class="ml-auto flex items-center gap-2">
			<ThemeToggle />
			<Button href="/login" variant="ghost" size="sm" class="font-bold uppercase">Masuk</Button>
			<Button href="/dashboard/buku-baru" size="sm" class="rounded-full font-bold uppercase">Pasang buku</Button>
		</div>
	</div>
	<!-- Mobile nav -->
	<nav class="flex items-center gap-1 overflow-x-auto border-t px-4 py-2 text-xs font-bold uppercase tracking-wide md:hidden" aria-label="Navigasi seluler">
		<a href="/" class="rounded-full bg-accent px-4 py-1.5">Home</a>
		<a href="/#koleksi" class="rounded-full px-4 py-1.5">Koleksi</a>
		<a href="/#cara-kerja" class="rounded-full px-4 py-1.5">Cara kerja</a>
	</nav>
</header>

{@render children?.()}

<footer class="border-t bg-neutral-950 text-neutral-300 dark:bg-black">
	<div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm md:grid-cols-4">
		<div>
			<p class="text-lg font-black uppercase text-white">Tukarbuku</p>
			<p class="mt-2 text-neutral-400">Pasar buku bekas untuk komunitas pembaca Indonesia.</p>
		</div>
		<div>
			<p class="font-bold uppercase tracking-widest text-white">Belanja</p>
			<div class="mt-3 flex flex-col gap-2"><a href="/" class="hover:text-white">Home</a><a href="/#koleksi" class="hover:text-white">Koleksi</a><a href="/dashboard/buku-baru" class="hover:text-white">Pasang buku</a></div>
		</div>
		<div>
			<p class="font-bold uppercase tracking-widest text-white">Bantuan</p>
			<div class="mt-3 flex flex-col gap-2"><a href="/#cara-kerja" class="hover:text-white">Cara kerja</a><a href="/login" class="hover:text-white">Masuk</a></div>
		</div>
		<div>
			<p class="font-bold uppercase tracking-widest text-white">Keamanan</p>
			<p class="mt-3 text-neutral-400">Bertemu di tempat umum, periksa kondisi buku, simpan kesepakatan di chat.</p>
		</div>
	</div>
	<p class="border-t border-white/10 py-4 text-center text-xs text-neutral-500">© 2026 Tukarbuku</p>
</footer>
