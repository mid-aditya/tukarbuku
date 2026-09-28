<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, children, ...rest }: any = $props();
</script>
<label class={cn('text-sm font-medium leading-none', className)} {...rest}>
	{@render children?.()}
</label>
