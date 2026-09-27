<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SoundtrackTrack } from "$lib/requests/models/SoundtrackTrack.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";

  const ROWS = 4;

  type SoundtrackPanelProps = {
    tracks: ReadonlyArray<SoundtrackTrack> | null;
    allHref: string;
  };

  const { tracks, allHref }: SoundtrackPanelProps = $props();

  const isLoading = $derived(tracks === null);
  const rows = $derived(tracks?.slice(0, ROWS) ?? []);
</script>

{#if isLoading || rows.length > 0}
  <SectionHeader title={m.list_title_soundtrack()}>
    {#snippet actions()}
      <span class="boxed-vip-chip">{m.tag_text_vip()}</span>
      {#if !isLoading && (tracks?.length ?? 0) > ROWS}
        <a
          class="boxed-soundtrack-all"
          href={allHref}
          data-sveltekit-noscroll
          data-sveltekit-replacestate
        >
          {m.button_text_view_all()}
        </a>
      {/if}
    {/snippet}
  </SectionHeader>

  <ol class="boxed-soundtrack">
    {#if isLoading}
      {#each { length: ROWS }, index (index)}
        <li class="boxed-soundtrack-row" aria-hidden="true">
          <Skeleton width="var(--ni-30)" height="var(--ni-30)" radius="50%" />
          <Skeleton height="var(--ni-14)" />
        </li>
      {/each}
    {:else}
      {#each rows as track (track.key)}
        <li class="boxed-soundtrack-row">
          <a
            class="boxed-soundtrack-play"
            href={allHref}
            aria-label={m.button_label_view_soundtrack()}
            data-sveltekit-noscroll
            data-sveltekit-replacestate
          >
            <PlayIcon />
          </a>
          <span class="boxed-soundtrack-title">{track.title}</span>
          {#if track.performer}
            <span class="boxed-soundtrack-performer">{track.performer}</span>
          {/if}
        </li>
      {/each}
    {/if}
  </ol>
{/if}

<style>
  .boxed-vip-chip {
    padding: var(--ni-2) var(--ni-6);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--shade-10);

    font-size: var(--ni-10);
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  .boxed-soundtrack-all {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .boxed-soundtrack {
    margin: 0;
    padding: 0;
    list-style: none;

    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .boxed-soundtrack-row {
    height: var(--ni-30);

    display: flex;
    align-items: center;
    gap: var(--ni-10);
    min-width: 0;
  }

  .boxed-soundtrack-play {
    flex-shrink: 0;
    width: var(--ni-30);
    height: var(--ni-30);

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background: var(--color-card-background);
    color: var(--color-text-primary);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    &:hover,
    &:focus-visible {
      background: var(--purple-500);
      color: var(--shade-10);
    }
  }

  .boxed-soundtrack-title {
    flex: 1 1 0;
    min-width: 0;

    font-size: var(--ni-14);
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxed-soundtrack-performer {
    flex-shrink: 1;
    max-width: 40%;

    font-size: var(--ni-12);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
