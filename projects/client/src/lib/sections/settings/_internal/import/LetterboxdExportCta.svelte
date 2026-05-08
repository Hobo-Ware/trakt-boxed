<script lang="ts">
  /*
    The Letterboxd-export nudge. Two variants:
      default — block CTA for the import surface; full prose + button.
      compact — one-liner with a link, fits in a login gate / sign-in
                drawer footer.

    Letterboxd's export lives at /data/export/. The CTA is a deliberate
    handshake: trakt-boxed is the natural next home for an existing
    Letterboxd diary, and the import flow that picks up the .zip is
    one screen away.
  */
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  type LetterboxdExportCtaProps = {
    variant?: "default" | "compact";
  };

  const { variant = "default" }: LetterboxdExportCtaProps = $props();

  const exportUrl = "https://letterboxd.com/data/export/";
</script>

{#if variant === "compact"}
  <p class="trakt-letterboxd-cta-compact secondary">
    {m.text_letterboxd_export_compact()}
    <Link href={exportUrl} target="_blank" rel="noopener noreferrer">
      {m.link_text_letterboxd_export()}
    </Link>
  </p>
{:else}
  <div class="trakt-letterboxd-cta">
    <p class="summary-eyebrow">{m.eyebrow_already_on_letterboxd()}</p>
    <p class="bold trakt-letterboxd-cta-title">
      {m.text_letterboxd_export_title()}
    </p>
    <p class="secondary">{m.text_letterboxd_export_body()}</p>
    <Link href={exportUrl} target="_blank" rel="noopener noreferrer">
      <span class="trakt-letterboxd-cta-link">
        {m.link_text_letterboxd_export()} →
      </span>
    </Link>
  </div>
{/if}

<style>
  .trakt-letterboxd-cta {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--gap-m);

    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--tboxed-positive) 6%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--tboxed-positive) 18%, transparent);
  }

  .trakt-letterboxd-cta-title {
    font-size: var(--font-size-title);
  }

  .trakt-letterboxd-cta-link {
    color: var(--tboxed-positive);
    font-weight: 600;
  }

  .trakt-letterboxd-cta-compact {
    margin: 0;
    text-align: center;
    font-size: var(--font-size-tag);
  }
</style>
