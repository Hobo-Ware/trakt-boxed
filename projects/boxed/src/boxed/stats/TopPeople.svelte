<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { YirPeopleType } from "$lib/requests/models/YirPerson.ts";
  import type { YirYear } from "$lib/requests/models/YirYear.ts";
  import { useYirPeople } from "$lib/sections/yir/useYirPeople.ts";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { DEFAULT_AVATAR } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const PEOPLE_SHOWN = 5;

  const {
    slug,
    year,
    type,
  }: { slug: string; year: YirYear; type: YirPeopleType } = $props();

  const { people, isLoading } = $derived(useYirPeople({ slug, year, type }));

  const shown = $derived(
    $isLoading && !$people ? null : ($people ?? []).slice(0, PEOPLE_SHOWN),
  );

  const countLabel = (count: { movies: number; shows: number }) =>
    [
      count.movies > 0 ? `${count.movies} ${m.yir_unit_movies()}` : "",
      count.shows > 0 ? `${count.shows} ${m.yir_unit_shows()}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
</script>

<ul class="boxed-top-people">
  {#if shown === null}
    {#each { length: PEOPLE_SHOWN }, index (index)}
      <li aria-hidden="true">
        <Skeleton width="var(--ni-80)" height="var(--ni-80)" radius="50%" />
        <Skeleton width="var(--ni-72)" height="var(--ni-14)" />
        <Skeleton width="var(--ni-48)" height="var(--ni-12)" />
      </li>
    {/each}
  {:else if shown.length === 0}
    <li class="people-empty">{m.boxed_profile_empty()}</li>
  {:else}
    {#each shown as person (person.id)}
      <li>
        <a href={UrlBuilder.people(person.slug)}>
          <CrossOriginImage
            src={PLACEHOLDERS.includes(person.headshot.url.thumb)
              ? DEFAULT_AVATAR
              : person.headshot.url.thumb}
            alt=""
            loading="lazy"
          />
          <span class="person-name">{person.name}</span>
          <span class="person-count">{countLabel(person.count)}</span>
        </a>
      </li>
    {/each}
  {/if}
</ul>

<style>
  .boxed-top-people {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--ni-12);
    min-height: var(--ni-160);

    li,
    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-6);
      min-width: 0;
      text-align: center;
      color: inherit;
      text-decoration: none;
    }

    :global(img) {
      width: var(--ni-80);
      height: var(--ni-80);
      border-radius: 50%;
      object-fit: cover;
      background: var(--color-input-background);
    }
  }

  .person-name {
    width: 100%;
    font-size: var(--ni-14);
    font-weight: 500;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .person-count {
    width: 100%;
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    color: var(--boxed-color-accent-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .boxed-top-people li.people-empty {
    grid-column: 1 / -1;
    justify-content: center;
    color: var(--color-text-secondary);
  }
</style>
