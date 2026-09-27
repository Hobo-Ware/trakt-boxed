<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ImportSourceCards from "../import/ImportSourceCards.svelte";
</script>

<section class="boxed-welcome-import" aria-labelledby="boxed-welcome-import">
  <header class="import-header">
    <div class="import-copy">
      <h2 id="boxed-welcome-import">{m.welcome_import_heading()}</h2>
      <p>{m.welcome_import_description()}</p>
    </div>
    <a class="import-all" href={UrlBuilder.settings.data()}>
      {m.welcome_import_browse_all()}
    </a>
  </header>

  <ImportSourceCards />
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-welcome-import {
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);
  }

  .import-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--ni-24);


    @include for-mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--ni-12);
    }
  }

  .import-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    h2 {
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-32);
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.01em;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }

    p {
      margin: 0;
      max-width: 72ch;
      font-size: var(--ni-16);
      line-height: 1.5;
      color: var(--color-text-secondary);
    }
  }

  .import-all {
    flex-shrink: 0;
    text-decoration: none;
    font-size: var(--ni-14);
    color: var(--color-text-emphasis);

    &:hover {
      color: var(--color-text-primary);
    }
  }
</style>
