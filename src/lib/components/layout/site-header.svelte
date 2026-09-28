<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, active = false, href = '/', children, ...rest }: any = $props();
</script>

<a {href} class={cn('flex h-16 items-center border-b-2 px-1 text-sm font-medium', active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground', className)} {...rest}>
	{@render children?.()}
</a>
