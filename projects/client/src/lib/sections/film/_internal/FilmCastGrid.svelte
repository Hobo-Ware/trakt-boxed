<script lang="ts">
  import type { CastMember } from '$lib/requests/models/MediaCrew.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = { cast: CastMember[] };
  const { cast }: Props = $props();

  const visible = $derived(cast.slice(0, 24));
</script>

<ul class="film-cast">
  {#each visible as actor (actor.key)}
    <li class="film-cast__item">
      <a class="film-cast__link" href={UrlBuilder.people(actor.key)}>
        <div class="film-cast__head">
          {#if actor.headshot?.url?.thumb}
            <img src={actor.headshot.url.thumb} alt={actor.name} loading="lazy" />
          {:else}
            <div class="film-cast__head-placeholder" aria-hidden="true">
              {actor.name.charAt(0)}
            </div>
          {/if}
        </div>
        <div class="film-cast__meta">
          <span class="film-cast__name">{actor.name}</span>
          {#if actor.characterName}
            <span class="film-cast__role">{actor.characterName}</span>
          {/if}
        </div>
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-cast {
    list-style: none;
    margin: 0;
    padding: var(--gap-m) 0 0;
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(var(--lb-poster-min-w-sm), 100%), 1fr)
    );
    gap: var(--gap-m);

    &__item { margin: 0; }

    &__link {
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-decoration: none;
      color: inherit;

      &:hover .film-cast__name {
        color: var(--color-background-green, var(--green-500));
      }
    }

    &__head {
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &__head-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.4rem;
      color: var(--color-text-secondary);
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: center;
    }

    &__name {
      font-size: 0.85rem;
      color: var(--color-text-primary);
      font-weight: 600;
      line-height: 1.2;
    }

    &__role {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      line-height: 1.2;
    }
  }
</style>
