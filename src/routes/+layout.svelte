<script lang="ts">
	import '../app.css';
	import Button from '$lib/components/ui/button.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content="Tukarbuku — temukan buku bekas, jual, atau barter dengan pembaca di kotamu." />
</svelte:head>

<header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
		<a href="/" class="flex items-center gap-2 font-bold tracking-tight">
			<span class="grid size-8 place-items-center rounded-md bg-primary text-xs text-primary-foreground">TB</span>
			Tukarbuku
		</a>
		<nav class="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
			<a href="/#koleksi" class="hover:text-foreground">Koleksi</a>
			<a href="/#cara-kerja" class="hover:text-foreground">Cara kerja</a>
			<a href="/dashboard" class="hover:text-foreground">Dashboard</a>
		</nav>
		<div class="flex items-center gap-2">
			<Button href="/login" variant="ghost" size="sm">Masuk</Button>
			<Button href="/dashboard/buku-baru" size="sm">Pasang buku</Button>
		</div>
	</div>
</header>

{@render children?.()}

<footer class="border-t">
	<div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center">
		<span class="font-bold text-foreground">Tukarbuku</span>
		<p class="m-0">Pasar buku bekas untuk komunitas pembaca Indonesia.</p>
		<div class="flex gap-4 md:ml-auto">
			<a href="/#koleksi" class="hover:text-foreground">Koleksi</a>
			<a href="/login" class="hover:text-foreground">Masuk</a>
		</div>
	</div>
</footer>
