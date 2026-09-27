<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { CastMember } from "$lib/requests/models/MediaCrew.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SectionHeader from "../../components/SectionHeader.svelte";

  const PREVIEW = 10;

  const { cast, allHref }: { cast: ReadonlyArray<CastMember>; allHref: string } =
    $props();

  const preview = $derived(cast.slice(0, PREVIEW));
</script>

<section class="boxed-guest-cast">
  <SectionHeader
    title={m.drawer_meta_info_cast()}
    href={cast.length > PREVIEW ? allHref : undefined}
  />
  <ul class="boxed-guest-cast-list">
    {#each preview as member (member.key)}
      <li>
        <a class="boxed-guest" href={UrlBuilder.people(member.key)}>
          <CrossOriginImage
            src={member.headshot.url.thumb}
            alt={m.image_alt_person_headshot({ person: member.name })}
          />
          <span class="boxed-guest-name">{member.name}</span>
          <span class="boxed-guest-role">{member.characterName}</span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style>
  .boxed-guest-cast-list {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: var(--ni-104);
    gap: var(--ni-12);

    overflow-x: auto;
    scrollbar-width: none;
  }

  .boxed-guest {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-4);

    text-align: center;
    text-decoration: none;
    color: var(--color-text-primary);

    :global(img) {
      width: var(--ni-64);
      height: var(--ni-64);
      margin-bottom: var(--ni-4);

      border-radius: 50%;
      object-fit: cover;
      background: var(--color-card-background);
    }

    &:hover .boxed-guest-name,
    &:focus-visible .boxed-guest-name {
      color: var(--color-link-active);
    }
  }

  .boxed-guest-name,
  .boxed-guest-role {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxed-guest-name {
    font-size: var(--ni-12);
    font-weight: 500;
  }

  .boxed-guest-role {
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }
</style>
