<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  type LetterboxdMetaRowProps = {
    year?: number | null;
    runtime?: number | null;
    certification?: string | null;
    trailer?: string | null;
    extra?: string | null;
  };

  const {
    year,
    runtime,
    certification,
    trailer,
    extra,
  }: LetterboxdMetaRowProps = $props();
</script>

<dl class="lb-meta-row">
  {#if year}
    <div class="lb-meta-row-cell">
      <dt>{m.lb_meta_label_year()}</dt>
      <dd>{year}</dd>
    </div>
  {/if}
  {#if runtime}
    <div class="lb-meta-row-cell">
      <dt>{m.lb_meta_label_runtime()}</dt>
      <dd>{runtime} {m.lb_meta_unit_minutes()}</dd>
    </div>
  {/if}
  {#if certification}
    <div class="lb-meta-row-cell">
      <dt>{m.lb_meta_label_rating()}</dt>
      <dd>{certification}</dd>
    </div>
  {/if}
  {#if extra}
    <div class="lb-meta-row-cell">
      <dt>{m.lb_meta_label_status()}</dt>
      <dd>{extra}</dd>
    </div>
  {/if}
  {#if trailer}
    <div class="lb-meta-row-cell lb-meta-row-trailer">
      <a href={trailer} target="_blank" rel="noopener noreferrer">
        <span class="lb-meta-trailer-glyph" aria-hidden="true">▶</span>
        <span>{m.button_text_trailer()}</span>
      </a>
    </div>
  {/if}
</dl>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-meta-row {
    margin: 0;
    padding: var(--ni-12) 0 var(--ni-16);
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-18) var(--ni-26);
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-meta-row-cell {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    dt {
      font-size: var(--ni-10);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    dd {
      margin: 0;
      font-size: var(--ni-14);
      color: var(--color-foreground);
      font-weight: 600;
    }
  }

  .lb-meta-row-trailer {
    margin-left: auto;
    align-self: center;

    a {
      display: inline-flex;
      align-items: center;
      gap: var(--ni-8);
      padding: var(--ni-8) var(--ni-14);
      border-radius: var(--border-radius-xs);
      background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      color: var(--color-foreground);
      font-size: var(--ni-12);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 700;
      text-decoration: none;

      &:hover {
        background: color-mix(in srgb, var(--tboxed-positive) 22%, transparent);
        color: var(--tboxed-positive);
      }
    }
  }

  .lb-meta-trailer-glyph {
    font-size: var(--ni-10);
  }
</style>
