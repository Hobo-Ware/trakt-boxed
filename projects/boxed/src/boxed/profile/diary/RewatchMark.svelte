<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<span class="boxed-rewatch-mark" role="img" aria-label={m.boxed_profile_rewatched()}>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 12a8 8 0 0 1 14-5.3L20 9" />
    <path d="M20 4v5h-5" />
    <path d="M20 12a8 8 0 0 1-14 5.3L4 15" />
    <path d="M4 20v-5h5" />
  </svg>
</span>

<style>
  .boxed-rewatch-mark {
    display: inline-flex;
    color: var(--color-text-secondary);

    svg {
      width: var(--ni-16);
      height: var(--ni-16);
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
</style>
