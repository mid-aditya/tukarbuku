<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';
	export const badgeVariants = tv({
		base: 'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1',
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
				outline: 'text-foreground',
				success: 'border-transparent bg-emerald-100 text-emerald-800',
				warning: 'border-transparent bg-amber-100 text-amber-800',
				jual: 'border-transparent bg-orange-100 text-orange-800',
				barter: 'border-transparent bg-emerald-100 text-emerald-800'
			}
		},
		defaultVariants: { variant: 'default' }
	});
	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	let { class: className, variant = 'default', children, ...rest }: any = $props();
</script>

<span class={cn(badgeVariants({ variant }), className)} {...rest}>
	{@render children?.()}
</span>
