<script lang="ts">
  import type { Snippet } from 'svelte';
  import EntityFacetNav, { type FacetKey } from './EntityFacetNav.svelte';

  type Props = {
    kind: 'movie' | 'show';
    slug: string;
    title: string;
    activeFacet: FacetKey;
    year?: number | null;
    posterUrl?: string;
    children: Snippet;
  };

  const { kind, slug, title, activeFacet, year, posterUrl, children }: Props = $props();
</script>

<article class="entity-facet">
  <div class="entity-facet__shell">
    <header class="entity-facet__header">
      {#if posterUrl}
        <img class="entity-facet__poster" src={posterUrl} alt={title} loading="eager" />
      {/if}
      <div class="entity-facet__meta">
        <p class="entity-facet__eyebrow">{kind === 'movie' ? 'Film' : 'Show'}</p>
        <h1 class="entity-facet__title">
          <a href={kind === 'movie' ? `/movies/${slug}` : `/shows/${slug}`}>{title}</a>
          {#if year}<span class="entity-facet__year">{year}</span>{/if}
        </h1>
      </div>
    </header>

    <EntityFacetNav {kind} {slug} active={activeFacet} />

    <div class="entity-facet__body">
      {@render children()}
    </div>
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .entity-facet {
    background: var(--shade-1000);
    min-height: 100dvh;

    &__shell {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(40px, 6vw, 80px) clamp(16px, 3vw, 32px) clamp(40px, 6vw, 80px);
    }

    &__header {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: var(--gap-m);
      align-items: center;
      padding-bottom: var(--gap-m);

      @include for-mobile {
        grid-template-columns: 64px 1fr;
      }
    }

    &__poster {
      width: 100%;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      object-fit: cover;
      background: var(--shade-900);
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-background-green, var(--green-500));
      font-weight: 700;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      line-height: 1.1;
      color: var(--color-text-primary);

      a {
        color: inherit;
        text-decoration: none;

        &:hover { color: var(--color-background-green, var(--green-500)); }
      }
    }

    &__year {
      font-family: var(--font-family-sans, system-ui, sans-serif);
      font-weight: 400;
      font-size: 1rem;
      color: var(--color-text-secondary);
      margin-left: 8px;
    }

    &__body {
      min-height: 40vh;
    }
  }
</style>
