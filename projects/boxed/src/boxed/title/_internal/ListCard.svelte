<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const FAN_SIZE = 5;

  const { list }: { list: MediaListSummary } = $props();

  const href = $derived(
    list.user.slug
      ? UrlBuilder.users(list.user.slug).lists(list.slug)
      : UrlBuilder.lists.official(list.slug),
  );

  const posters = $derived(list.posters.slice(0, FAN_SIZE));

  const meta = $derived(
    [
      toDisplayableName(list.user),
      m.label_list_item_count({ count: toHumanNumber(list.count, languageTag()) }),
      list.likeCount > 0
        ? m.button_text_comment_likes({ count: toHumanNumber(list.likeCount, languageTag()) })
        : null,
    ].filter(Boolean).join(" · "),
  );
</script>

<a class="boxed-list-card" {href}>
  <span class="boxed-list-fan" aria-hidden="true">
    {#each { length: FAN_SIZE }, index (index)}
      {@const poster = posters.at(index)}
      <span class="boxed-list-fan-poster" style:--fan-index={index}>
        {#if poster}
          <CrossOriginImage
            src={poster.url.thumb}
            alt={m.image_alt_list_preview_poster({ title: list.name })}
          />
        {/if}
      </span>
    {/each}
  </span>
  <span class="boxed-list-name">{list.name}</span>
  <span class="boxed-list-meta">{meta}</span>
</a>

<style>
  .boxed-list-card {
    padding: var(--ni-12);

    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);
    text-decoration: none;
    color: var(--color-text-primary);

    &:hover .boxed-list-name,
    &:focus-visible .boxed-list-name {
      color: var(--color-link-active);
    }
  }

  .boxed-list-fan {
    display: flex;
    height: var(--ni-72);
  }

  .boxed-list-fan-poster {
    position: relative;
    z-index: calc(5 - var(--fan-index));
    width: var(--ni-48);
    aspect-ratio: 2 / 3;
    flex-shrink: 0;

    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-foreground) 8%, var(--color-card-background));
    box-shadow: 0 0 0 var(--border-thickness-xxs) var(--color-card-background);

    & + & {
      margin-inline-start: calc(-1 * var(--ni-14));
    }

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-list-name {
    font-family: var(--boxed-font-title);
    font-weight: 600;
    font-size: var(--ni-18);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxed-list-meta {
    font-size: var(--ni-12);
    line-height: var(--ni-16);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
