<script lang="ts">
  import { useStreamingServiceLogo } from "$lib/components/media/streaming-service/useStreamingServiceLogo.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions.ts";

  const {
    service,
    isPreferred,
  }: { service: StreamingServiceOption; isPreferred: boolean } = $props();

  const logo = $derived(useStreamingServiceLogo({ source: service.source }));

  const kind = $derived.by(() => {
    switch (service.type) {
      case "streaming":
        return m.text_stream();
      case "free":
        return m.text_free();
      case "on-demand":
        return service.prices.rent != null ? m.text_rent() : m.text_buy();
    }
  });
</script>

<a
  class="boxed-service-chip"
  class:is-preferred={isPreferred}
  href={service.link}
  target="_blank"
  rel="noopener noreferrer"
>
  <span class="boxed-service-name">{$logo?.name ?? service.source}</span>
  <span class="boxed-service-kind">{kind}</span>
</a>

<style>
  .boxed-service-chip {
    height: var(--ni-28);
    padding: 0 var(--ni-10);
    box-sizing: border-box;
    min-width: 0;

    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    border-radius: var(--border-radius-xxl);
    background: var(--color-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    font-size: var(--ni-12);
    font-weight: 500;
    text-decoration: none;
    color: var(--color-text-primary);
    white-space: nowrap;

    &.is-preferred {
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--boxed-color-watched);
    }

    &:hover,
    &:focus-visible {
      color: var(--color-link-active);
    }
  }

  .boxed-service-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxed-service-kind {
    font-size: var(--ni-10);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }
</style>
