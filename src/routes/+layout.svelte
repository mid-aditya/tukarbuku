<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import DropdownMenu from '$lib/components/ui/dropdown-menu.svelte';
	import ThemeToggle from '$lib/components/ui/theme-toggle.svelte';
	import {
		House,
		LibraryBig,
		Route,
		Truck,
		ShieldCheck,
		BadgePercent,
		ChevronDown,
		LayoutDashboard,
		PlusCircle,
		LogIn,
		BookOpenText,
		Search,
		Banknote,
		ArrowLeftRight,
		Sparkles,
		Menu
	} from '@lucide/svelte';

	let { children } = $props();

	let search = $state('');
	let mobileSearch = $state(false);

	const nav = [
		{ href: '/', label: 'Home', icon: House },
		{ href: '/koleksi', label: 'Koleksi', icon: LibraryBig },
		{ href: '/cara-kerja', label: 'Cara kerja', icon: Route }
	];

	const categories = [
		{ label: 'Semua buku', href: '/koleksi', icon: LibraryBig },
		{ label: 'Dijual', href: '/koleksi?type=JUAL', icon: Banknote },
		{ label: 'Barter', href: '/koleksi?type=BARTER', icon: ArrowLeftRight },
		{ label: 'Kondisi Baru', href: '/koleksi?kondisi=Baru', icon: Sparkles },
		{ label: 'Kondisi Baik', href: '/koleksi?kondisi=Baik', icon: BadgePercent }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

	function submitSearch() {
		const q = search.trim();
		goto(q ? `/koleksi?q=${encodeURIComponent(q)}` : '/koleksi');
		mobileSearch = false;
	}
</script>

<svelte:head>
	<meta name="description" content="Tukarbuku — temukan buku bekas, jual, atau barter dengan pembaca di kotamu." />
</svelte:head>

<!-- USP bar -->
<div class="bg-foreground text-background">
	<div class="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 text-[11px] font-bold uppercase tracking-widest">
		<span class="hidden items-center gap-1.5 sm:inline-flex"><Truck class="size-3.5" /> COD aman di kotamu</span>
		<span class="inline-flex items-center gap-1.5 text-accent"><BadgePercent class="size-3.5" /> Gratis pasang listing</span>
		<span class="hidden items-center gap-1.5 md:inline-flex"><ShieldCheck class="size-3.5" /> Periksa sebelum sepakat</span>
	</div>
</div>

<header class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
	<div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
		<a href="/" class="flex shrink-0 items-center gap-2 text-lg font-black uppercase tracking-tight" aria-label="Tukarbuku beranda">
			<span class="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
				<BookOpenText class="size-4" />
			</span>
			<span class="hidden lg:inline">Tukarbuku</span>
		</a>

		<!-- Search desktop -->
		<form onsubmit={(e) => { e.preventDefault(); submitSearch(); }} class="relative hidden min-w-0 flex-1 md:block" role="search">
			<Search class="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				bind:value={search}
				type="search"
				placeholder="Cari judul buku atau penulis…"
				aria-label="Cari buku"
				class="h-11 rounded-full border-2 bg-muted/60 pl-10 pr-24 font-medium"
			/>
			<Button type="submit" size="sm" class="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full font-bold uppercase">
				Cari
			</Button>
		</form>

		<div class="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0">
			<button
				onclick={() => (mobileSearch = !mobileSearch)}
				class="inline-flex size-9 items-center justify-center rounded-full border hover:bg-muted md:hidden"
				aria-label="Tampilkan pencarian"
			>
				<Search class="size-4" />
			</button>
			<ThemeToggle />
			<DropdownMenu
				items={[
					{ label: 'Masuk dengan Google', href: '/login' },
					{ label: 'sep', separator: true },
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'Pasang buku', href: '/dashboard/buku-baru' },
					{ label: 'Pesanku', href: '/dashboard/pesanku' }
				]}
				class="inline-flex h-9 items-center gap-1 rounded-full border bg-background px-3 text-sm font-bold hover:bg-muted"
			>
				{#snippet trigger()}
					<LayoutDashboard class="size-4 text-muted-foreground" />
					<span class="hidden sm:inline">Akun</span>
					<ChevronDown class="size-3.5 text-muted-foreground" />
				{/snippet}
			</DropdownMenu>
			<Button href="/dashboard/buku-baru" size="sm" class="rounded-full font-bold uppercase">
				<PlusCircle class="size-4" /><span class="hidden sm:inline">Pasang buku</span>
			</Button>
		</div>
	</div>

	<!-- Search mobile -->
	{#if mobileSearch}
		<div class="border-t px-4 py-2 md:hidden">
			<form onsubmit={(e) => { e.preventDefault(); submitSearch(); }} class="relative" role="search">
				<Search class="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input bind:value={search} type="search" placeholder="Cari judul atau penulis…" aria-label="Cari buku" class="h-11 rounded-full pl-10" />
			</form>
		</div>
	{/if}

	<!-- Category nav -->
	<nav class="border-t" aria-label="Kategori">
		<div class="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2">
			<span class="mr-1 hidden shrink-0 items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-muted-foreground lg:inline-flex">
				<Menu class="size-3.5" /> Kategori
			</span>
			{#each categories as c}
				<a
					href={c.href}
					class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-muted"
				>
					<c.icon class="size-3.5 text-primary" />{c.label}
				</a>
			{/each}
			<span class="mx-1 h-5 w-px shrink-0 bg-border"></span>
			{#each nav as n}
				<a
					href={n.href}
					aria-current={isActive(n.href) ? 'page' : undefined}
					class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors {isActive(n.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				>
					{n.label}
				</a>
			{/each}
		</div>
	</nav>
</header>

{@render children?.()}

<footer class="border-t bg-foreground text-background">
	<!-- Newsletter -->
	<div class="border-b border-background/15">
		<div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center">
			<div>
				<p class="text-xl font-black uppercase tracking-tight">Dapat kabar buku baru</p>
				<p class="mt-1 text-sm opacity-70">Listing terbaru di kotamu, langsung ke email. Tanpa spam.</p>
			</div>
			<form
				onsubmit={(e) => e.preventDefault()}
				class="flex w-full max-w-md gap-2 md:ml-auto"
			>
				<Input type="email" required placeholder="Alamat email" aria-label="Alamat email" class="h-11 rounded-full border-background/25 bg-transparent text-background placeholder:text-background/50" />
				<Button type="submit" class="h-11 shrink-0 rounded-full bg-accent font-black uppercase text-accent-foreground hover:opacity-90">
					Daftar
				</Button>
			</form>
		</div>
	</div>
	<div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm sm:grid-cols-2 md:grid-cols-4">
		<div>
			<p class="inline-flex items-center gap-2 text-lg font-black uppercase">
				<span class="grid size-8 place-items-center rounded-lg bg-background text-foreground"><BookOpenText class="size-4" /></span>
				Tukarbuku
			</p>
			<p class="mt-2 opacity-70">Pasar buku bekas untuk komunitas pembaca Indonesia.</p>
		</div>
		<div>
			<p class="font-bold uppercase tracking-widest">Belanja</p>
			<div class="mt-3 flex flex-col gap-2 opacity-80">
				<a href="/koleksi" class="hover:opacity-100">Semua buku</a>
				<a href="/koleksi?type=JUAL" class="hover:opacity-100">Dijual</a>
				<a href="/koleksi?type=BARTER" class="hover:opacity-100">Barter</a>
			</div>
		</div>
		<div>
			<p class="font-bold uppercase tracking-widest">Bantuan</p>
			<div class="mt-3 flex flex-col gap-2 opacity-80">
				<a href="/cara-kerja" class="inline-flex items-center gap-1.5 hover:opacity-100"><Route class="size-3.5" />Cara kerja</a>
				<a href="/login" class="inline-flex items-center gap-1.5 hover:opacity-100"><LogIn class="size-3.5" />Masuk</a>
			</div>
		</div>
		<div>
			<p class="font-bold uppercase tracking-widest">Keamanan</p>
			<p class="mt-3 opacity-70">Bertemu di tempat umum, periksa kondisi buku, simpan kesepakatan di chat.</p>
		</div>
	</div>
	<p class="border-t border-background/15 py-4 text-center text-xs opacity-60">© 2026 Tukarbuku</p>
</footer>
