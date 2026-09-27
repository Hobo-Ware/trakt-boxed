<script lang="ts">
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { onReveal }: { onReveal: () => void } = $props();
</script>

<div class="boxed-episode-reviews-cover" role="status">
  <span class="cover-icon" aria-hidden="true"><LockIcon /></span>
  <span class="cover-text">{m.boxed_show_episode_reviews_hidden()}</span>
  <button type="button" class="cover-reveal" onclick={onReveal}>
    {m.boxed_title_show_anyway()}
  </button>
</div>

<style>
  .boxed-episode-reviews-cover {
    display: flex;
    align-items: center;
    gap: var(--ni-12);
    padding: var(--ni-12) var(--ni-14);

    border-radius: var(--border-radius-m);
    background: var(--boxed-color-accent-wash);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--boxed-color-accent-soft);

    font-size: var(--ni-14);
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .cover-icon {
    display: flex;
    flex-shrink: 0;
    color: var(--boxed-color-accent-text);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .cover-text {
    flex-grow: 1;
    min-width: 0;
  }

  .cover-reveal {
    flex-shrink: 0;
    height: var(--ni-36);
    padding: 0 var(--ni-14);

    border: none;
    border-radius: var(--border-radius-s);
    background: var(--purple-500);
    color: var(--shade-10);
    cursor: pointer;

    font: inherit;
  }
</style>
