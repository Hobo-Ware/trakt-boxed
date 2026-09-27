<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import ArrowUpToLineIcon from "$lib/components/icons/ArrowUpToLineIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { importSourceHref } from "$lib/sections/welcome/components/importSourceHref.ts";
  import { importSourceCards } from "./importSourceCards.ts";

  const {
    selected,
    isInPlace = false,
  }: { selected?: string | Nil; isInPlace?: boolean } = $props();
</script>

<ul class="boxed-import-cards">
  {#each importSourceCards as card (card.source)}
    {@const name = card.name()}
    {@const action = m.welcome_import_action({ service: name })}
    <li
      class="import-card"
      data-featured={card.isFeatured}
      data-selected={selected === card.source}
    >
      <div class="card-top">
        <span class="card-mark" aria-hidden="true"><card.icon /></span>
        {#if card.isFeatured}
          <span class="card-badge">{m.boxed_import_featured()}</span>
        {/if}
      </div>
      <div class="card-copy">
        <h3>{name}</h3>
        <p>{card.description()}</p>
        <span class="card-format">{card.accept.replaceAll(",", " · ")}</span>
      </div>
      <Link
        href={importSourceHref(card.source)}
        label={action}
        color="inherit"
        noscroll={isInPlace}
        replacestate={isInPlace}
      >
        <ArrowUpToLineIcon />
        <span>{m.header_import()}</span>
      </Link>
    </li>
  {/each}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-import-cards {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-tablet-lg {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .import-card {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
    min-width: 0;

    padding: var(--ni-16);
    border-radius: var(--border-radius-l);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    &[data-featured="true"] {
      background: color-mix(
        in srgb,
        var(--purple-500) 14%,
        var(--color-card-background)
      );
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-500);
    }

    &[data-selected="true"] {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--purple-400);
    }

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--ni-8);

      height: var(--ni-36);
      padding-inline: var(--ni-14);
      border-radius: var(--border-radius-m);
      background: var(--color-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

      font-size: var(--ni-14);
      font-weight: 500;
      text-decoration: none;
      color: var(--color-text-primary);

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
        flex-shrink: 0;
      }

      :global(span) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:hover,
      &:focus-visible {
        box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-400);
      }
    }

    &[data-featured="true"] :global(.trakt-link) {
      background: var(--purple-500);
      box-shadow: none;
      color: var(--shade-10);

      &:hover,
      &:focus-visible {
        background: var(--purple-600);
      }
    }
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-8);
  }

  .card-mark {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-40);
    height: var(--ni-40);
    border-radius: var(--border-radius-m);
    background: var(--color-border);

    color: var(--color-text-primary);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }

  .card-badge {
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xxl);
    background: color-mix(in srgb, var(--purple-500) 28%, transparent);
    color: var(--color-text-primary);
    font-size: var(--ni-11);
    font-weight: 500;
    text-align: center;
  }

  .card-copy {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);

    h3 {
      margin: 0;
      font-size: var(--ni-16);
      font-weight: 500;
    }

    p {
      margin: 0;
      font-size: var(--ni-14);
      line-height: 1.45;
      color: var(--color-text-secondary);
    }
  }

  .card-format {
    display: block;
    height: var(--ni-16);
    overflow: hidden;
    line-height: var(--ni-16);
    font-family: var(--boxed-font-mono);
    font-size: var(--ni-11);
    color: var(--color-text-secondary);
  }
</style>
