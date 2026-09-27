<script lang="ts">
  import Stars from "$boxed/components/Stars.svelte";
  import { toTimeAgo } from "$boxed/home/_internal/toTimeAgo.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ActivityEvent } from "./ActivityEvent.ts";

  const { event, now }: { event: ActivityEvent; now: Date } = $props();
</script>

<li class="boxed-activity-row" data-hj-suppress>
  <a class="activity-avatar" href={event.actor.href} aria-label={event.actor.name}>
    <CrossOriginImage src={event.actor.avatar} alt="" loading="lazy" />
  </a>

  <div class="activity-body">
    <p class="activity-line">
      <a class="activity-actor" href={event.actor.href}>{event.actor.name}</a>
      {#if event.others > 0}
        <span>{m.boxed_activity_and_more({ count: String(event.others) })}</span>
      {/if}
      <span>{m.boxed_activity_watched()}</span>
      <a class="activity-title" href={event.href}>{event.title}</a>
      {#if event.code}<span class="activity-code">{event.code}</span>{/if}
      {#if event.rating}<Stars rating={event.rating} />{/if}
    </p>
    <time class="activity-time" datetime={event.at.toISOString()}>
      {toTimeAgo(now, event.at, languageTag())}
    </time>
  </div>

  <a class="activity-poster" href={event.href} aria-label={event.title}>
    <CrossOriginImage src={event.poster} alt="" loading="lazy" />
  </a>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-activity-row {
    display: flex;
    align-items: flex-start;
    gap: var(--ni-14);
    padding-block: var(--ni-14);
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  .activity-avatar {
    flex-shrink: 0;

    :global(img) {
      display: block;
      width: var(--ni-40);
      height: var(--ni-40);
      border-radius: 50%;
      object-fit: cover;
      background: var(--color-input-background);
    }
  }

  .activity-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    padding-top: var(--ni-6);
  }

  .activity-line {
    margin: 0;
    font-size: var(--ni-14);
    line-height: 1.5;
    color: var(--color-text-secondary);

    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    a {
      color: var(--color-text-primary);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
    }

    :global(.boxed-stars) {
      margin-inline-start: var(--ni-4);
    }
  }

  .activity-actor {
    font-weight: 500;
  }

  .activity-title {
    font-family: var(--boxed-font-title);
    font-size: var(--ni-16);
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .activity-code {
    white-space: nowrap;
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--purple-200);
  }

  .activity-time {
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }

  .activity-poster {
    flex-shrink: 0;
    width: var(--ni-44);
    height: var(--ni-66);
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
