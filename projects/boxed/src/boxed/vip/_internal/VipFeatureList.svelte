<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const FEATURES = [
    [m.vip_feature_title_recaps, m.vip_feature_description_recaps],
    [m.vip_feature_title_global_wtw, m.vip_feature_description_global_wtw],
    [m.vip_feature_title_bigger_watchlist, m.vip_feature_description_bigger_watchlist],
    [m.vip_feature_title_bigger_library, m.vip_feature_description_bigger_library],
    [m.vip_feature_title_plex_sync, m.vip_feature_description_plex_sync],
    [m.vip_feature_title_streaming_services, m.vip_feature_description_streaming_services],
    [m.vip_feature_title_more_lists, m.vip_feature_description_more_lists],
    [m.vip_feature_title_sentiment_trivia, m.vip_feature_description_sentiment_trivia],
    [m.vip_feature_title_api_apps, m.vip_feature_description_api_apps],
    [m.vip_feature_title_support, m.vip_feature_description_support],
  ] as const;
</script>

<ul class="boxed-vip-features">
  {#each FEATURES as [title, description] (title)}
    <li>
      <span class="boxed-vip-feature-mark" aria-hidden="true"><CheckIcon /></span>
      <span class="boxed-vip-feature-text">
        <strong>{title()}</strong>
        <span>{description()}</span>
      </span>
    </li>
  {/each}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-vip-features {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--ni-40);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }

    li {
      padding-block: var(--ni-16);

      display: flex;
      align-items: flex-start;
      gap: var(--ni-12);

      border-bottom: var(--border-thickness-xxs) solid var(--color-border);
    }
  }

  .boxed-vip-feature-mark {
    flex-shrink: 0;
    width: var(--ni-24);
    height: var(--ni-24);

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: var(--boxed-color-accent-soft);
    color: var(--boxed-color-accent-text);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .boxed-vip-feature-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);

    strong {
      font-size: var(--ni-16);
      font-weight: 600;
      color: var(--color-text-primary);
    }

    span {
      font-size: var(--ni-14);
      line-height: 1.5;
      color: var(--color-text-secondary);
    }
  }
</style>
