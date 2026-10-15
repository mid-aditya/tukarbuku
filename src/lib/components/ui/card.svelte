<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, children, ...rest }: any = $props();
</script>
<div class={cn('rounded-sm border bg-card text-card-foreground shadow-sm', className)} {...rest}>
	{@render children?.()}
</div>
