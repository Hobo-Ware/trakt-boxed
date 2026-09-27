<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import WelcomeVipUpsell from "$lib/sections/welcome/components/WelcomeVipUpsell.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
</script>

<footer class="boxed-welcome-finish">
  <h2>{m.welcome_outro_heading()}</h2>

  <div class="finish-upsell">
    <WelcomeVipUpsell />
  </div>

  <div class="finish-actions">
    <a class="finish-skip" href={UrlBuilder.home()}>{m.boxed_welcome_skip()}</a>
    <Button
      href={UrlBuilder.home()}
      color="purple"
      variant="primary"
      style="flat"
      label={m.welcome_get_started()}
    >
      {m.welcome_get_started()}
    </Button>
  </div>
</footer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-welcome-finish {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ni-20) var(--ni-24);

    padding-block-start: var(--ni-32);
    border-block-start: var(--border-thickness-xxs) solid var(--color-border);

    h2 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-28);
      font-style: italic;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .finish-upsell {
    grid-column: 1 / -1;
    max-width: var(--ni-520);

    &:not(:has(*)) {
      display: none;
    }
  }

  .finish-actions {
    grid-column: 2;
    grid-row: 1;

    display: flex;
    align-items: center;
    gap: var(--ni-20);

    @include for-mobile {
      grid-column: 1;
      grid-row: auto;
      justify-content: space-between;
    }
  }

  .finish-skip {
    text-decoration: none;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
  }
</style>
