<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import PageContainer from "../components/PageContainer.svelte";
  import PosterGrid from "../poster/PosterGrid.svelte";
  import type { PosterMedia } from "../poster/PosterMedia.ts";
  import TitleCompactHeader from "./TitleCompactHeader.svelte";
  import { useAllRelatedTitles } from "./useAllRelatedTitles.ts";

  const COLUMNS = 8;
  const RESERVED = COLUMNS * 3;

  type RelatedTitlesProps = {
    slug: string;
    type: MediaType;
    eyebrow: string;
    media: PosterMedia | undefined;
    href: string;
  };

  const { slug, type, eyebrow, media, href }: RelatedTitlesProps = $props();

  const { list, isLoading } = $derived(useAllRelatedTitles({ slug, type }));

  const isEmpty = $derived(!$isLoading && $list.length === 0);
</script>

<PageContainer>
  <TitleCompactHeader
    {eyebrow}
    title={media?.title}
    {href}
    poster={media?.poster.url.thumb}
    year={media?.year}
  />

  {#if isEmpty}
    <div class="boxed-related-empty">
      <div class="boxed-related-reserve" aria-hidden="true">
        <PosterGrid
          items={null}
          columns={COLUMNS}
          skeletonCount={RESERVED}
          showUserMeta
        />
      </div>
      <p>{m.text_placeholder_generic()}</p>
    </div>
  {:else}
    <PosterGrid
      items={$isLoading ? null : $list}
      columns={COLUMNS}
      skeletonCount={RESERVED}
      showUserMeta
    />
  {/if}
</PageContainer>

<style>
  .boxed-related-empty {
    position: relative;

    p {
      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;
      margin: 0;
      color: var(--color-text-secondary);
    }
  }

  .boxed-related-reserve {
    visibility: hidden;
  }
</style>
