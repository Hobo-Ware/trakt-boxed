<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Milestone } from "./_internal/toMilestones.ts";

  const MILESTONE_COUNT = 3;

  const { milestones }: { milestones: ReadonlyArray<Milestone> | null } =
    $props();

  const hrefFor = (entry: MediaEntry) =>
    entry.type === "movie"
      ? UrlBuilder.movie(entry.slug)
      : UrlBuilder.show(entry.slug);
</script>

<ul class="boxed-milestones">
  {#if milestones === null}
    {#each { length: MILESTONE_COUNT }, index (index)}
      <li aria-hidden="true">
        <span class="milestone-poster"></span>
        <span class="milestone-text">
          <Skeleton width="var(--ni-80)" height="var(--ni-11)" />
          <Skeleton width="var(--ni-120)" height="var(--ni-20)" />
          <Skeleton width="var(--ni-72)" height="var(--ni-12)" />
        </span>
      </li>
    {/each}
  {:else if milestones.length === 0}
    <li class="milestone-empty">{m.boxed_profile_empty()}</li>
  {:else}
    {#each milestones as milestone (milestone.key)}
      <li>
        <a
          class="milestone-poster"
          href={hrefFor(milestone.entry)}
          aria-label={milestone.entry.title}
        >
          <CrossOriginImage
            src={milestone.entry.poster.url.thumb}
            alt=""
            loading="lazy"
          />
        </a>
        <span class="milestone-text">
          <span class="milestone-label">{milestone.label}</span>
          <a class="milestone-title" href={hrefFor(milestone.entry)}>
            {milestone.entry.title}
          </a>
          <span class="milestone-detail">{milestone.detail}</span>
        </span>
      </li>
    {/each}
  {/if}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-milestones {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-24);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-12);
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--ni-16);
      padding: var(--ni-16);
      border-radius: var(--border-radius-m);
      background: var(--color-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    }
  }

  .milestone-poster {
    flex-shrink: 0;
    width: var(--ni-72);
    aspect-ratio: 2 / 3;
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

  .milestone-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .milestone-label {
    font-size: var(--ni-11);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .milestone-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--color-text-primary);
    text-decoration: none;
  }

  .milestone-detail {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--boxed-color-accent-text);
  }

  .boxed-milestones li.milestone-empty {
    grid-column: 1 / -1;
    justify-content: center;
    min-height: calc(1.5 * var(--ni-72));
    color: var(--color-text-secondary);
  }
</style>
