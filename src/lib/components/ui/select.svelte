<script lang="ts">
  export let value = '';
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let required = false;
  export let disabled = false;
  export let ariaLabel: string | undefined = undefined;
  export let className = '';

</script>

<select
  bind:value
  {name}
  {id}
  {required}
  {disabled}
  aria-label={ariaLabel}
  class={`ui-select ${className}`}}
>
  <slot />
</select>
