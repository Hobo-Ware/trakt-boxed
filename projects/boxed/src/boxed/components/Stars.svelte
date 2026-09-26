<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { toStarGlyphs } from "./_internal/toStarGlyphs.ts";

  const {
    rating,
    size = "small",
  }: { rating: number; size?: "small" | "normal" } = $props();
</script>

<span
  class="boxed-stars"
  data-size={size}
  role="img"
  aria-label={m.boxed_label_rated_stars({ stars: rating / 2 })}
>
  {toStarGlyphs(rating)}
</span>

<style>
  .boxed-stars {
    color: var(--boxed-color-star);
    letter-spacing: 0.05em;
    line-height: 1;
    white-space: nowrap;

    font-size: var(--ni-12);

    &[data-size="normal"] {
      font-size: var(--ni-18);
    }
  }
</style>
