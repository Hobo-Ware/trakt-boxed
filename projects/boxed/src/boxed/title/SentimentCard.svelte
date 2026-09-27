<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const MAX_ASPECTS = 3;

  const {
    sentiment,
    analysisHref,
  }: { sentiment: SentimentAnalysis; analysisHref: string } = $props();

  const groups = $derived([
    {
      kind: "pros",
      label: m.boxed_title_pros(),
      items: sentiment.aspect.pros.slice(0, MAX_ASPECTS),
    },
    {
      kind: "cons",
      label: m.boxed_title_cons(),
      items: sentiment.aspect.cons.slice(0, MAX_ASPECTS),
    },
  ]);
</script>

<section class="boxed-sentiment">
  <header class="boxed-sentiment-header">
    <h2>{m.boxed_title_what_people_think()}</h2>
    <span class="boxed-vip-chip">{m.tag_text_vip()}</span>
  </header>

  <div class="boxed-sentiment-groups">
    {#each groups as group (group.kind)}
      <div class="boxed-sentiment-group" data-kind={group.kind}>
        <span class="boxed-sentiment-label">{group.label}</span>
        <ul>
          {#each group.items as item, index (index)}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <footer class="boxed-sentiment-footer">
    <RenderFor audience="vip">
      <a href={analysisHref} data-sveltekit-noscroll data-sveltekit-replacestate>
        {m.button_label_view_sentiment_analysis()}
      </a>
    </RenderFor>
    <RenderFor audience="free">
      <a href={UrlBuilder.vip()}>{m.text_vip_upsell_sentiment()}</a>
    </RenderFor>
  </footer>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-sentiment {
    padding: var(--ni-22) var(--ni-24);

    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--color-foreground) 6%, transparent);

    @include for-tablet-lg-and-below {
      padding: var(--ni-16);
      gap: var(--ni-12);
    }
  }

  .boxed-sentiment-header {
    display: flex;
    align-items: center;
    gap: var(--ni-10);

    h2 {
      margin: 0;

      font-family: var(--boxed-font-title);
      font-weight: 600;
      font-size: var(--ni-24);
      color: var(--color-text-primary);

      @include for-tablet-lg-and-below {
        font-size: var(--ni-20);
      }
    }
  }

  .boxed-vip-chip {
    padding: var(--ni-2) var(--ni-6);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--shade-10);

    font-size: var(--ni-10);
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  .boxed-sentiment-groups {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-32);

    @include for-tablet-lg-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-12);
    }
  }

  .boxed-sentiment-group {
    --aspect-color: var(--boxed-color-watched-text);

    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    &[data-kind="cons"] {
      --aspect-color: var(--boxed-color-liked-text);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      display: flex;
      flex-direction: column;
      gap: var(--ni-10);
    }

    li {
      position: relative;
      padding-inline-start: var(--ni-24);

      font-size: var(--ni-14);
      line-height: 1.5;
      color: var(--color-text-primary);

      &::before {
        content: "";
        position: absolute;
        inset-inline-start: 0;
        top: 0.55em;
        width: var(--ni-12);
        height: var(--ni-2);
        border-radius: var(--border-radius-xs);
        background: var(--aspect-color);
      }
    }
  }

  .boxed-sentiment-label {
    font-size: var(--ni-12);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--aspect-color);
  }

  .boxed-sentiment-footer {
    min-height: var(--ni-20);

    font-size: var(--ni-12);

    a {
      color: var(--color-link-active);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
    }
  }
</style>
