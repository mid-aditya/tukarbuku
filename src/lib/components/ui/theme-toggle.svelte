<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';
	let { class: className }: { class?: string } = $props();
	let dark = $state(false);

	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('tukarbuku-theme', dark ? 'dark' : 'light');
		} catch (e) {}
	}
</script>

<button
	onclick={toggle}
	aria-label={dark ? 'Ubah ke mode terang' : 'Ubah ke mode gelap'}
	class={cn(
		'inline-flex size-9 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-accent',
		className
	)}
>
	{#if dark}<Sun class="size-4" />{:else}<Moon class="size-4" />{/if}
</button>
