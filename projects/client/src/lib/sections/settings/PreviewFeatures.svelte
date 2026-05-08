<script lang="ts">
  import FeatureFlagItems from "$lib/features/feature-flag/FeatureFlagItems.svelte";
  import { m } from "$lib/features/i18n/messages";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
</script>

<div class="trakt-preview-features">
  <SettingsBlock
    title={m.header_preview_features()}
    description={m.description_preview_features()}
  >
    <FeatureFlagItems classList="trakt-settings-feature-preview" />
  </SettingsBlock>
</div>

<style>
  .trakt-preview-features {
    max-width: var(--ni-480);

    :global(.trakt-settings-feature-preview) {
      justify-content: space-between;
    }
  }
</style>
