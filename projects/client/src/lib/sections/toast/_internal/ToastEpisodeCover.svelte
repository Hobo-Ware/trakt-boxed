<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { episode, show }: { episode: EpisodeEntry; show: ShowEntry } =
    $props();

  const src = $derived(episode.cover.url ?? EPISODE_COVER_PLACEHOLDER);
  const title = $derived(episodeActivityTitle(episode, show));
</script>

<Link
  focusable={false}
  href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
>
  <CardCover
    {title}
    src={src}
    alt={m.image_alt_media_poster({ title })}
  />
</Link>
