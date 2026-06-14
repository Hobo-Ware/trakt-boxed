<script lang="ts">
  import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
  import ListCard from '../ListCard.svelte';

  type Props = {
    eyebrow: string;
    title?: string;
    rightLabel?: string;
    rightHref?: string;
    lists: ReadonlyArray<MediaListSummary>;
  };

  const { eyebrow, title, rightLabel, rightHref, lists }: Props = $props();
</script>

<section class="lists-row">
  <header class="lists-row__header">
    <div class="lists-row__heading">
      <p class="lists-row__eyebrow">{eyebrow}</p>
      {#if title}<h2 class="lists-row__title">{title}</h2>{/if}
    </div>
    {#if rightLabel && rightHref}
      <a class="lists-row__right" href={rightHref}>{rightLabel}</a>
    {/if}
  </header>

  <ul class="lists-row__grid">
    {#each lists as list (list.id)}
      <li><ListCard {list} /></li>
    {/each}
  </ul>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lists-row {
    padding-top: var(--gap-l);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: var(--gap-m);
      padding-bottom: var(--gap-s);
      margin-bottom: var(--gap-m);
      border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    }

    &__heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__eyebrow {
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
    }

    &__title {
      margin: 0;
      font-family: var(--font-family-serif, "Tiempos Headline", Georgia, serif);
      font-weight: 400;
      font-size: clamp(1.2rem, 2.4vw, 1.8rem);
      color: var(--color-text-primary);
    }

    &__right {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 700;

      &:hover { color: var(--color-background-green, var(--green-500)); }
    }

    &__grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(min(var(--lb-card-min-w), 100%), 1fr)
      );
      gap: var(--gap-m);
    }
  }
</style>
