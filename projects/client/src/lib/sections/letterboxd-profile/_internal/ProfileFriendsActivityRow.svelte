<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import type { SocialActivity } from '$lib/requests/models/SocialActivity.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = { activity: SocialActivity };
  const { activity }: Props = $props();

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const headUsers = $derived(activity.users.slice(0, 3));
  const restCount = $derived(Math.max(0, activity.users.length - headUsers.length));

  const target = $derived(
    activity.type === 'movie'
      ? {
          title: activity.movie.title,
          year: activity.movie.year,
          poster: activity.movie.poster?.url?.thumb,
          href: UrlBuilder.movie(activity.movie.slug),
        }
      : {
          title: activity.show.title,
          year: activity.show.year,
          poster: activity.show.poster?.url?.thumb,
          href: UrlBuilder.show(activity.show.slug),
        },
  );

  const episodeLabel = $derived(
    activity.type === 'episode'
      ? `S${String(activity.episode.season).padStart(2, '0')}E${String(activity.episode.number).padStart(2, '0')}`
      : null,
  );
</script>

<article class="activity-row">
  <a class="activity-row__poster" href={target.href} aria-label={target.title}>
    {#if target.poster}
      <img src={target.poster} alt={target.title} loading="lazy" />
    {:else}
      <span aria-hidden="true">{target.title.charAt(0)}</span>
    {/if}
  </a>
  <div class="activity-row__body">
    <p class="activity-row__head">
      {#each headUsers as user, i (user.id)}
        <a class="activity-row__user" href={UrlBuilder.profile.user(user.slug ?? user.username)}>
          {user.name?.full || user.username}
        </a>{#if i < headUsers.length - 1}, {/if}
      {/each}
      {#if restCount > 0}
        <span class="activity-row__more">+{restCount}</span>
      {/if}
      <span class="activity-row__verb">{m.activity_verb_watched()}</span>
    </p>
    <a class="activity-row__title" href={target.href}>
      {target.title}
      {#if target.year}
        <span class="activity-row__year">{target.year}</span>
      {/if}
      {#if episodeLabel}
        <span class="activity-row__episode">{episodeLabel}</span>
      {/if}
    </a>
    <time class="activity-row__time" datetime={activity.activityAt.toISOString()}>
      {dateFormatter.format(activity.activityAt)}
    </time>
  </div>
</article>

<style lang="scss">
  .activity-row {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: var(--gap-m);
    padding: var(--gap-s) 0;
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 5%, transparent);

    &__poster {
      display: block;
      width: 56px;
      aspect-ratio: 2 / 3;
      border-radius: 3px;
      overflow: hidden;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);
      box-shadow: 0 4px 10px -6px rgba(0, 0, 0, 0.5);
      text-decoration: none;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;

      img { width: 100%; height: 100%; object-fit: cover; }

      span {
        font-family: var(--font-family-serif, Georgia, serif);
        font-size: 1.1rem;
      }
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    &__head {
      margin: 0;
      font-size: 0.85rem;
      color: var(--color-text-secondary);
    }

    &__user {
      color: var(--color-text-primary);
      font-weight: 600;
      text-decoration: none;

      &:hover { color: var(--color-watched); }
    }

    &__verb {
      margin-left: 4px;
      color: var(--color-text-secondary);
    }

    &__more {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-left: 4px;
    }

    &__title {
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 1.05rem;
      color: var(--color-text-primary);
      text-decoration: none;
      line-height: 1.2;

      &:hover { color: var(--color-watched); }
    }

    &__year, &__episode {
      font-family: var(--font-family-sans, system-ui, sans-serif);
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      margin-left: 4px;
    }

    &__time {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }
</style>
