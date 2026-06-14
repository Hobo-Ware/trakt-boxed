<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import RenderFor from '$lib/guards/RenderFor.svelte';
  import SettingsNavbar from './_internal/SettingsNavbar.svelte';

  const { children }: ChildrenProps = $props();
</script>

<RenderFor audience="authenticated">
  <div class="lb-settings">
    <div class="lb-settings__shell">
      <header class="lb-settings__head">
        <p class="lb-settings__eyebrow">{m.text_all_settings()}</p>
        <h1 class="lb-settings__title">{m.page_title_settings()}</h1>
      </header>

      <SettingsNavbar />

      <div class="lb-settings__body">
        {@render children()}
      </div>
    </div>
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-settings {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__shell {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px) clamp(40px, 6vw, 80px);
      display: flex;
      flex-direction: column;
      gap: var(--gap-l);
    }

    &__head {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 400;
      line-height: 1.1;
      color: var(--color-text-primary);
    }

    &__body {
      width: 100%;
      max-width: 920px;
      display: flex;
      flex-direction: column;
      gap: var(--gap-xl);
      padding-top: var(--gap-l);

      :global(.trakt-action-button) {
        &:not(:hover) {
          background-color: transparent;
        }
      }
    }

    @include for-tablet-sm-and-below {
      &__body { max-width: 100%; }
    }
  }
</style>
