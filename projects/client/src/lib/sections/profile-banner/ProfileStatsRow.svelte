<script lang="ts">
  /*
    Letterboxd-style stat row. Five large numerals stacked over tracked
    uppercase labels: films / this year / lists / following / followers.

    Reference: ../../letterboxd-research/notes/profile.md — "five-stat
    headline row ... compact row is doing a lot of work — it's the
    entire identity summary, the filmography spec, AND a status flex".

    trakt-boxed scope: this row only renders for the signed-in user's
    own profile. Other users' stats need a per-user query that doesn't
    exist yet. Followers ditto — current useUser only carries
    "following". We ship the four stats we have and leave a TODO for
    followers + per-user mirroring.

    Each cell deep-links into the corresponding surface so the row
    doubles as navigation, exactly like Letterboxd.
  */
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { slug }: { slug: string } = $props();

  const { history, network } = useUser();
  const { lists } = useAllPersonalLists();

  const films = $derived($history?.movies?.size ?? 0);
  const followingCount = $derived($network?.following?.length ?? 0);
  const listsCount = $derived($lists?.length ?? 0);

  const thisYearCount = $derived.by(() => {
    const movies = $history?.movies;
    if (!movies) return 0;
    const year = new Date().getFullYear();
    let count = 0;
    for (const entry of movies.values()) {
      const watchedAt = (entry as { watchedAt?: string }).watchedAt;
      if (watchedAt && new Date(watchedAt).getFullYear() === year) count++;
    }
    return count;
  });

  const cells = $derived([
    {
      value: films,
      label: m.profile_stat_films(),
      href: UrlBuilder.profile.history(slug),
    },
    {
      value: thisYearCount,
      label: m.profile_stat_this_year(),
      href: UrlBuilder.profile.history(slug),
    },
    {
      value: listsCount,
      label: m.profile_stat_lists(),
      href: UrlBuilder.lists.user(slug),
    },
    {
      value: followingCount,
      label: m.profile_stat_following(),
      href: UrlBuilder.profile.social(slug),
    },
  ]);
</script>

<div class="trakt-profile-stats">
  {#each cells as cell (cell.label)}
    <Link href={cell.href} color="inherit">
      <div class="trakt-profile-stat">
        <span class="trakt-profile-stat-value">{cell.value}</span>
        <span class="trakt-profile-stat-label">{cell.label}</span>
      </div>
    </Link>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gap-s);

    width: 100%;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .trakt-profile-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-2);

    padding: var(--gap-xs) 0;
    border-left: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .trakt-profile-stat-value {
    font-size: var(--ni-22);
    font-weight: 700;
    line-height: 1;
    color: var(--color-foreground);
  }

  .trakt-profile-stat-label {
    font-size: var(--ni-10);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-secondary);
  }

  /*
    First cell drops the divider so the row has hairlines between
    cells rather than around all four.
  */
  .trakt-profile-stats > :global(:first-child .trakt-profile-stat) {
    border-left: none;
  }

  @include for-tablet-sm-and-below {
    .trakt-profile-stat-value {
      font-size: var(--ni-18);
    }
  }
</style>
