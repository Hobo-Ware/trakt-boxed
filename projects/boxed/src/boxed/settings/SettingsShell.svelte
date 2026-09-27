<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsNav from "./SettingsNav.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="boxed-settings">
  <h1 class="boxed-settings-title">{m.page_title_settings()}</h1>
  <div class="boxed-settings-grid">
    <SettingsNav />
    <div class="boxed-settings-content">
      {@render children()}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-settings {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    @include for-mobile {
      gap: var(--ni-16);
    }
  }

  .boxed-settings-title {
    margin: 0;
    font-family: var(--boxed-font-title);
    font-size: var(--ni-40);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.01em;

    @include for-mobile {
      font-size: var(--ni-32);
    }
  }

  .boxed-settings-grid {
    display: grid;
    grid-template-columns: var(--ni-220) minmax(0, 1fr);
    gap: var(--ni-40);
    align-items: start;

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-24);
    }
  }

  .boxed-settings-content {
    min-width: 0;
    max-width: var(--ni-920);

    display: flex;
    flex-direction: column;
    gap: var(--ni-28);

    :global(.trakt-settings-section .settings-title) {
      font-size: var(--ni-24);
      font-weight: 600;
      letter-spacing: -0.01em;
    }
  }
</style>
