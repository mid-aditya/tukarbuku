<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, value = $bindable(''), ref = $bindable(null), ...rest }: any = $props();
</script>
<input bind:this={ref} bind:value class={cn('flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50', className)} {...rest} />
