<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import SiteNavDrawer from '$lib/components/layout/site-nav-drawer.svelte';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
	import {
		LogIn,
		Search,
		Menu,
		User,
		Heart,
		ShoppingBag,
		Route,
		Check
	} from '@lucide/svelte';

	let { children } = $props();

	let search = $state('');
	let menuOpen = $state(false);

	function submitSearch() {
		const q = search.trim();
		goto(q ? `/koleksi?q=${encodeURIComponent(q)}` : '/koleksi');
	}
</script>

<svelte:head>
	<meta name="description" content="Tukarbuku — temukan buku bekas, jual, atau barter dengan pembaca di kotamu." />
</svelte:head>

<!-- Bar USP -->
<div class="bg-foreground text-background">
	<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 py-2.5 text-xs font-semibold md:text-sm">
		<span class="inline-flex items-center gap-2"><Check class="size-3.5 shrink-0" strokeWidth={3} /> Transaksi cepat di kotamu</span>
		<span class="inline-flex items-center gap-2"><Check class="size-3.5 shrink-0" strokeWidth={3} /> Gratis pasang listing buku</span>
		<span class="hidden items-center gap-2 sm:inline-flex"><Check class="size-3.5 shrink-0" strokeWidth={3} /> Periksa buku sebelum sepakat</span>
	</div>
</div>

<header class="sticky top-0 z-40 border-b border-border bg-header">
	<div class="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:h-[3.75rem]">
		<button
			type="button"
			class="inline-flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground"
			aria-label="Buka menu"
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = true)}
		>
			<Menu class="size-5" />
		</button>

		<a href="/" class="flex shrink-0 items-center" aria-label="Tukarbuku beranda">
			<span class="grid h-10 min-w-[4.5rem] place-items-center bg-primary px-2 text-center leading-none md:h-11 md:min-w-[5.25rem]">
				<span class="block text-[9px] font-extrabold uppercase tracking-tight text-primary-foreground md:text-[10px]">
					Tukar<br />Buku
				</span>
			</span>
		</a>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				submitSearch();
			}}
			class="relative min-w-0 flex-1"
			role="search"
		>
			<Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				bind:value={search}
				type="search"
				placeholder="Cari judul, penulis, kategori"
				aria-label="Cari buku"
				class="h-10 rounded-sm border-border/50 bg-background pl-9 pr-3 text-sm shadow-none md:h-11"
			/>
		</form>

		<div class="flex shrink-0 items-center gap-0.5 sm:gap-1">
			<span class="hidden sm:inline-flex"><ThemeToggle /></span>
			<a href="/login" class="inline-flex size-9 items-center justify-center text-foreground hover:bg-muted sm:size-10" aria-label="Akun">
				<User class="size-5" />
			</a>
			<a href="/koleksi" class="hidden size-10 items-center justify-center text-foreground hover:bg-muted md:inline-flex" aria-label="Favorit">
				<Heart class="size-5" />
			</a>
			<a href="/dashboard/pesanku" class="inline-flex size-9 items-center justify-center text-foreground hover:bg-muted sm:size-10" aria-label="Pesan">
				<ShoppingBag class="size-5" />
			</a>
		</div>
	</div>
</header>

<SiteNavDrawer bind:open={menuOpen} />

{@render children?.()}

<a
	href="/dashboard/pesanku"
	class="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
	aria-label="Buka pesan"
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-7">
		<path
			d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z"
		/>
		<path
			d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C13.037 4.357 15.039 2.5 17.5 2.5c2.461 0 4.463 1.857 4.836 4.169-.847-.112-1.71-.169-2.586-.169Z"
		/>
	</svg>
</a>

<footer class="border-t bg-foreground text-background">
	<div class="border-b border-background/15">
		<div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center">
			<div>
				<p class="text-xl font-bold tracking-tight">Kabar buku baru di kotamu</p>
				<p class="mt-1 text-sm opacity-70">Listing terbaru langsung ke email. Tanpa spam.</p>
			</div>
			<form onsubmit={(e) => e.preventDefault()} class="flex w-full max-w-md gap-2 md:ml-auto">
				<Input
					type="email"
					required
					placeholder="Alamat email"
					aria-label="Alamat email"
					class="h-11 rounded-sm border-background/25 bg-transparent text-background placeholder:text-background/50"
				/>
				<Button type="submit" class="h-11 shrink-0 bg-primary text-primary-foreground hover:brightness-95">Daftar</Button>
			</form>
		</div>
	</div>
	<div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm sm:grid-cols-2 md:grid-cols-4">
		<div>
			<p class="inline-flex items-center gap-2 text-lg font-bold">
				<span class="grid size-8 place-items-center bg-primary px-1 text-[8px] font-extrabold uppercase leading-none text-primary-foreground">
					Tukar<br />Buku
				</span>
				Tukarbuku
			</p>
			<p class="mt-2 opacity-70">Pasar buku bekas untuk komunitas pembaca Indonesia.</p>
		</div>
		<div>
			<p class="font-semibold">Belanja</p>
			<div class="mt-3 flex flex-col gap-2 opacity-80">
				<a href="/koleksi" class="hover:opacity-100">Semua buku</a>
				<a href="/koleksi?type=JUAL" class="hover:opacity-100">Dijual</a>
				<a href="/koleksi?type=BARTER" class="hover:opacity-100">Barter</a>
			</div>
		</div>
		<div>
			<p class="font-semibold">Bantuan</p>
			<div class="mt-3 flex flex-col gap-2 opacity-80">
				<a href="/cara-kerja" class="inline-flex items-center gap-1.5 hover:opacity-100"><Route class="size-3.5" />Cara kerja</a>
				<a href="/login" class="inline-flex items-center gap-1.5 hover:opacity-100"><LogIn class="size-3.5" />Masuk</a>
			</div>
		</div>
		<div>
			<p class="font-semibold">Keamanan</p>
			<p class="mt-3 opacity-70">Bertemu di tempat umum, periksa kondisi buku, simpan kesepakatan di chat.</p>
		</div>
	</div>
	<p class="border-t border-background/15 py-4 text-center text-xs opacity-60">© 2026 Tukarbuku · Indonesia</p>
</footer>
