<script lang="ts">
  import { composerStore } from './_internal/composerStore.ts';
  import MegaComposer from './MegaComposer.svelte';
</script>

{#if $composerStore.isOpen && $composerStore.target}
  <MegaComposer target={$composerStore.target} onClose={composerStore.close} />
{/if}
