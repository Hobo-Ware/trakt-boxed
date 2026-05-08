<script lang="ts">
  /*
    Pill row of media genres. Each chip routes to the discover page
    pre-filtered by that genre.
  */
  import Link from "$lib/components/link/Link.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type MediaGenresProps = {
    genres: ReadonlyArray<string>;
    type: MediaType;
  };

  const { genres, type }: MediaGenresProps = $props();
</script>

{#if genres.length > 0}
  <div class="trakt-media-genres">
    {#each genres as genre (genre)}
      <Link
        href={(type === "movie" ? UrlBuilder.movies() : UrlBuilder.shows()) +
          "?search=" +
          encodeURIComponent(JSON.stringify({ genres: [genre] }))}
      >
        <span class="trakt-media-genre-chip">{toTranslatedGenre(genre)}</span>
      </Link>
    {/each}
  </div>
{/if}

<style>
  .trakt-media-genres {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
  }

  .trakt-media-genre-chip {
    display: inline-block;

    padding: var(--ni-4) var(--ni-12);
    border-radius: 999px;

    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    color: var(--color-text-secondary);

    font-size: var(--font-size-tag);
    text-transform: lowercase;
    letter-spacing: 0.04em;

    transition: background var(--transition-increment) ease-in-out;
  }

  .trakt-media-genre-chip:hover {
    background: color-mix(in srgb, var(--color-foreground) 14%, transparent);
    color: var(--color-foreground);
  }
</style>
