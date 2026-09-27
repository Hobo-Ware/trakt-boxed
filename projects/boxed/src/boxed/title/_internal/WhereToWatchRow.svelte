<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamOn } from "$lib/requests/models/StreamOn.ts";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences.ts";
  import { toServiceChips } from "./toServiceChips.ts";
  import ServiceChip from "./ServiceChip.svelte";

  const MAX_CHIPS = 2;

  const {
    streamOn,
    isLoading,
    href,
  }: { streamOn: StreamOn | undefined; isLoading: boolean; href: string } =
    $props();

  const { country } = useStreamingPreferences();

  const chips = $derived(toServiceChips(streamOn, MAX_CHIPS));
</script>

<div class="boxed-where-to-watch">
  <div class="boxed-where-to-watch-header">
    <a {href}>{m.button_text_where_to_watch()}</a>
    <span class="boxed-where-to-watch-country">{$country}</span>
  </div>
  <div class="boxed-where-to-watch-services">
    {#if isLoading}
      {#each { length: MAX_CHIPS }, index (index)}
        <Skeleton
          height="var(--ni-28)"
          radius="var(--border-radius-xxl)"
        />
      {/each}
    {:else if chips.length === 0}
      <span class="boxed-where-to-watch-empty">{m.text_unavailable()}</span>
    {:else}
      {#each chips as chip (chip.service.key)}
        <ServiceChip service={chip.service} isPreferred={chip.isPreferred} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .boxed-where-to-watch {
    box-sizing: border-box;
    height: var(--ni-80);
    padding: var(--ni-12) var(--ni-16) var(--ni-14);

    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    border-top: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-where-to-watch-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: var(--ni-14);

    a {
      color: var(--color-text-primary);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        color: var(--color-link-active);
      }
    }
  }

  .boxed-where-to-watch-country {
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-where-to-watch-services {
    height: var(--ni-28);
    min-width: 0;

    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-6);
  }

  .boxed-where-to-watch-empty {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;

    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }
</style>
