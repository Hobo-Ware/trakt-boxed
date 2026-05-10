<script lang="ts">
  /*
    Members directory. Trakt has no global popular-members feed,
    so on this rebuild we frame the page editorially and surface
    the authed user's network as the closest available data. The
    directory rhythm matches the Letterboxd /members surface.
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
  title={m.page_title_popular_members()}
>
  <NavbarStateSetter />

  <div class="lb-mem-page">
    <header class="lb-mem-hero">
      <p class="lb-mem-eyebrow">{m.eyebrow_popular_members()}</p>
      <h1 class="lb-mem-title">{m.text_members()}</h1>
      <p class="lb-mem-lede">{m.text_members_directory_subtitle()}</p>
    </header>

    <div class="lb-mem-frame">
      {#if members.length === 0}
        <p class="lb-mem-empty">{m.text_members_empty()}</p>
      {:else}
        <ul class="lb-mem-list">
          {#each members as member (member.username)}
            <li>
              <MemberRow {member} subtitle={m.eyebrow_member_in_network()} />
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</TraktPage>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-mem-page {
    width: 100%;
    max-width: var(--ni-960);
    margin-inline: auto;
    padding: var(--ni-22) var(--ni-16) var(--ni-44);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
    }
  }

  .lb-mem-hero {
    padding: var(--ni-22) 0 var(--ni-32);
  }

  .lb-mem-eyebrow {
    margin: 0 0 var(--ni-10) 0;
    font-size: var(--ni-11);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--tboxed-positive);
  }

  .lb-mem-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--color-foreground);
    font-size: var(--ni-44);

    @include for-tablet-sm {
      font-size: var(--ni-60);
    }
  }

  .lb-mem-lede {
    margin: var(--ni-12) 0 0 0;
    font-size: var(--ni-15);
    line-height: 1.5;
    color: var(--color-text-secondary);
    max-width: var(--ni-560);
  }

  .lb-mem-frame {
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    padding-top: var(--ni-22);
  }

  .lb-mem-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .lb-mem-empty {
    margin: var(--ni-32) 0;
    color: var(--color-text-secondary);
    font-size: var(--ni-14);
    text-align: center;
  }
</style>
