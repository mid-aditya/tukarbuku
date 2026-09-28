<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type DropdownMenuItem = {
		label: string;
		value?: string;
		href?: string;
		icon?: Snippet;
		separator?: boolean;
	};
</script>

<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { Check } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';

	let {
		trigger,
		items = [],
		onSelect,
		align = 'end',
		sideOffset = 8,
		class: className,
		contentClass
	}: {
		trigger: Snippet;
		items?: DropdownMenuItem[];
		onSelect?: (value: string) => void;
		align?: 'start' | 'center' | 'end';
		sideOffset?: number;
		class?: string;
		contentClass?: string;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
			className
		)}
	>
		{@render trigger()}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			{align}
			{sideOffset}
			class={cn(
				'z-50 min-w-44 overflow-hidden rounded-xl border bg-card p-1.5 text-card-foreground shadow-lg',
				contentClass
			)}
		>
			{#each items as item (item.label)}
				{#if item.separator}
					<DropdownMenu.Separator class="my-1 h-px bg-border" />
				{:else if item.href}
					<DropdownMenu.Item
						class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none hover:bg-muted focus:bg-muted"
					>
						{#snippet child({ props }: any)}
							<a href={item.href} {...props} class="flex w-full items-center gap-2.5">
								{@render item.icon?.()}
								{item.label}
							</a>
						{/snippet}
					</DropdownMenu.Item>
				{:else}
					<DropdownMenu.Item
						class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none hover:bg-muted focus:bg-muted"
					>
						{#snippet child({ props }: any)}
							<button
								{...props}
								onclick={() => onSelect?.(item.value ?? item.label)}
								class="flex w-full items-center gap-2.5 text-left"
							>
								{@render item.icon?.()}
								<span class="flex-1">{item.label}</span>
								{#if item.value !== undefined && item.value === item.label}
									<Check class="size-4 text-primary" />
								{/if}
							</button>
						{/snippet}
					</DropdownMenu.Item>
				{/if}
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
