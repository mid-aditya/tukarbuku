<script lang="ts">
  export let value = '';
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let placeholder = '';
  export let required = false;
  export let disabled = false;
  export let rows = 4;
  export let ariaLabel: string | undefined = undefined;
  export let className = '';

</script>

<textarea
  bind:value
  {name}
  {id}
  {placeholder}
  {required}
  {disabled}
  {rows}
  aria-label={ariaLabel}
  class={`ui-textarea ${className}`}}
></textarea>
