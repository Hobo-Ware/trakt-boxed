<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import { movieCommentsQuery } from '$lib/requests/queries/movies/movieCommentsQuery.ts';
  import { showCommentsQuery } from '$lib/requests/queries/shows/showCommentsQuery.ts';
  import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import { map } from 'rxjs';

  type Props = {
    type: 'movie' | 'show';
    slug: string;
  };

  const { type, slug }: Props = $props();

  const popular = $derived(
    useInfiniteQuery(
      type === 'movie'
        ? movieCommentsQuery({ slug, sort: 'likes', limit: 3 })
        : showCommentsQuery({ slug, sort: 'likes', limit: 3 }),
    ),
  );
  const recent = $derived(
    useInfiniteQuery(
      type === 'movie'
        ? movieCommentsQuery({ slug, sort: 'newest', limit: 3 })
        : showCommentsQuery({ slug, sort: 'newest', limit: 3 }),
    ),
  );

  const popularReviews = $derived(
    popular.pipe(map(($q) => $q.data?.pages?.flatMap((p) => p.entries) ?? [])),
  );
  const recentReviews = $derived(
    recent.pipe(map(($q) => $q.data?.pages?.flatMap((p) => p.entries) ?? [])),
  );

  const moreHref = $derived(
    type === 'movie' ? `/movies/${slug}/reviews` : `/shows/${slug}/reviews`,
  );

  const truncate = (text: string, n = 260) =>
    text.length > n ? `${text.slice(0, n).trimEnd()}…` : text;

  function renderStars(rating?: number | null) {
    if (!rating) return [] as { state: 'full' | 'half' | 'empty'; index: number }[];
    return Array.from({ length: 5 }, (_, i) => {
      const fill = rating / 2 - i;
      return {
        index: i,
        state: fill >= 1 ? 'full' : fill >= 0.5 ? 'half' : 'empty',
      };
    });
  }
</script>

<section class="film-reviews">
  <header class="film-reviews__head">
    <p class="film-reviews__eyebrow">{m.reviews_section_popular()}</p>
    <a class="film-reviews__more" href={moreHref}>{m.reviews_more()}</a>
  </header>
  {#if $popularReviews.length === 0}
    <p class="film-reviews__empty">{m.facet_empty_reviews()}</p>
  {:else}
    <ul class="film-reviews__list">
      {#each $popularReviews as review (review.id)}
        <li class="film-reviews__item">
          <a
            class="film-reviews__avatar"
            href={UrlBuilder.profile.user(review.user.slug ?? review.user.username)}
            aria-label={review.user.username}
          >
            {#if review.user.avatar?.url}
              <img src={review.user.avatar.url} alt="" />
            {:else}
              <span aria-hidden="true">{review.user.username.charAt(0)}</span>
            {/if}
          </a>
          <div class="film-reviews__body">
            <header class="film-reviews__row">
              <span class="film-reviews__author">
                {m.reviews_review_by()}
                <a href={UrlBuilder.profile.user(review.user.slug ?? review.user.username)}>
                  {review.user.name?.full || review.user.username}
                </a>
              </span>
              {#if review.user.stats?.rating}
                {@const stars = renderStars(review.user.stats.rating)}
                <span class="film-reviews__stars" aria-label={`${review.user.stats.rating}/10`}>
                  {#each stars as star (star.index)}
                    <span class="film-reviews__star" data-state={star.state}>★</span>
                  {/each}
                </span>
              {/if}
            </header>
            <p class="film-reviews__text" class:film-reviews__text--spoiler={review.isSpoiler}>
              {truncate(review.comment)}
            </p>
            <footer class="film-reviews__footer">
              <span>♥ {toHumanNumber(review.likeCount)} {m.reviews_likes()}</span>
              {#if review.replyCount > 0}
                <span>💬 {toHumanNumber(review.replyCount)}</span>
              {/if}
            </footer>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  {#if $recentReviews.length > 0}
    <header class="film-reviews__head film-reviews__head--secondary">
      <p class="film-reviews__eyebrow">{m.reviews_section_recent()}</p>
      <a class="film-reviews__more" href={moreHref}>{m.reviews_more()}</a>
    </header>
    <ul class="film-reviews__list">
      {#each $recentReviews as review (review.id)}
        <li class="film-reviews__item">
          <a
            class="film-reviews__avatar"
            href={UrlBuilder.profile.user(review.user.slug ?? review.user.username)}
            aria-label={review.user.username}
          >
            {#if review.user.avatar?.url}
              <img src={review.user.avatar.url} alt="" />
            {:else}
              <span aria-hidden="true">{review.user.username.charAt(0)}</span>
            {/if}
          </a>
          <div class="film-reviews__body">
            <header class="film-reviews__row">
              <span class="film-reviews__author">
                {m.reviews_review_by()}
                <a href={UrlBuilder.profile.user(review.user.slug ?? review.user.username)}>
                  {review.user.name?.full || review.user.username}
                </a>
              </span>
              {#if review.user.stats?.rating}
                {@const stars = renderStars(review.user.stats.rating)}
                <span class="film-reviews__stars" aria-label={`${review.user.stats.rating}/10`}>
                  {#each stars as star (star.index)}
                    <span class="film-reviews__star" data-state={star.state}>★</span>
                  {/each}
                </span>
              {/if}
            </header>
            <p class="film-reviews__text" class:film-reviews__text--spoiler={review.isSpoiler}>
              {truncate(review.comment)}
            </p>
            <footer class="film-reviews__footer">
              <span>♥ {toHumanNumber(review.likeCount)} {m.reviews_likes()}</span>
              {#if review.replyCount > 0}
                <span>💬 {toHumanNumber(review.replyCount)}</span>
              {/if}
            </footer>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  .film-reviews {
    padding-top: var(--gap-l);

    &__head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: var(--gap-s);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
      margin-bottom: var(--gap-m);

      &--secondary {
        margin-top: var(--gap-l);
      }
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__more {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 700;

      &:hover { color: var(--color-text-primary); }
    }

    &__empty {
      margin: 0;
      font-size: 0.95rem;
      color: var(--color-text-secondary);
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    &__item {
      display: grid;
      grid-template-columns: 48px 1fr;
      gap: var(--gap-m);
      padding: var(--gap-m) 0;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);

      &:last-child { border-bottom: none; }
    }

    &__avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: var(--color-text-secondary);
      font-family: var(--font-family-serif, Georgia, serif);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    &__row {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      flex-wrap: wrap;
    }

    &__author {
      font-size: 0.85rem;
      color: var(--color-text-secondary);

      a {
        color: var(--color-text-primary);
        font-weight: 600;
        text-decoration: none;
        margin-left: 4px;

        &:hover { color: var(--color-rating-star); }
      }
    }

    &__stars {
      display: inline-flex;
      gap: 1px;
      font-size: 0.95rem;
      line-height: 1;
    }

    &__star {
      color: color-mix(in srgb, var(--shade-10) 18%, transparent);

      &[data-state="full"] { color: var(--color-rating-star); }
      &[data-state="half"] {
        background: linear-gradient(
          90deg,
          var(--color-rating-star) 50%,
          color-mix(in srgb, var(--shade-10) 18%, transparent) 50%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &__text {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--color-text-primary);

      &--spoiler {
        filter: blur(4px);
        transition: filter 140ms ease;

        &:hover { filter: none; }
      }
    }

    &__footer {
      display: flex;
      gap: var(--gap-m);
      font-size: 0.78rem;
      color: var(--color-text-secondary);
    }
  }
</style>
