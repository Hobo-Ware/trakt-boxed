<script lang="ts">
  import InView from "$boxed/components/InView.svelte";
  import FollowButton from "$boxed/profile/FollowButton.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { LeaderboardEntry } from "$lib/requests/models/LeaderboardEntry.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { toLeaderboardStat } from "./toLeaderboardStat.ts";

  const { entry }: { entry: LeaderboardEntry } = $props();

  const slug = $derived(entry.user.slug ?? entry.user.username);
  const stat = $derived(toLeaderboardStat({ entry, locale: languageTag() }));
  const medal = $derived(
    entry.rank != null && entry.rank <= 3 ? entry.rank : undefined,
  );
</script>

<li
  class="boxed-leaderboard-row"
  class:is-viewer={entry.isViewer}
  data-hj-suppress
>
  <span class="row-rank" data-medal={medal}>
    {entry.rank == null ? "-" : `#${entry.rank}`}
  </span>

  <a class="row-identity" href={UrlBuilder.profile.user(slug)}>
    <CrossOriginImage src={entry.user.avatar.url} alt="" loading="lazy" />
    <span class="row-names">
      <span class="row-name-line">
        <span class="row-name">{toDisplayableName(entry.user)}</span>
        {#if entry.user.isVip}
          <span class="row-vip">{m.tag_text_vip()}</span>
        {/if}
        {#if entry.isViewer}
          <span class="row-you">{m.text_leaderboard_you()}</span>
        {/if}
      </span>
      <span class="row-stat">{stat ?? `@${entry.user.username}`}</span>
    </span>
  </a>

  {#if !entry.isViewer}
    <span class="row-action">
      <InView>
        <FollowButton profile={entry.user} {slug} />
        {#snippet placeholder()}
          <span class="row-action-placeholder"></span>
        {/snippet}
      </InView>
    </span>
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-leaderboard-row {
    height: var(--boxed-leaderboard-row-height);
    box-sizing: border-box;
    padding-inline: var(--ni-12);

    display: grid;
    grid-template-columns: var(--ni-40) minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--gap-m);

    border-bottom: var(--border-thickness-xxs) solid var(--color-border);

    &.is-viewer {
      border-radius: var(--border-radius-m);
      background: var(--boxed-color-accent-soft);
    }

    @include for-mobile {
      padding-inline: var(--ni-4);
      gap: var(--gap-s);
    }
  }

  .row-rank {
    font-size: var(--ni-14);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-align: center;
    color: var(--color-text-secondary);

    &[data-medal="1"] {
      color: var(--color-medal-gold);
    }

    &[data-medal="2"] {
      color: var(--color-medal-silver);
    }

    &[data-medal="3"] {
      color: var(--color-medal-bronze);
    }
  }

  .row-identity {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
    color: inherit;
    text-decoration: none;

    :global(img) {
      flex-shrink: 0;
      width: var(--ni-44);
      height: var(--ni-44);
      border-radius: 50%;
      object-fit: cover;
      background: var(--color-input-background);
    }

    &:hover .row-name,
    &:focus-visible .row-name {
      text-decoration: underline;
    }
  }

  .row-names {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .row-name-line {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .row-name,
  .row-stat {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row-name {
    font-size: var(--ni-16);
    font-weight: 500;
  }

  .row-vip,
  .row-you {
    flex-shrink: 0;
    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-xs);
    font-size: var(--ni-10);
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .row-vip {
    background: var(--purple-500);
    color: var(--shade-10);
  }

  .row-you {
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-400);
    color: var(--color-text-primary);
  }

  .row-stat {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .row-action {
    min-width: var(--ni-104);
  }

  .row-action-placeholder {
    display: block;
    width: var(--ni-104);
    height: var(--ni-40);
  }
</style>
