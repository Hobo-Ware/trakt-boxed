<script lang="ts">
  import type { MediaStatus } from "$lib/requests/models/MediaStatus.ts";
  import { toTranslatedStatus } from "$lib/utils/formatting/string/toTranslatedStatus.ts";

  const AIRING: ReadonlyArray<MediaStatus> = [
    "returning series",
    "continuing",
    "in production",
    "upcoming",
    "planned",
    "pilot",
  ];

  const { status }: { status: MediaStatus } = $props();
</script>

<span
  class="boxed-show-status"
  data-state={AIRING.includes(status) ? "airing" : "ended"}
>
  {toTranslatedStatus(status)}
</span>

<style>
  .boxed-show-status {
    --status-color: var(--color-text-secondary);

    box-sizing: border-box;
    height: var(--ni-24);
    padding: 0 var(--ni-10);

    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--status-color) 16%, var(--color-background));
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--status-color) 40%, transparent);
    color: var(--status-color);

    font-size: var(--ni-12);
    font-weight: 500;
    white-space: nowrap;

    &::before {
      content: "";
      width: var(--ni-6);
      height: var(--ni-6);
      border-radius: 50%;
      background: currentColor;
    }

    &[data-state="airing"] {
      --status-color: var(--boxed-color-watched-text);
    }
  }
</style>
