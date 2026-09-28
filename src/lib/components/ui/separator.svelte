<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, ...rest }: any = $props();
</script>
<div class={cn('shrink-0 bg-border h-px w-full', className)} {...rest}></div>
