<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import SentimentAspects from "./SentimentAspects.svelte";

  const { sentiment }: { sentiment: SentimentAnalysis } = $props();
</script>

<div class="trakt-sentiment-content">
  <p class="sentiment-analysis">{sentiment.analysis}</p>

  <section class="sentiment-section">
    <h3 class="sentiment-label">{m.header_sentiment_highlight()}</h3>
    <blockquote class="sentiment-highlight">{sentiment.highlight}</blockquote>
  </section>

  <section class="sentiment-section">
    <h3 class="sentiment-label">{m.header_sentiment_aspects()}</h3>
    <SentimentAspects
      pros={sentiment.aspect.pros}
      cons={sentiment.aspect.cons}
    />
  </section>
</div>

<style>
  .trakt-sentiment-content {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .sentiment-analysis {
    margin: 0;
    font-size: var(--ni-14);
    line-height: 1.55;
    color: var(--color-text-primary);
  }

  .sentiment-section {
    display: flex;
    flex-direction: column;
  }

  .sentiment-label {
    margin: 0 0 var(--ni-12);
    padding-bottom: var(--ni-8);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .sentiment-highlight {
    margin: 0;
    padding-block: var(--ni-4);
    padding-inline: var(--ni-16) 0;
    border-inline-start: var(--border-thickness-xs) solid
      var(--boxed-color-accent-fill);

    font-family: var(--boxed-font-title);
    font-size: var(--ni-18);
    font-style: italic;
    line-height: 1.45;
    color: var(--color-text-primary);
  }
</style>
