<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';

  export type FacetKey = 'members' | 'fans' | 'likes' | 'reviews' | 'lists';

  type Props = {
    kind: 'movie' | 'show';
    slug: string;
    active: FacetKey | null;
  };

  const { kind, slug, active }: Props = $props();

  const base = $derived(kind === 'movie' ? `/movies/${slug}` : `/shows/${slug}`);

  const facets: { key: FacetKey; label: string }[] = $derived([
    { key: 'members', label: m.facet_label_members() },
    { key: 'fans', label: m.facet_label_fans() },
    { key: 'likes', label: m.facet_label_likes() },
    { key: 'reviews', label: m.facet_label_reviews() },
    { key: 'lists', label: m.facet_label_lists() },
  ]);
</script>

<nav class="entity-facet-nav" aria-label="Engagement">
  <a class="entity-facet-nav__home" href={base}>← {m.facet_back_to_overview()}</a>
  <ul class="entity-facet-nav__list">
    {#each facets as facet (facet.key)}
      <li>
        <a
          class="entity-facet-nav__link"
          data-active={facet.key === active ? 'true' : undefined}
          href={`${base}/${facet.key}`}
        >{facet.label}</a>
      </li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  .entity-facet-nav {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    padding-bottom: var(--gap-m);
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    margin-bottom: var(--gap-l);

    &__home {
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      color: var(--color-text-secondary);
      text-decoration: none;

      &:hover { color: var(--color-text-primary); }
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-m);
    }

    &__link {
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: 0.25rem 0;
      border-bottom: 2px solid transparent;

      &:hover { color: var(--color-text-primary); }

      &[data-active='true'] {
        color: var(--color-text-primary);
        border-bottom-color: var(--color-background-green, var(--green-500));
      }
    }
  }
</style>
