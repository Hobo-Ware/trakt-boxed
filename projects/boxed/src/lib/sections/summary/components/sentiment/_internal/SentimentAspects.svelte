<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";

  type SentimentProps = {
    pros: string[];
    cons: string[];
  };

  const { pros, cons }: SentimentProps = $props();

  const isPartial = $derived(pros.length === 0 || cons.length === 0);

  const mappedSentiments = $derived([
    {
      aspects: pros,
      sentiment: "good" as const,
      sentimentColor: "var(--boxed-color-watched)",
    },
    {
      aspects: cons,
      sentiment: "bad" as const,
      sentimentColor: "var(--boxed-color-liked)",
    },
  ]);
</script>

<div class="trakt-sentiment-body">
  {#each mappedSentiments as { sentiment, aspects, sentimentColor }, index (sentiment)}
    {#if aspects.length > 0}
      <div
        class="trakt-sentiment-container"
        style="--sentiment-color: {sentimentColor}"
        data-index={!isPartial ? index : undefined}
      >
        <div class="trakt-sentiment-aspects">
          <SentimentIcon {sentiment} />
          <ul>
            {#each aspects as aspect}
              <li><p class="capitalize">{aspect}</p></li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .trakt-sentiment-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    height: 100%;
    width: 100%;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding: 0;
    padding-inline-start: var(--ni-12);

    font-size: var(--ni-14);
    line-height: 1.55;

    color: var(--sentiment-color);
    p.capitalize {
      margin: 0;
      color: var(--color-text-primary);
    }
  }

  .trakt-sentiment-container {
    flex: 1 1 0;

    display: flex;
    gap: var(--gap-s);
    align-items: center;
  }

  .trakt-sentiment-aspects {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);

    color: var(--color-text-primary);

    :global(svg) {
      flex-shrink: 0;
      color: var(--sentiment-color);
    }
  }
</style>
