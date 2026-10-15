<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		X,
		Heart,
		Tag,
		Clock,
		Package,
		Megaphone,
		BookOpen,
		ChevronRight,
		LibraryBig,
		Route,
		HelpCircle,
		Sparkles,
		Banknote,
		ArrowLeftRight
	} from '@lucide/svelte';

	let {
		open = $bindable(false),
		onNavigate
	}: {
		open?: boolean;
		onNavigate?: () => void;
	} = $props();

	const mainLinks = [
		{ href: '/#terlaris', label: 'Terlaris', icon: Heart },
		{ href: '/koleksi?type=JUAL', label: 'Promosi', icon: Tag },
		{ href: '/#penawaran-emas', label: 'Penawaran emas', icon: Tag },
		{ href: '/koleksi', label: 'Kesempatan terakhir', icon: Clock },
		{ href: '/koleksi?type=BARTER', label: 'Paket barter', icon: Package },
		{ href: '/#baru', label: 'Baru', icon: Megaphone },
		{ href: '/cara-kerja', label: 'Panduan buku', icon: BookOpen }
	];

	const categories = [
		{ href: '/koleksi', label: 'Semua buku' },
		{ href: '/koleksi?type=JUAL', label: 'Dijual' },
		{ href: '/koleksi?type=BARTER', label: 'Barter' },
		{ href: '/koleksi?kondisi=Baru', label: 'Kondisi baru' },
		{ href: '/koleksi?kondisi=Baik', label: 'Kondisi baik' }
	];

	const footerLinks = [
		{ href: '/cara-kerja', label: 'Panduan transaksi' },
		{ href: '/cara-kerja', label: 'Bantuan' },
		{ href: '/koleksi', label: 'Semua merek & penulis' }
	];

	function close() {
		open = false;
	}

	function nav(href: string) {
		close();
		onNavigate?.();
		goto(href);
	}
</script>

{#if open}
	<button type="button" class="fixed inset-0 z-50 bg-black/45" aria-label="Tutup menu" onclick={close}></button>

	<aside
		class="fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col bg-background shadow-xl"
		aria-label="Menu navigasi"
	>
		<div class="flex items-center justify-between bg-muted px-4 py-4">
			<span class="text-lg font-bold">Menu</span>
			<button
				type="button"
				class="grid size-11 place-items-center bg-primary text-primary-foreground"
				aria-label="Tutup menu"
				onclick={close}
			>
				<X class="size-6" strokeWidth={2.5} />
			</button>
		</div>

		<nav class="flex-1 overflow-y-auto">
			<ul class="divide-y divide-border">
				{#each mainLinks as link}
					<li>
						<button
							type="button"
							class="flex w-full items-center gap-4 px-4 py-4 text-left text-base font-medium hover:bg-muted/60"
							onclick={() => nav(link.href)}
						>
							<link.icon class="size-5 shrink-0 stroke-[1.5]" />
							{link.label}
						</button>
					</li>
				{/each}
			</ul>

			<div class="border-t border-border px-4 py-3">
				<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kategori</p>
				<ul class="divide-y divide-border">
					{#each categories as cat}
						<li>
							<button
								type="button"
								class="flex w-full items-center justify-between py-3.5 text-left text-base hover:bg-muted/40"
								onclick={() => nav(cat.href)}
							>
								<span class="inline-flex items-center gap-3">
									<LibraryBig class="size-4 text-muted-foreground" />
									{cat.label}
								</span>
								<ChevronRight class="size-4 text-muted-foreground" />
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<ul class="border-t border-border px-4 py-2">
				{#each footerLinks as link}
					<li>
						<button
							type="button"
							class="flex w-full items-center gap-3 py-3 text-left text-base text-foreground/90 hover:underline"
							onclick={() => nav(link.href)}
						>
							{#if link.label === 'Bantuan'}<HelpCircle class="size-4" />{/if}
							{#if link.label === 'Panduan transaksi'}<Route class="size-4" />{/if}
							{#if link.label.includes('merek')}<Sparkles class="size-4" />{/if}
							{link.label}
						</button>
					</li>
				{/each}
			</ul>

			<div class="border-t border-border p-4">
				<p class="mb-2 text-xs font-semibold uppercase text-muted-foreground">Cepat</p>
				<div class="flex flex-col gap-2">
					<button type="button" class="flex items-center gap-2 py-2 font-medium" onclick={() => nav('/koleksi?type=JUAL')}>
						<Banknote class="size-4" /> Beli buku
					</button>
					<button type="button" class="flex items-center gap-2 py-2 font-medium" onclick={() => nav('/koleksi?type=BARTER')}>
						<ArrowLeftRight class="size-4" /> Barter
					</button>
					<button type="button" class="flex items-center gap-2 py-2 font-medium" onclick={() => nav('/dashboard/buku-baru')}>
						<Package class="size-4" /> Pasang buku
					</button>
				</div>
			</div>
		</nav>
	</aside>
{/if}
