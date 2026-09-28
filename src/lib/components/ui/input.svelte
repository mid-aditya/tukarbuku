<script lang="ts">
  export let value = '';
  export let type = 'text';
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let placeholder = '';
  export let required = false;
  export let disabled = false;
  export let autocomplete: 'name' | 'email' | 'tel' | 'url' | 'username' | 'new-password' | 'current-password' | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let className = '';

</script>

<input
  bind:value
  {type}
  {name}
  {id}
  {placeholder}
  {required}
  {disabled}
  {autocomplete}
  aria-label={ariaLabel}
  class={`ui-input ${className}`}}
/>
