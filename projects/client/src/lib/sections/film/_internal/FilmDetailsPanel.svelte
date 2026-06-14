<script lang="ts">
  import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
  import type { MediaStudio } from '$lib/requests/models/MediaStudio.ts';
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = {
    media: MediaEntry;
    studios: MediaStudio[];
  };

  const { media, studios }: Props = $props();

  type Row = { key: string; label: string; values: readonly string[] };

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formatRuntime = (mins: number) => {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const mm = mins % 60;
    return h ? `${h}h ${mm}m` : `${mm}m`;
  };

  const rows: Row[] = $derived(
    [
      {
        key: 'studios',
        label: m.list_title_studios(),
        values: studios.map((studio) => studio.name).filter(Boolean),
      },
      {
        key: 'country',
        label: m.list_title_country(),
        values: media.country ? [media.country.toUpperCase()] : [],
      },
      {
        key: 'languages',
        label: m.list_title_languages(),
        values: (media.languages ?? []).map((language) => language.toUpperCase()),
      },
      {
        key: 'runtime',
        label: m.list_title_runtime(),
        values: media.runtime ? [formatRuntime(media.runtime)] : [],
      },
      {
        key: 'release',
        label: m.list_title_release_date(),
        values: media.releaseDate ? [dateFormatter.format(media.releaseDate)] : [],
      },
      {
        key: 'certification',
        label: m.list_title_certification(),
        values: media.certification ? [media.certification] : [],
      },
      {
        key: 'status',
        label: m.list_title_status(),
        values: media.status ? [media.status] : [],
      },
    ].filter((row) => row.values.length > 0),
  );
</script>

<dl class="film-details">
  {#each rows as row (row.key)}
    <div class="film-details__row">
      <dt class="film-details__label">{row.label}</dt>
      <dd class="film-details__value">
        {#each row.values as value, index (value)}
          <span>{value}</span>{#if index < row.values.length - 1}, {/if}
        {/each}
      </dd>
    </div>
  {/each}
</dl>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-details {
    padding-top: var(--gap-m);
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--gap-s) var(--gap-l);
    margin: 0;

    &__row { display: contents; }

    &__label {
      grid-column: 1;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
      padding-top: 2px;
    }

    &__value {
      grid-column: 2;
      margin: 0;
      font-size: 0.9rem;
      color: var(--color-text-primary);
    }

    @include for-mobile {
      grid-template-columns: 1fr;
      gap: var(--gap-m);

      &__row {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      &__label, &__value { grid-column: auto; }
    }
  }
</style>
