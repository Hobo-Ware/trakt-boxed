<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import { userCommentsQuery } from '$lib/requests/queries/users/userCommentsQuery.ts';
  import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';
  import { map } from 'rxjs';

  type Props = { slug: string };
  const { slug }: Props = $props();

  const query = useInfiniteQuery(userCommentsQuery({ slug, limit: 10, page: 1 }));
  const reviews = $derived(
    query.pipe(map(($q) => $q.data?.pages?.flatMap((p) => p.entries) ?? [])),
  );
  const isLoading = $derived(
    query.pipe(map(($q) => $q.isLoading || ($q.isFetching && !$q.data))),
  );

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const truncate = (text: string, n = 320) =>
    text.length > n ? `${text.slice(0, n).trimEnd()}…` : text;
</script>

<section class="profile-reviews-tab">
  {#if $isLoading && $reviews.length === 0}
    <ul class="profile-reviews-tab__skeleton">
      {#each Array.from({ length: 4 }) as _, i (i)}
        <li>
          <div class="profile-reviews-tab__sk-head"></div>
          <div class="profile-reviews-tab__sk-body"></div>
        </li>
      {/each}
    </ul>
  {:else if $reviews.length === 0}
    <p class="profile-reviews-tab__empty">{m.profile_reviews_empty()}</p>
  {:else}
    <ul class="profile-reviews-tab__list">
      {#each $reviews as entry (entry.key)}
        <li class="profile-reviews-tab__item">
          <header class="profile-reviews-tab__head">
            <time>{dateFormatter.format(entry.comment.createdAt)}</time>
            <span>♥ {toHumanNumber(entry.comment.likeCount)}</span>
          </header>
          <p class="profile-reviews-tab__text">{truncate(entry.comment.comment)}</p>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  .profile-reviews-tab {
    padding-top: var(--gap-l);

    &__empty {
      margin: 0;
      padding: var(--gap-l) 0;
      text-align: center;
      color: var(--color-text-secondary);
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
    }

    &__item {
      padding: var(--gap-m);
      border: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);
      border-radius: 3px;
      background: color-mix(in srgb, var(--shade-900) 60%, transparent);
    }

    &__head {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-bottom: var(--gap-s);
    }

    &__text {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.55;
      color: var(--color-text-primary);
    }

    &__skeleton {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);

      li {
        padding: var(--gap-m);
        border-radius: 3px;
        background: color-mix(in srgb, var(--shade-900) 60%, transparent);
      }
    }

    &__sk-head {
      width: 30%;
      height: 0.95rem;
      background: var(--shade-900);
      border-radius: 2px;
      margin-bottom: var(--gap-s);
    }

    &__sk-body {
      width: 100%;
      height: 3rem;
      background: var(--shade-900);
      border-radius: 2px;
    }
  }
</style>
