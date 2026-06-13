<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import { streamingSourcesQuery } from '$lib/requests/queries/services/streamingSourcesQuery.ts';
  import type { StreamingSource } from '$lib/requests/models/StreamingSource.ts';
  import type {
    StreamFree,
    StreamingServiceOptions,
    StreamNow,
    StreamOnDemand,
  } from '$lib/requests/models/StreamingServiceOptions.ts';
  import { map } from 'rxjs';

  type Props = { streamOn?: { services: StreamingServiceOptions } | undefined };
  const { streamOn }: Props = $props();

  const sourcesQuery = useQuery(streamingSourcesQuery({}));
  const sourceLookup = $derived(
    sourcesQuery.pipe(
      map(($q) => {
        const result = new Map<string, StreamingSource>();
        const byCountry = $q.data;
        if (!byCountry) return result;
        for (const list of byCountry.values()) {
          for (const source of list) {
            if (!result.has(source.source)) result.set(source.source, source);
          }
        }
        return result;
      }),
    ),
  );

  type ServiceRow = {
    source: string;
    badges: ReadonlyArray<'stream' | 'rent' | 'buy' | 'free'>;
    link: string;
    is4k: boolean;
  };

  function combineByService(services: StreamingServiceOptions): ServiceRow[] {
    const map = new Map<string, ServiceRow>();

    const upsert = (entry: StreamNow | StreamOnDemand | StreamFree, badge: ServiceRow['badges'][number]) => {
      const existing = map.get(entry.source);
      if (existing) {
        if (!existing.badges.includes(badge)) {
          map.set(entry.source, {
            ...existing,
            badges: [...existing.badges, badge],
            is4k: existing.is4k || entry.is4k,
          });
        }
        return;
      }
      map.set(entry.source, {
        source: entry.source,
        badges: [badge],
        link: entry.link,
        is4k: entry.is4k,
      });
    };

    services.streaming.forEach((s) => upsert(s, 'stream'));
    services.free.forEach((s) => upsert(s, 'free'));
    services.onDemand.forEach((entry) => {
      if (entry.prices.rent != null) upsert(entry, 'rent');
      if (entry.prices.purchase != null) upsert(entry, 'buy');
    });

    return Array.from(map.values());
  }

  const rows = $derived(streamOn?.services ? combineByService(streamOn.services) : []);
  const badgeLabel = (badge: ServiceRow['badges'][number]) => {
    switch (badge) {
      case 'stream':
        return m.where_to_watch_badge_stream();
      case 'rent':
        return m.where_to_watch_badge_rent();
      case 'buy':
        return m.where_to_watch_badge_buy();
      case 'free':
        return m.where_to_watch_badge_free();
    }
  };
</script>

{#if rows.length > 0}
  <section class="film-where-to-watch" aria-label={m.where_to_watch_label()}>
    <header class="film-where-to-watch__head">
      <span class="film-where-to-watch__title">{m.where_to_watch_label()}</span>
    </header>
    <ul class="film-where-to-watch__list">
      {#each rows as row (row.source)}
        {@const meta = $sourceLookup.get(row.source)}
        <li>
          <a class="film-where-to-watch__row" href={row.link} target="_blank" rel="noreferrer noopener">
            <span class="film-where-to-watch__source">
              {#if meta?.logoUrl}
                <img class="film-where-to-watch__logo" src={meta.logoUrl} alt="" loading="lazy" />
              {/if}
              <span class="film-where-to-watch__source-name">{meta?.name ?? row.source}</span>
              {#if row.is4k}<span class="film-where-to-watch__hd">4K</span>{/if}
            </span>
            <span class="film-where-to-watch__badges">
              {#each row.badges as badge (badge)}
                <span class="film-where-to-watch__badge" data-kind={badge}>{badgeLabel(badge)}</span>
              {/each}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  .film-where-to-watch {
    margin-top: var(--gap-m);
    border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
    border-radius: 4px;
    background: color-mix(in srgb, var(--shade-900) 60%, transparent);
    overflow: hidden;

    &__head {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
    }

    &__title {
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);
      padding: 0.55rem 0.75rem;
      text-decoration: none;
      color: var(--color-text-primary);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 4%, transparent);

      &:hover {
        background: color-mix(in srgb, var(--shade-10) 4%, transparent);
      }
    }

    &__list li:last-child &__row { border-bottom: none; }

    &__source {
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    &__logo {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      object-fit: cover;
      background: color-mix(in srgb, var(--shade-10) 4%, transparent);
      flex-shrink: 0;
    }

    &__source-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__hd {
      font-size: 0.65rem;
      letter-spacing: 0.06em;
      color: var(--color-watchlist);
      border: 1px solid var(--color-watchlist);
      border-radius: 2px;
      padding: 0 4px;
    }

    &__badges {
      display: inline-flex;
      gap: 4px;
    }

    &__badge {
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 2px;
      background: color-mix(in srgb, var(--shade-10) 6%, transparent);
      color: var(--color-text-secondary);

      &[data-kind="stream"] {
        background: color-mix(in srgb, var(--color-watched) 16%, transparent);
        color: var(--color-watched);
      }
      &[data-kind="free"] {
        background: color-mix(in srgb, var(--color-watched) 12%, transparent);
        color: var(--color-watched);
      }
      &[data-kind="rent"] {
        background: color-mix(in srgb, var(--color-watchlist) 14%, transparent);
        color: var(--color-watchlist);
      }
      &[data-kind="buy"] {
        background: color-mix(in srgb, var(--color-like-active) 14%, transparent);
        color: var(--color-like-active);
      }
    }
  }
</style>
