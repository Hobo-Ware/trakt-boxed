<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import LogDialog from "./_internal/LogDialog.svelte";
  import LogEpisodeForm from "./_internal/LogEpisodeForm.svelte";
  import LogFilmForm from "./_internal/LogFilmForm.svelte";
  import LogPicker from "./_internal/LogPicker.svelte";
  import { logComposerStore } from "./logComposerStore.ts";

  const { state, close, compose } = logComposerStore;
</script>

<RenderFor audience="authenticated">
  {#if $state}
    <LogDialog
      title={$state.mode === "picker"
        ? m.boxed_log_picker_title()
        : $state.target.media.title}
      onClose={close}
    >
      {#if $state.mode === "picker"}
        <LogPicker onPick={compose} />
      {:else if $state.target.type === "movie"}
        {#key $state.target.media.id}
          <LogFilmForm media={$state.target.media} onDone={close} />
        {/key}
      {:else}
        {#key $state.target.media.id}
          <LogEpisodeForm target={$state.target} onDone={close} />
        {/key}
      {/if}
    </LogDialog>
  {/if}
</RenderFor>
