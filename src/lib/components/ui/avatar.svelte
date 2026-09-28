<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, name = 'TB', children, ...rest }: any = $props();
</script>
<div class={cn('flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground', className)} {...rest}>
	{#if children}{@render children()}{:else}{name.charAt(0).toUpperCase()}{/if}
</div>
