<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;
  export let className = '';
  export let ariaLabel: string | undefined = undefined;


</script>

<button
  {type}
  {disabled}
  aria-label={ariaLabel}
  class={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
  on:click
>
  <slot />
</button>
