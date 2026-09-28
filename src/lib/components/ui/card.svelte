<script lang="ts">
  export let className = '';
  export let as: 'div' | 'section' | 'article' = 'div';

</script>

<svelte:element this={as} class={`ui-card ${className}`}>
  <slot />
</svelte:element>
