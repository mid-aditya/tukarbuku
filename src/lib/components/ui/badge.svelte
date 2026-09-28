<script lang="ts">
  export let variant: 'jual' | 'barter' | 'neutral' | 'success' | 'warning' = 'neutral';
  export let className = '';

</script>

<span class={`ui-badge ui-badge-${variant} ${className}`}>
  <slot />
</span>
