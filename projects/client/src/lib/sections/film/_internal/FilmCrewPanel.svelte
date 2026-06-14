<script lang="ts">
  import type { CrewMember } from '$lib/requests/models/MediaCrew.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
  import * as m from '$lib/features/i18n/messages.ts';

  type Props = {
    directors: CrewMember[];
    writers: CrewMember[];
    creators: CrewMember[];
  };

  const { directors, writers, creators }: Props = $props();

  type Group = { key: string; label: string; members: CrewMember[] };

  const groups: Group[] = $derived(
    [
      { key: 'directors', label: m.list_title_directors(), members: directors },
      { key: 'creators', label: m.list_title_creators(), members: creators },
      { key: 'writers', label: m.list_title_writers(), members: writers },
    ].filter((group) => group.members.length > 0),
  );
</script>

<div class="film-crew">
  {#each groups as group (group.key)}
    <section class="film-crew__group">
      <h3 class="film-crew__heading">{group.label}</h3>
      <ul class="film-crew__list">
        {#each group.members as member (member.key)}
          <li>
            <a class="film-crew__link" href={UrlBuilder.people(member.key)}>{member.name}</a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .film-crew {
    padding-top: var(--gap-m);
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--gap-s) var(--gap-l);

    @include for-mobile {
      grid-template-columns: 1fr;
      gap: var(--gap-m);
    }

    &__group {
      display: contents;

      @include for-mobile {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    &__heading {
      grid-column: 1;
      margin: 0;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
      font-weight: 700;
      padding-top: 2px;
    }

    &__list {
      grid-column: 2;
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 0.6rem;
    }

    &__link {
      display: inline-block;
      font-size: 0.85rem;
      color: var(--color-text-primary);
      text-decoration: none;
      padding: 0.15rem 0.5rem;
      border-radius: 2px;
      background: color-mix(in srgb, var(--shade-900) 70%, transparent);

      &:hover {
        color: var(--color-background-green, var(--green-500));
      }
    }
  }
</style>
