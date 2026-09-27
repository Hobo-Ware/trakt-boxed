<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { RecentlyWatchedType } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import DiaryList from "../profile/diary/DiaryList.svelte";

  type TitleActivityProps = {
    title: string | null;
    detail: string | null;
    poster: string | null;
    href: string;
    type: RecentlyWatchedType;
    id: number | null;
  };

  const { title, detail, poster, href, type, id }: TitleActivityProps =
    $props();
</script>

<header class="boxed-title-activity">
  <a class="boxed-title-activity-poster" {href} aria-label={title ?? undefined}>
    {#if poster}
      <CrossOriginImage src={poster} alt={title ?? ""} />
    {/if}
  </a>
  <div class="boxed-title-activity-text">
    <span class="boxed-title-activity-eyebrow">{m.boxed_title_your_activity()}</span>
    <h1>
      {#if title}
        <a {href}>{title}</a>
      {:else}
        <Skeleton width="50%" height="1em" />
      {/if}
    </h1>
    <span class="boxed-title-activity-detail">{detail ?? ""}</span>
  </div>
</header>

<DiaryList slug="me" {type} {id} isMe />

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-title-activity {
    display: flex;
    align-items: center;
    gap: var(--ni-20);
  }

  .boxed-title-activity-poster {
    flex-shrink: 0;
    width: var(--ni-80);
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--color-input-background);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-title-activity-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    h1 {
      min-height: 1.2em;
      margin: 0;
      font-family: var(--boxed-font-title);
      font-size: var(--ni-40);
      font-weight: 600;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      a {
        color: inherit;
        text-decoration: none;
      }

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }
  }

  .boxed-title-activity-eyebrow {
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-title-activity-detail {
    min-height: 1.4em;
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    line-height: 1.4;
    color: var(--color-text-secondary);
  }
</style>
