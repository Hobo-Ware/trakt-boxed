<script lang="ts">
  /*
    Letterboxd's /members/popular/ surfaced popular community
    reviewers. Trakt's API does not expose a global popular-members
    feed, so trakt-boxed ships the closest we have for an
    authenticated user: the people they follow, presented in the
    Letterboxd member-directory rhythm.

    Reference: research/notes/members-popular.md. This is a fallback
    directory; a real popular-members query is on the follow-up list.
  */
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import MemberRow from "$lib/sections/members/MemberRow.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { network } = useUser();
  const members = $derived($network?.following ?? []);
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.text_members()}
>
  <NavbarStateSetter
    header={{ title: m.page_title_popular_members() }}
  />

  <div class="lb-members-page">
    <header class="lb-members-header">
      <p class="lb-members-eyebrow">{m.eyebrow_popular_members()}</p>
      <h1 class="lb-members-title">{m.text_members()}</h1>
      <p class="lb-members-subtitle">{m.text_members_directory_subtitle()}</p>
    </header>

    {#if members.length === 0}
      <p class="lb-members-empty">{m.text_members_empty()}</p>
    {:else}
      <ul class="lb-members-list">
        {#each members as member (member.username)}
          <li>
            <MemberRow {member} subtitle={m.eyebrow_member_in_network()} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</TraktPage>

<style>
  .lb-members-page {
    width: 100%;
    max-width: var(--ni-720);
    margin-inline: auto;
    padding: var(--ni-26) 0;
  }

  .lb-members-header {
    padding: 0 var(--ni-16);
    margin-bottom: var(--ni-22);
  }

  .lb-members-eyebrow {
    margin: 0 0 var(--ni-8);
    font-size: var(--ni-11);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    font-weight: 700;
  }

  .lb-members-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-weight: 700;
    font-size: var(--ni-30);
    color: var(--color-foreground);
    letter-spacing: -0.01em;
  }

  .lb-members-subtitle {
    margin: var(--ni-6) 0 0;
    font-size: var(--ni-13);
    color: var(--color-text-secondary);
  }

  .lb-members-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .lb-members-empty {
    padding: var(--ni-32) var(--ni-16);
    text-align: center;
    color: var(--color-text-secondary);
  }
</style>
