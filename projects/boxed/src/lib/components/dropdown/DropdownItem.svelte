<script lang="ts">
  import { disableNavigation } from "$lib/utils/actions/disableNavigation";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import type { Snippet } from "svelte";
  import Link from "../link/Link.svelte";

  type DropdownItemProps = {
    color?: "red" | "purple" | "blue" | "orange" | "default";
    tabindex?: number;
    icon?: Snippet;
    end?: Snippet;
    subtitle?: Snippet;
    style?: "ghost" | "flat";
    variant?: "primary" | "secondary";
    selected?: boolean;
  } & ChildrenProps &
    HTMLElementProps;

  type DropdownItemAnchorProps = DropdownItemProps & HTMLAnchorProps;

  const {
    color = "purple",
    style = "ghost",
    variant = "primary",
    selected = false,
    children,
    icon,
    end,
    subtitle,
    ...props
  }: DropdownItemProps | DropdownItemAnchorProps = $props();

  const hasHandler = $derived(
    Object.keys(props).some((propName) => propName.startsWith("on")),
  );
  const tabIndex = $derived(hasHandler ? 0 : -1);
  const href = $derived((props as DropdownItemAnchorProps).href);
  const itemRole = $derived(hasHandler && !href ? "button" : undefined);
  const noscroll = $derived((props as DropdownItemAnchorProps).noscroll);
  const replacestate = $derived(
    (props as DropdownItemAnchorProps).replacestate,
  );
  const target = $derived((props as DropdownItemAnchorProps).target);

  // FIXME: use button when not href & update selectors in applicable icons
</script>

{#snippet text()}
  <div class="item-label">
    <p class="bold capitalize ellipsis">{@render children()}</p>
    {#if subtitle}
      <p class="small secondary ellipsis">{@render subtitle()}</p>
    {/if}
  </div>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<li
  use:triggerWithKeyboard
  use:disableNavigation={props.disabled}
  role={itemRole}
  tabindex={tabIndex}
  data-color={color}
  data-style={style}
  data-variant={variant}
  class:is-selected={selected}
  class:has-subtitle={subtitle != null}
  {...props}
>
  {#if href}
    <Link {href} {noscroll} {replacestate} {target} color="inherit">
      {#if icon}
        <div class="item-icon">
          {@render icon()}
        </div>
      {/if}
      {@render text()}
      {#if end}
        <div class="item-end">
          {@render end()}
        </div>
      {/if}
    </Link>
  {:else}
    {#if icon}
      <div class="item-icon">
        {@render icon()}
      </div>
    {/if}
    {@render text()}
    {#if end}
      <div class="item-end">
        {@render end()}
      </div>
    {/if}
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  li {
    --icon-gap: var(--gap-s);

    text-decoration: none;
    list-style-type: none;
    user-select: none;

    --item-padding-block: var(--dropdown-item-padding-block, 0);
    --item-padding-inline: var(--dropdown-item-padding-inline, var(--ni-12));

    padding: var(--item-padding-block) var(--item-padding-inline);
    height: var(--dropdown-item-height, var(--ni-40));
    width: 100%;
    box-sizing: border-box;
    border-radius: var(--dropdown-item-radius, var(--ni-6));
    font-size: var(--ni-14);

    align-content: center;
    justify-self: center;

    display: flex;
    flex-direction: var(--dropdown-item-direction, row);
    align-items: center;
    justify-content: var(--dropdown-item-justify, flex-start);
    gap: var(--icon-gap);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background, color;

    &.has-subtitle {
      --item-padding-block: var(--dropdown-item-padding-block, var(--ni-8));

      height: var(--dropdown-item-height, auto);
    }

    .item-label {
      min-width: 0;
    }

    .item-icon {
      display: flex;

      :global(svg) {
        width: var(--ni-18);
        height: var(--ni-18);
      }
    }

    .item-end {
      display: flex;
      margin-inline-start: auto;

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    &:active[disabled="true"] {
      animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
    }

    &[disabled="true"] {
      cursor: not-allowed;
    }

    &:has(> :global(.trakt-link)) {
      padding: 0;
    }

    :global(.trakt-dropdown-group) & {
      --dropdown-item-radius: 0;
      --dropdown-item-height: auto;
      --dropdown-item-padding-block: var(--ni-14);
      --dropdown-item-padding-inline: var(--ni-16);
      --dropdown-item-background: transparent;
      --dropdown-item-background-hover: var(--color-select-item-hover);
      --dropdown-item-background-selected: var(--color-select-item-hover);
      --dropdown-item-background-active: var(--color-select-item-hover);
      --dropdown-item-foreground: var(--color-text-primary);

      &.is-selected {
        --dropdown-item-background-selected: var(--color-option-list-selected);
        --dropdown-item-background-hover: var(
          --color-option-list-selected-hover
        );
        --dropdown-item-background-active: var(
          --color-option-list-selected-hover
        );
      }

      &[data-color="red"] {
        --dropdown-item-foreground: var(--red-600);
      }

      &[disabled="true"] {
        --dropdown-item-foreground: var(--color-text-secondary);
      }

      &:not(:last-child) {
        border-block-end: var(--ni-1) solid var(--color-option-list-separator);
      }
    }

    :global(.trakt-link) {
      color: inherit;

      width: 100%;
      height: 100%;
      padding: var(--item-padding-block) var(--item-padding-inline);
      box-sizing: border-box;

      display: flex;
      align-items: center;
      gap: var(--icon-gap);

      text-decoration: none;
    }

    @mixin color($color) {
      color: var(--dropdown-item-foreground, #{$color});

      @include for-mouse {
        &:hover:not([disabled="true"]) {
          background: var(
            --dropdown-item-background-hover,
            color-mix(in srgb, currentColor 8%, transparent)
          );
        }
      }

      &[disabled="true"] {
        background: var(--dropdown-item-background, transparent);
        opacity: 0.5;
      }

      &.is-selected {
        background: var(
          --dropdown-item-background-selected,
          var(--boxed-color-accent-soft)
        );
        color: var(--dropdown-item-foreground, var(--boxed-color-accent-text));
      }

      &:active {
        background: var(
          --dropdown-item-background-active,
          color-mix(in srgb, currentColor 12%, transparent)
        );
      }

      &:focus-visible,
      &:has(> :global(.trakt-link:focus-visible)) {
        outline: var(--border-thickness-xs) solid var(--color-link-active);
      }
    }

    &[data-color="purple"],
    &[data-color="default"] {
      @include color(var(--color-text-primary));
    }

    &[data-color="red"] {
      @include color(var(--color-accent-red));
    }

    &[data-color="blue"] {
      @include color(var(--color-accent-blue));
    }

    &[data-color="orange"] {
      @include color(var(--color-accent-orange));
    }
  }
</style>
