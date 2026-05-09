<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdGenreChipsProps = {
    genres: ReadonlyArray<string>;
    type: MediaType;
  };

  const { genres, type }: LetterboxdGenreChipsProps = $props();

  const baseHref = $derived(
    type === "movie" ? UrlBuilder.movies() : UrlBuilder.shows(),
  );
</script>

{#if genres.length > 0}
  <section class="lb-genres">
    <h3>{m.lb_section_genres()}</h3>
    <ul class="lb-genres-list">
      {#each genres as genre (genre)}
        <li>
          <Link
            href={baseHref +
              "?search=" +
              encodeURIComponent(JSON.stringify({ genres: [genre] }))}
            color="inherit"
          >
            <span class="lb-genres-chip">{toTranslatedGenre(genre)}</span>
          </Link>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-genres {
    padding: var(--ni-18) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);

    h3 {
      margin: 0 0 var(--ni-10) 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }

  .lb-genres-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8);
  }

  .lb-genres-chip {
    display: inline-block;
    padding: var(--ni-6) var(--ni-12);
    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    border-radius: var(--border-radius-xs);
    color: var(--color-foreground);
    font-size: var(--ni-12);
    font-weight: 600;

    &:hover {
      background: color-mix(in srgb, var(--tboxed-positive) 30%, transparent);
      color: var(--tboxed-positive);
    }
  }
</style>
