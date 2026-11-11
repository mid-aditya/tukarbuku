<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import type { TransactionAction } from '$lib/validation/transaction';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';

	let { data, form }: { data: PageData; form: { message?: string } | null } = $props();

	const statusLabels: Record<string, string> = {
		pending: 'Menunggu jawaban',
		disepakati: 'Disepakati',
		selesai: 'Selesai',
		batal: 'Dibatalkan'
	};
	const bookStatusLabels: Record<string, string> = {
		tersedia: 'Tersedia',
		proses: 'Sedang diproses',
		selesai: 'Selesai',
		dibatalkan: 'Dibatalkan'
	};
	const formatPrice = (value: number | null) =>
		value == null
			? null
			: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
	const formatDate = (iso: Date | string) =>
		new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(iso));

	type Row = (typeof data.transactions)[number];

	/** Aksi yang tersedia untuk satu baris transaksi sesuai peran + status. */
	function availableActions(row: Row): { action: TransactionAction; label: string; variant: 'default' | 'outline' | 'destructive'; confirm?: string }[] {
		if (row.status === 'pending') {
			if (row.role === 'seller') {
				return [
					{ action: 'accept', label: 'Terima', variant: 'default' },
					{ action: 'decline', label: 'Tolak', variant: 'destructive', confirm: 'Tolak ajuan ini? Buku akan kembali tersedia.' }
				];
			}
			return [{ action: 'cancel', label: 'Batalkan ajuan', variant: 'outline', confirm: 'Batalkan ajuanmu? Buku akan kembali tersedia.' }];
		}
		if (row.status === 'disepakati') {
			return [
				{ action: 'complete', label: 'Tandai selesai', variant: 'default', confirm: 'Tandai transaksi selesai? Buku akan berstatus selesai permanen.' },
				{ action: 'cancel', label: 'Batalkan', variant: 'destructive', confirm: 'Batalkan kesepakatan ini? Buku akan kembali tersedia.' }
			];
		}
		return [];
	}

	let busyId: string | null = $state(null);
</script>

<svelte:head><title>Transaksi — Tukarbuku</title></svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<nav aria-label="Kembali" class="mb-3">
		<a href="/dashboard" class="text-sm font-semibold text-primary hover:underline">← Kembali ke dashboard</a>
	</nav>
	<p class="mb-1 text-xs font-bold uppercase tracking-widest text-primary">Kesepakatan</p>
	<h1 class="text-3xl font-bold tracking-tight">Transaksi</h1>

	{#if form?.message}
		<Card class="mt-4 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive" role="alert">{form.message}</Card>
	{/if}

	{#if !data.transactions.length}
		<Card class="mt-6 p-12 text-center">
			<h2 class="text-lg font-bold">Belum ada transaksi</h2>
			<p class="mt-1 text-sm text-muted-foreground">Sepakati pembelian atau barter lewat chat, lalu ajukan dari sana — transaksinya muncul di sini.</p>
			<Button href="/dashboard/pesanku" class="mt-4" variant="outline">Buka pesan</Button>
		</Card>
	{:else}
		<Card class="mt-6 divide-y p-0">
			{#each data.transactions as tx (tx.id)}
				{@const actions = availableActions(tx)}
				<div class="flex flex-wrap items-center gap-4 p-4">
					<img src={tx.bookCover} alt={`Sampul ${tx.bookTitle}`} loading="lazy" decoding="async" class="h-20 w-14 rounded-sm border object-cover" />
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<a href={`/buku/${tx.bookId}`} class="truncate text-sm font-bold hover:underline">{tx.bookTitle}</a>
							<Badge variant={tx.type === 'JUAL' ? 'jual' : 'barter'} class="text-[10px] font-bold uppercase">{tx.type === 'JUAL' ? 'Dijual' : 'Barter'}</Badge>
							<Badge variant={tx.status === 'selesai' ? 'success' : tx.status === 'batal' ? 'outline' : 'warning'} class="text-[10px] font-bold uppercase">{statusLabels[tx.status] ?? tx.status}</Badge>
						</div>
						<p class="mt-1 text-xs text-muted-foreground">
							{#if tx.role === 'buyer'}
								Sebagai pembeli — penjual {tx.sellerName}
							{:else}
								Sebagai penjual — pembeli {tx.buyerName}
							{/if}
							{#if tx.type === 'JUAL'} · {formatPrice(tx.bookPrice)}{/if}
							· Diperbarui {formatDate(tx.updatedAt)}
						</p>
						<p class="text-xs text-muted-foreground">Status buku: {bookStatusLabels[tx.bookStatus] ?? tx.bookStatus}</p>
					</div>
					{#if actions.length}
						<div class="ml-auto flex shrink-0 gap-2">
							{#each actions as a (a.action)}
								<form
									method="POST"
									action="?/transition"
									onsubmit={(e) => {
										if (a.confirm && !window.confirm(a.confirm)) e.preventDefault();
										else busyId = tx.id;
									}}
								>
									<input type="hidden" name="transactionId" value={tx.id} />
									<input type="hidden" name="action" value={a.action} />
									<Button type="submit" variant={a.variant} size="sm" disabled={busyId === tx.id}>
										{busyId === tx.id ? 'Memproses…' : a.label}
									</Button>
								</form>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</Card>
	{/if}
</div>
