<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";
  import type { ImportCounts } from "../../import/ImportTypes.ts";

  type ImportSummaryProps = {
    counts: ImportCounts;
    totalItems: number;
    onstart: () => void;
    onreset: () => void;
  };

  const { counts, totalItems, onstart, onreset }: ImportSummaryProps = $props();
</script>

<div class="import-summary" transition:slide={{ duration: 150, axis: "y" }}>
  <div class="import-summary-counts">
    {#if counts.history > 0}
      <p class="secondary">
        {m.import_summary_history({ count: counts.history })}
      </p>
    {/if}
    {#if counts.watchlist > 0}
      <p class="secondary">
        {m.import_summary_watchlist({ count: counts.watchlist })}
      </p>
    {/if}
    {#if counts.ratings > 0}
      <p class="secondary">
        {m.import_summary_ratings({ count: counts.ratings })}
      </p>
    {/if}
  </div>

  <div class="import-summary-actions">
    <Button
      label={m.button_label_start_import()}
      disabled={totalItems === 0}
      onclick={onstart}
      color="purple"
      size="small"
    >
      {m.button_text_start_import()}
    </Button>
    <Button
      label={m.button_label_cancel()}
      onclick={onreset}
      color="default"
      size="small"
    >
      {m.button_text_cancel()}
    </Button>
  </div>
</div>

<style>
  .import-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .import-summary-counts {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .import-summary-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
