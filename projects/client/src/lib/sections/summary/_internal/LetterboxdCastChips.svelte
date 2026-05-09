<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import Link from "$lib/components/link/Link.svelte";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type LetterboxdCastChipsProps = {
    cast: CastMember[];
  };

  const { cast }: LetterboxdCastChipsProps = $props();

  const COLLAPSED = 24;
  let isExpanded = $state(false);
  const visible = $derived(isExpanded ? cast : cast.slice(0, COLLAPSED));
  const hasMore = $derived(cast.length > COLLAPSED);
</script>

{#if cast.length > 0}
  <section class="lb-cast-chips">
    <h3>{m.lb_section_cast()}</h3>
    <ul class="lb-cast-chips-list">
      {#each visible as person (person.key)}
        <li>
          <Link href={UrlBuilder.people(person.key)} color="inherit">
            <span
              class="lb-cast-chip"
              title={person.characterName
                ? `${person.name} as ${person.characterName}`
                : person.name}
            >
              {person.name}
            </span>
          </Link>
        </li>
      {/each}
      {#if hasMore && !isExpanded}
        <li>
          <button
            type="button"
            class="lb-cast-chip lb-cast-chip-more"
            onclick={() => (isExpanded = true)}
          >
            {m.lb_cast_show_all()}
          </button>
        </li>
      {/if}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-cast-chips {
    padding: var(--ni-18) 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);

    h3 {
      margin: 0 0 var(--ni-10) 0;
      font-size: var(--ni-11);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-secondary);
    }
  }

  .lb-cast-chips-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-6) var(--ni-6);
  }

  .lb-cast-chip {
    display: inline-block;
    padding: var(--ni-6) var(--ni-12);
    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    border-radius: var(--border-radius-xs);
    color: var(--color-foreground);
    font-size: var(--ni-13);
    font-weight: 500;
    border: 0;
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--tboxed-positive) 24%, transparent);
      color: var(--tboxed-positive);
    }
  }

  .lb-cast-chip-more {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--ni-11);
    font-weight: 700;
    color: var(--tboxed-positive);
    background: transparent;
  }
</style>
