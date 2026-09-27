<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary.ts";
  import { getYearsDifference } from "$lib/utils/date/getYearsDifference.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition.ts";
  import { toPersonLinks } from "./_internal/toPersonLinks.ts";

  const { person }: { person: PersonSummary | null } = $props();

  let isBioExpanded = $state(false);

  const links = $derived(person ? toPersonLinks(person) : []);
  const toDay = (date: Date) =>
    toHumanDay({ date, locale: getLocale(), format: "short" });
</script>

<header class="boxed-person-header">
  <div class="boxed-person-headshot">
    {#if person}
      <CrossOriginImage src={person.headshot.url.medium} alt={person.name} />
    {/if}
  </div>

  <div class="boxed-person-info">
    <span class="boxed-person-eyebrow">
      {#if person?.knownFor}
        {m.boxed_person_known_for({
          position: toTranslatedPosition(person.knownFor),
        })}
      {/if}
    </span>

    {#if person}
      <h1 title={person.name}>{person.name}</h1>
    {:else}
      <h1><Skeleton width="60%" height="1em" /></h1>
    {/if}

    <div class="boxed-person-details">
      {#if person?.birthday}
        <span>
          {m.header_birthday()}
          <time class="boxed-person-date">{toDay(person.birthday)}</time>
          {#if !person.deathDate}
            ({getYearsDifference(person.birthday, new Date())})
          {/if}
        </span>
      {/if}
      {#if person?.deathDate}
        <span>
          {m.header_date_of_death()}
          <time class="boxed-person-date">{toDay(person.deathDate)}</time>
          {#if person.birthday}
            ({getYearsDifference(person.birthday, person.deathDate)})
          {/if}
        </span>
      {/if}
    </div>

    {#if person}
      <div class="boxed-person-bio-slot">
        <p class="boxed-person-bio" class:is-expanded={isBioExpanded}>
          {person.biography}
        </p>
        {#if person.biography && !isBioExpanded}
          <button
            type="button"
            class="boxed-person-more"
            onclick={() => (isBioExpanded = true)}
          >
            {m.button_label_read_more()}
          </button>
        {/if}
      </div>
    {:else}
      <div class="boxed-person-bio-slot" aria-hidden="true">
        <Skeleton width="100%" height="1em" />
        <Skeleton width="90%" height="1em" />
      </div>
    {/if}

    <div class="boxed-person-links">
      {#each links as link (link.url)}
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      {/each}
    </div>
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-person-header {
    --headshot-size: var(--ni-180);

    display: flex;
    align-items: center;
    gap: var(--ni-36);

    @include for-mobile {
      --headshot-size: var(--ni-96);

      align-items: flex-start;
      gap: var(--ni-16);
    }
  }

  .boxed-person-headshot {
    flex-shrink: 0;
    width: var(--headshot-size);
    height: var(--headshot-size);
    border-radius: 50%;
    overflow: hidden;
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .boxed-person-info {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
  }

  .boxed-person-eyebrow {
    min-height: 1.2em;
    font-size: var(--ni-12);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  h1 {
    min-height: 1em;
    margin: 0;
    font-family: var(--boxed-font-title);
    font-size: var(--ni-56);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .boxed-person-details {
    min-height: var(--ni-20);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: var(--ni-18);
    font-size: var(--ni-14);
    line-height: var(--ni-20);
    color: var(--color-text-secondary);

    span {
      font-size: inherit;
    }
  }

  .boxed-person-date {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    text-transform: uppercase;
    color: var(--color-text-primary);
  }

  .boxed-person-bio-slot {
    --bio-line: 1.6em;

    max-width: 72ch;
    min-height: calc(3 * var(--bio-line));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    font-size: var(--ni-16);
  }

  .boxed-person-bio {
    align-self: stretch;
    margin: 0;
    height: calc(2 * var(--bio-line));
    font-size: inherit;
    line-height: var(--bio-line);
    color: var(--color-text-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: pre-line;

    &.is-expanded {
      height: auto;
      display: block;
    }
  }

  .boxed-person-more {
    height: var(--bio-line);
    padding: 0;
    border: none;
    background: none;
    color: var(--color-link-active);
    font: inherit;
    font-size: var(--ni-14);
    cursor: pointer;
  }

  .boxed-person-links {
    min-height: var(--ni-28);
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-8);

    a {
      height: var(--ni-28);
      padding-inline: var(--ni-12);
      display: inline-flex;
      align-items: center;
      border-radius: var(--border-radius-xxl);
      background: var(--color-input-background);
      color: var(--color-text-primary);
      font-size: var(--ni-14);
      text-decoration: none;

      &:hover,
      &:focus-visible {
        background: var(--color-card-background);
      }
    }

    @include for-mobile {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }
  }
</style>
