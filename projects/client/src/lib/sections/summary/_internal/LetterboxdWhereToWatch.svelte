<script lang="ts">
  /*
    Where-to-Watch list, Letterboxd shape: vertical service rows
    showing a streaming-service logo, the source name, and an
    inline pill cluster (BLU subscription, RENT/BUY on-demand,
    FREE, 4K). Reads StreamOn from the route data hook directly,
    no JustWatch wrapper component.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import type { StreamOn } from "$lib/requests/models/StreamOn";

  type LetterboxdWhereToWatchProps = {
    streamOn?: StreamOn;
    country?: string;
  };

  const { streamOn, country }: LetterboxdWhereToWatchProps = $props();

  type RowPill = { label: string; tone: "stream" | "rent" | "buy" | "free" };

  type Row = {
    key: string;
    source: string;
    href: string;
    is4k: boolean;
    pills: RowPill[];
  };

  const rows = $derived.by((): Row[] => {
    if (!streamOn?.services) return [];
    const map = new Map<string, Row>();

    const upsert = (
      key: string,
      source: string,
      href: string,
      is4k: boolean,
      pill: RowPill,
    ) => {
      const k = source;
      const r = map.get(k);
      if (r) {
        r.pills.push(pill);
        r.is4k = r.is4k || is4k;
      } else {
        map.set(k, { key, source, href, is4k, pills: [pill] });
      }
    };

    for (const s of streamOn.services.streaming ?? []) {
      upsert(s.key, s.source, s.link, s.is4k, {
        label: m.lb_wtw_pill_stream(),
        tone: "stream",
      });
    }
    for (const s of streamOn.services.onDemand ?? []) {
      const isRent = s.prices?.rent != null;
      const isBuy = s.prices?.purchase != null;
      if (isRent) {
        upsert(s.key, s.source, s.link, s.is4k, {
          label: m.lb_wtw_pill_rent(),
          tone: "rent",
        });
      }
      if (isBuy) {
        upsert(s.key, s.source, s.link, s.is4k, {
          label: m.lb_wtw_pill_buy(),
          tone: "buy",
        });
      }
    }
    for (const s of streamOn.services.free ?? []) {
      upsert(s.key, s.source, s.link, s.is4k, {
        label: m.lb_wtw_pill_free(),
        tone: "free",
      });
    }

    return [...map.values()];
  });
</script>

{#if rows.length > 0}
  <section class="lb-wtw">
    <header class="lb-wtw-head">
      <h3>{m.lb_section_where_to_watch()}</h3>
      {#if country}
        <span class="lb-wtw-region">{country.toUpperCase()}</span>
      {/if}
    </header>

    <ul class="lb-wtw-list">
      {#each rows as row (row.key)}
        <li>
          <a
            class="lb-wtw-row"
            href={row.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="lb-wtw-logo">
              <StreamingServiceLogo
                source={row.source}
                country={country?.toLowerCase()}
                i18n={StreamingServiceLogoIntlProvider}
              />
            </span>

            <span class="lb-wtw-name">{row.source}</span>

            <span class="lb-wtw-pills">
              {#each row.pills as pill, i (i)}
                <span class={`lb-wtw-pill ${pill.tone}`}>{pill.label}</span>
              {/each}
              {#if row.is4k}
                <span class="lb-wtw-pill four-k">4K</span>
              {/if}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-wtw {
    padding: var(--ni-22) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-wtw-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--ni-12);

    h3 {
      margin: 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }

  .lb-wtw-region {
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
    letter-spacing: 0.12em;
  }

  .lb-wtw-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .lb-wtw-row {
    display: grid;
    grid-template-columns: var(--ni-32) 1fr auto;
    gap: var(--ni-12);
    align-items: center;
    padding: var(--ni-10) 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-foreground) 6%, transparent);
    text-decoration: none;
    color: var(--color-foreground);

    &:hover {
      background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
    }
  }

  .lb-wtw-logo {
    width: var(--ni-32);
    height: var(--ni-32);
    display: grid;
    place-items: center;
  }

  .lb-wtw-name {
    font-size: var(--ni-13);
    font-weight: 600;
    color: var(--color-foreground);
    text-transform: capitalize;
  }

  .lb-wtw-pills {
    display: inline-flex;
    gap: var(--ni-4);
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .lb-wtw-pill {
    display: inline-block;
    padding: 2px var(--ni-8);
    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    border-radius: 2px;
    font-size: var(--ni-10);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .lb-wtw-pill.stream {
    background: color-mix(in srgb, var(--tboxed-positive) 22%, transparent);
    color: var(--tboxed-positive);
  }

  .lb-wtw-pill.rent,
  .lb-wtw-pill.buy {
    background: color-mix(in srgb, var(--color-foreground) 14%, transparent);
    color: var(--color-foreground);
  }

  .lb-wtw-pill.free {
    background: color-mix(in srgb, var(--tboxed-network) 25%, transparent);
    color: var(--tboxed-network);
  }

  .lb-wtw-pill.four-k {
    background: color-mix(in srgb, var(--tboxed-rating) 25%, transparent);
    color: var(--tboxed-rating);
  }
</style>
