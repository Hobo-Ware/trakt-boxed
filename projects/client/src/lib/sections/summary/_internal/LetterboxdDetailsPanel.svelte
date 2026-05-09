<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";

  type LetterboxdDetailsPanelProps = {
    media: MediaEntry;
    studios?: MediaStudio[];
  };

  const { media, studios = [] }: LetterboxdDetailsPanelProps = $props();

  const releaseDate = $derived.by(() => {
    if (!media.releaseDate) return null;
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(media.releaseDate);
    } catch {
      return null;
    }
  });

  const languages = $derived(
    (media.languages ?? [])
      .map((code) => code.toUpperCase())
      .filter(Boolean)
      .join(" · "),
  );

  const studioNames = $derived(
    studios
      .slice(0, 4)
      .map((s) => s.name)
      .join(" · "),
  );
</script>

<section class="lb-details">
  <h3>{m.lb_section_details()}</h3>
  <dl class="lb-details-grid">
    {#if studioNames}
      <div>
        <dt>{m.lb_details_studio()}</dt>
        <dd>{studioNames}</dd>
      </div>
    {/if}
    {#if media.country}
      <div>
        <dt>{m.lb_details_country()}</dt>
        <dd>{media.country.toUpperCase()}</dd>
      </div>
    {/if}
    {#if languages}
      <div>
        <dt>{m.lb_details_language()}</dt>
        <dd>{languages}</dd>
      </div>
    {/if}
    {#if releaseDate}
      <div>
        <dt>{m.lb_details_release()}</dt>
        <dd>{releaseDate}</dd>
      </div>
    {/if}
    {#if media.runtime}
      <div>
        <dt>{m.lb_details_runtime()}</dt>
        <dd>{media.runtime} {m.lb_meta_unit_minutes()}</dd>
      </div>
    {/if}
    {#if media.status}
      <div>
        <dt>{m.lb_details_status()}</dt>
        <dd>{media.status}</dd>
      </div>
    {/if}
  </dl>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-details {
    padding: var(--ni-18) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);

    h3 {
      margin: 0 0 var(--ni-12) 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }

  .lb-details-grid {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ni-12) var(--ni-22);

    @include for-tablet-sm {
      grid-template-columns: repeat(2, 1fr);
    }

    @include for-tablet-lg {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .lb-details-grid > div {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  dt {
    font-size: var(--ni-10);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  dd {
    margin: 0;
    color: var(--color-foreground);
    font-size: var(--ni-13);
    font-weight: 500;
  }
</style>
