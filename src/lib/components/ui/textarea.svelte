<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, value = $bindable(''), ref = $bindable(null), children, ...rest }: any = $props();
</script>
<textarea bind:this={ref} bind:value class={cn('flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50', className)} {...rest}></textarea>
