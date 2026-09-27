<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { userWatchingQuery } from "$lib/requests/queries/users/userWatchingQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const query = useQuery(userWatchingQuery({ slug: "me" }));
  const watching = $derived($query.data);

  const title = $derived(
    watching?.type === "episode" ? watching.show.title : watching?.media.title,
  );
  const href = $derived.by(() => {
    if (!watching) return "";
    return watching.type === "episode"
      ? UrlBuilder.show(watching.show.slug)
      : UrlBuilder.movie(watching.media.slug);
  });
</script>

{#if watching && title}
  <a
    class="boxed-watching-pill"
    {href}
    aria-label={m.boxed_header_watching_label({ title })}
  >
    <span class="pill-dot" aria-hidden="true"></span>
    <span class="pill-title">{title}</span>
  </a>
{/if}

<style>
  .boxed-watching-pill {
    max-width: 100%;
    height: var(--ni-28);
    box-sizing: border-box;
    padding-inline: var(--ni-10) var(--ni-12);

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--boxed-color-watched) 14%, transparent);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      color-mix(in srgb, var(--boxed-color-watched) 45%, transparent);
    color: var(--color-text-primary);
    font-size: var(--ni-12);
    font-weight: 600;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      background: color-mix(
        in srgb,
        var(--boxed-color-watched) 24%,
        transparent
      );
    }
  }

  .pill-dot {
    flex-shrink: 0;
    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: 50%;
    background: var(--boxed-color-watched);
    animation: boxed-header-live-pulse 1.6s ease-in-out infinite;
  }

  .pill-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @container (max-width: 5rem) {
    .boxed-watching-pill {
      flex-shrink: 0;
      width: var(--ni-28);
      padding: 0;
      justify-content: center;
    }

    .pill-title {
      display: none;
    }
  }

  @keyframes boxed-header-live-pulse {
    50% {
      opacity: 0.35;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pill-dot {
      animation: none;
    }
  }
</style>
