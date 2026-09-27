<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  type SeasonPosterProps = {
    src: string;
    title: string;
    href: string;
    progress: number;
    isComplete: boolean;
  };

  const { src, title, href, progress, isComplete }: SeasonPosterProps =
    $props();
</script>

<a class="boxed-season-poster" class:is-complete={isComplete} {href}>
  <CrossOriginImage
    {src}
    alt={m.image_alt_media_poster({ title })}
    loading="eager"
  />
  {#if progress > 0}
    <span
      class="boxed-season-poster-progress"
      style:--progress={`${Math.round(progress * 100)}%`}
      aria-hidden="true"
    ></span>
  {/if}
</a>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-season-poster {
    position: relative;
    display: block;
    width: var(--ni-232);
    aspect-ratio: 2 / 3;
    margin-inline: auto;

    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow:
      inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 8%, transparent),
      0 var(--ni-30) var(--ni-60) calc(-1 * var(--ni-20))
        color-mix(in srgb, var(--ambient-glow, var(--shade-950)) 55%, transparent);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.is-complete {
      outline: var(--border-thickness-xs) solid var(--boxed-color-watched);
    }

    @include for-tablet-lg-and-below {
      width: var(--ni-104);
    }
  }

  .boxed-season-poster-progress {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: var(--ni-4);
    background: color-mix(in srgb, var(--shade-950) 60%, transparent);

    &::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--progress);
      background: var(--boxed-color-watched);
    }
  }
</style>
