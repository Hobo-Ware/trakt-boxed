<script lang="ts">
  import type { CrewMember } from '$lib/requests/models/MediaCrew.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = {
    title: string;
    originalTitle?: string | null;
    year: number | null | undefined;
    directors: CrewMember[];
    creators: CrewMember[];
    type: 'movie' | 'show';
  };

  const { title, originalTitle, year, directors, creators, type }: Props = $props();

  const credits = $derived(type === 'movie' ? directors : creators);
  const creditLabel = $derived(
    type === 'movie' ? m.text_directed_by_short() : m.text_created_by_short(),
  );
</script>

<header class="film-title-block">
  <div class="film-title-block__row">
    <h1 class="film-title-block__title">{title}</h1>
    {#if year}
      <a class="film-title-block__year" href="/movies/popular?year={year}">{year}</a>
    {/if}
  </div>
  {#if credits.length > 0}
    <p class="film-title-block__credits">
      <span class="film-title-block__credits-label">{creditLabel}</span>
      {#each credits as person, index (person.key)}
        <a class="film-title-block__credit-link" href={UrlBuilder.people(person.key)}>
          {person.name}
        </a>{#if index < credits.length - 1}<span class="film-title-block__sep">,</span> {/if}
      {/each}
    </p>
  {/if}
  {#if originalTitle && originalTitle !== title}
    <p class="film-title-block__original">{originalTitle}</p>
  {/if}
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-title-block {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    &__row {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: var(--gap-s);
    }

    &__title {
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, "Times New Roman", serif);
      font-weight: 400;
      font-size: clamp(2rem, 4.4vw, 3.4rem);
      line-height: 1.05;
      // Reserves vertical space for at least one line so the row above stays
      // pinned while the serif font loads or i18n resolves.
      min-height: calc(clamp(2rem, 4.4vw, 3.4rem) * 1.05);
      color: var(--color-text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }

    &__year {
      font-size: 1.2rem;
      font-weight: 400;
      color: var(--color-text-secondary);
      text-decoration: none;
      letter-spacing: 0.01em;

      &:hover {
        color: var(--color-text-primary);
      }
    }

    &__credits {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.4;
      min-height: calc(0.95rem * 1.4);
      color: var(--color-text-secondary);
      letter-spacing: 0.01em;
    }

    &__credits-label {
      color: var(--color-text-secondary);
      margin-right: 0.35em;
    }

    &__credit-link {
      color: var(--color-text-primary);
      text-decoration: none;

      &:hover {
        color: var(--color-background-green, var(--green-500));
      }
    }

    &__sep {
      color: var(--color-text-secondary);
    }

    &__original {
      margin: 0;
      font-size: 0.85rem;
      font-style: italic;
      color: var(--color-text-secondary);
    }

    @include for-mobile {
      &__title {
        font-size: 1.9rem;
      }
    }
  }
</style>
