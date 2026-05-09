<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  type LetterboxdSynopsisProps = {
    tagline?: string | null;
    overview?: string | null;
  };

  const { tagline, overview }: LetterboxdSynopsisProps = $props();

  let isExpanded = $state(false);
  const COLLAPSED_LIMIT = 320;

  const isClippable = $derived((overview?.length ?? 0) > COLLAPSED_LIMIT);
  const visibleText = $derived.by(() => {
    if (!overview) return "";
    if (isExpanded || !isClippable) return overview;
    return overview.slice(0, COLLAPSED_LIMIT).trimEnd();
  });
</script>

{#if tagline || overview}
  <section class="lb-synopsis">
    {#if tagline}
      <p class="lb-synopsis-tagline">{tagline}</p>
    {/if}
    {#if overview}
      <p class="lb-synopsis-body">
        {visibleText}{#if isClippable && !isExpanded}…{/if}
        {#if isClippable}
          <button
            type="button"
            class="lb-synopsis-toggle"
            onclick={() => (isExpanded = !isExpanded)}
          >
            {isExpanded ? m.lb_synopsis_less() : m.lb_synopsis_more()}
          </button>
        {/if}
      </p>
    {/if}
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-synopsis {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    padding: var(--ni-22) 0;
  }

  .lb-synopsis-tagline {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: var(--ni-12);
    color: var(--color-foreground);
    font-weight: 700;
  }

  .lb-synopsis-body {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground) 92%, transparent);
    font-size: var(--ni-15);
    line-height: 1.6;
    max-width: var(--ni-720);
  }

  .lb-synopsis-toggle {
    margin-left: var(--ni-4);
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--tboxed-positive);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
