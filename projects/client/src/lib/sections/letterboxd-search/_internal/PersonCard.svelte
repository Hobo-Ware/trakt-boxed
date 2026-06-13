<script lang="ts">
  import type { PersonSummary } from '$lib/requests/models/PersonSummary.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = { person: PersonSummary };
  const { person }: Props = $props();
</script>

<a class="person-card" href={UrlBuilder.people(person.slug)}>
  <div class="person-card__head">
    {#if person.headshot?.url?.thumb}
      <img src={person.headshot.url.thumb} alt={person.name} loading="lazy" />
    {:else}
      <span aria-hidden="true">{person.name.charAt(0)}</span>
    {/if}
  </div>
  <span class="person-card__name">{person.name}</span>
  {#if person.knownFor}<span class="person-card__role">{person.knownFor}</span>{/if}
</a>

<style lang="scss">
  .person-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: inherit;

    &__head {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;

      img { width: 100%; height: 100%; object-fit: cover; }

      span {
        font-family: var(--font-family-serif, Georgia, serif);
        font-size: 1.4rem;
        color: var(--color-text-secondary);
      }
    }

    &__name {
      font-size: 0.85rem;
      color: var(--color-text-primary);
      text-align: center;
      line-height: 1.25;
      min-height: 1.25em;
    }

    &__role {
      font-size: 0.72rem;
      color: var(--color-text-secondary);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    &:hover .person-card__name { color: var(--color-rating-star); }
  }
</style>
