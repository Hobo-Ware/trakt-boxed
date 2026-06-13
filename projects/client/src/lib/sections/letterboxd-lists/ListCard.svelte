<script lang="ts">
  import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

  type Props = {
    list: MediaListSummary;
    posterCount?: 4 | 5;
  };

  const { list, posterCount = 5 }: Props = $props();

  const posters = $derived(
    list.posters.slice(0, posterCount).map((poster) => poster.url.medium ?? poster.url.thumb),
  );
  const author = $derived(list.user.name?.full || `@${list.user.username}`);
  const href = $derived(
    UrlBuilder.users(list.user.slug ?? list.user.username).lists(list.slug),
  );
</script>

<a class="list-card" {href}>
  <div class="list-card__stack" aria-hidden="true">
    {#each posters as src, index (index)}
      <div
        class="list-card__poster"
        style:--list-card-index={index}
        style:background-image={`url(${src})`}
      ></div>
    {/each}
  </div>
  <div class="list-card__body">
    <h3 class="list-card__title">{list.name}</h3>
    <p class="list-card__author">Created by <span>{author}</span></p>
    <p class="list-card__stats">
      <span>{toHumanNumber(list.count)} films</span>
      <span>♥ {toHumanNumber(list.likeCount)}</span>
    </p>
  </div>
</a>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .list-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    text-decoration: none;
    color: inherit;
    padding: var(--gap-m);
    border-radius: 4px;
    background: color-mix(in srgb, var(--shade-900) 60%, transparent);
    border: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);
    transition: border-color 140ms ease, background 140ms ease;

    &:hover {
      border-color: color-mix(in srgb, var(--shade-10) 14%, transparent);
      background: color-mix(in srgb, var(--shade-900) 75%, transparent);
    }

    &__stack {
      position: relative;
      height: 0;
      padding-top: 50%;
      width: 100%;
    }

    &__poster {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 30%;
      background-size: cover;
      background-position: center;
      border-radius: 2px;
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--shade-10) 8%, transparent) inset,
        0 8px 18px -10px rgba(0, 0, 0, 0.6);
      transform: rotate(calc(var(--list-card-index) * -3deg + 6deg));
      transform-origin: bottom center;
      left: calc(8% + var(--list-card-index) * 16%);
      z-index: calc(10 - var(--list-card-index));
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 1.25;
      min-height: calc(1.2rem * 1.25);
      color: var(--color-text-primary);
    }

    &__author {
      margin: 0;
      font-size: 0.8rem;
      color: var(--color-text-secondary);

      span { color: var(--color-text-primary); }
    }

    &__stats {
      margin: 0;
      display: flex;
      gap: var(--gap-s);
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    @include for-mobile {
      &__stack { padding-top: 60%; }
      &__poster {
        width: 36%;
        left: calc(4% + var(--list-card-index) * 14%);
      }
    }
  }
</style>
