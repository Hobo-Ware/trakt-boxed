<script lang="ts">
  import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = { media: MediaEntry };
  const { media }: Props = $props();

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  type Row = { key: string; label: string; value: string };

  const rows: Row[] = $derived.by(() => {
    const out: Row[] = [];
    if (media.releaseDate) {
      out.push({
        key: 'release',
        label: m.list_title_release_date(),
        value: dateFormatter.format(media.releaseDate),
      });
    }
    if (
      media.airDate &&
      (!media.releaseDate || media.airDate.getTime() !== media.releaseDate.getTime())
    ) {
      out.push({
        key: 'air',
        label: m.list_title_release_date(),
        value: dateFormatter.format(media.airDate),
      });
    }
    if (media.country) {
      out.push({
        key: 'country',
        label: m.list_title_country(),
        value: media.country.toUpperCase(),
      });
    }
    if (media.certification) {
      out.push({
        key: 'certification',
        label: m.list_title_certification(),
        value: media.certification,
      });
    }
    return out;
  });
</script>

<dl class="film-releases">
  {#each rows as row (row.key)}
    <div class="film-releases__row">
      <dt class="film-releases__label">{row.label}</dt>
      <dd class="film-releases__value">{row.value}</dd>
    </div>
  {/each}
</dl>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-releases {
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

      &__row { display: flex; flex-direction: column; gap: 2px; }
      &__label, &__value { grid-column: auto; }
    }
  }
</style>
