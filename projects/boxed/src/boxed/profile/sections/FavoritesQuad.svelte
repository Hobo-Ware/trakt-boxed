<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFavoritesList } from "$lib/sections/lists/stores/useFavoritesList.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import type { PosterMedia } from "../../poster/PosterMedia.ts";
  import PosterQuad from "./PosterQuad.svelte";

  const FAVORITES_SHOWN = 4;

  const {
    slug,
    type,
    title,
  }: { slug: string; type: "movie" | "show"; title: string } = $props();

  const { list, isLoading } = $derived(
    useFavoritesList({ slug, type, limit: FAVORITES_SHOWN }),
  );

  const items = $derived(
    $isLoading && $list.length === 0
      ? null
      : $list.map((entry): PosterMedia => ({ ...entry.item, type })),
  );
</script>

<section>
  <SectionHeader
    {title}
    href={UrlBuilder.profile.favorites(slug, { mode: type })}
  />
  <PosterQuad {items} loading="eager" emptyText={m.list_placeholder_favorites()} />
</section>
