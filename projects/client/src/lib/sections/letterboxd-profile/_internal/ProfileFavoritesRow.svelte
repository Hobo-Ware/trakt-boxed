<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import PosterTile from '$lib/sections/film/PosterTile.svelte';
  import { useFavoritesList } from '$lib/sections/lists/stores/useFavoritesList.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = { slug: string };
  const { slug }: Props = $props();

  const { list } = $derived(
    useFavoritesList({ type: undefined, slug, limit: 4 }),
  );

  const favorites = $derived(
    ($list ?? [])
      .map((favorite) => favorite.item)
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .slice(0, 4),
  );
</script>

<section class="profile-row">
  <header class="profile-row__header">
    <div>
      <p class="profile-row__eyebrow">{m.profile_section_eyebrow_favorites()}</p>
      <h2 class="profile-row__title">{m.profile_section_title_favorites()}</h2>
    </div>
    <a class="profile-row__view-all" href={UrlBuilder.profile.favorites(slug)}>
      {m.home_row_view_all()}
    </a>
  </header>

  {#if favorites.length === 0}
    <p class="profile-row__empty">{m.profile_section_empty_favorites()}</p>
  {:else}
    <ul class="profile-row__grid">
      {#each favorites as entry (entry.key)}
        <li><PosterTile {entry} showTitle /></li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .profile-row {
    padding-top: var(--gap-l);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: var(--gap-m);
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-m);
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.2rem, 2.4vw, 1.8rem);
      color: var(--color-text-primary);
    }

    &__view-all {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 700;

      &:hover { color: var(--color-background-green, var(--green-500)); }
    }

    &__grid {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--lb-grid-gap);

      @include for-tablet-sm { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      @include for-mobile { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    &__empty {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }
  }
</style>
