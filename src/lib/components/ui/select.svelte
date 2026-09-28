<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, children, ...rest }: any = $props();
</script>
<select class={cn('flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50', className)} {...rest}>
	{@render children?.()}
</select>
