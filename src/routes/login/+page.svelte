<script lang="ts">
	import { SignIn } from '@auth/sveltekit/components';
	import type { PageData } from './$types';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Masuk — Tukarbuku</title></svelte:head>

<div class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 md:grid-cols-2 md:py-20">
	<section aria-labelledby="context-title">
		<p class="mb-4 text-xs font-bold uppercase tracking-widest text-primary">Akun pembaca</p>
		<h1 id="context-title" class="text-4xl font-bold tracking-tight md:text-5xl">Kesepakatan buku tetap tercatat di satu tempat.</h1>
		<p class="mt-4 text-muted-foreground">Masuk untuk menghubungi pemilik buku, mengajukan barter, dan membuka kembali riwayat percakapanmu.</p>
		<dl class="mt-8 space-y-0 border-t-2 border-foreground">
			<div class="grid grid-cols-[42px_1fr] items-center border-b py-3">
				<dt class="text-xs font-bold text-primary">01</dt><dd class="text-sm text-muted-foreground">Gunakan chat untuk menyepakati kondisi buku.</dd>
			</div>
			<div class="grid grid-cols-[42px_1fr] items-center border-b py-3">
				<dt class="text-xs font-bold text-primary">02</dt><dd class="text-sm text-muted-foreground">Pilih lokasi COD yang ramai dan mudah dijangkau.</dd>
			</div>
			<div class="grid grid-cols-[42px_1fr] items-center border-b py-3">
				<dt class="text-xs font-bold text-primary">03</dt><dd class="text-sm text-muted-foreground">Periksa buku sebelum membayar atau menukar.</dd>
			</div>
		</dl>
	</section>

	<Card class="p-6 md:p-10">
		<p class="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Masuk ke Tukarbuku</p>
		<h2 class="text-2xl font-bold tracking-tight md:text-3xl">Lanjutkan dengan Google</h2>
		<p class="mt-3 text-sm text-muted-foreground">Kami menggunakan akun Google agar kamu tidak perlu membuat dan mengingat kata sandi baru.</p>
		<div class="mt-6">
			<SignIn provider="google" callbackUrl={data.redirectTo}>
				<div slot="submitButton" class="flex min-h-12 items-center justify-center gap-3 rounded-md border bg-background px-4 font-semibold hover:bg-muted">
					<span class="grid size-6 place-items-center rounded-full border text-xs font-bold text-blue-600">G</span>
					<strong class="text-sm">Masuk dengan Google</strong>
				</div>
			</SignIn>
		</div>
		<p class="mt-4 border-b pb-5 text-xs leading-relaxed text-muted-foreground">Nama, email, dan foto profil dasar digunakan untuk membuat akun Tukarbuku. Kami tidak akan membagikan kontak pribadimu di listing.</p>
		<Button href="/" variant="link" class="mt-3 px-0">Kembali ke koleksi buku</Button>
	</Card>
</div>
