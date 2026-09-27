<script lang="ts">
  import type { SwitchProps } from "./SwitchProps";

  const {
    label,
    innerText,
    color = "purple",
    navigationType,
    icon,
    checked,
    indeterminate,
    ...props
  }: SwitchProps = $props();
</script>

<label
  class="trakt-switch"
  class:has-custom-icon={!!icon}
  class:has-text={!!innerText}
>
  <input
    type="checkbox"
    role="switch"
    data-color={color}
    aria-label={label}
    data-dpad-navigation={navigationType}
    {checked}
    {indeterminate}
    {...props}
  />

  <span class="trakt-switch-tick">
    {@render icon?.()}
  </span>
  {#if innerText && !indeterminate}
    <span class="trakt-switch-text bold ellipsis">
      {innerText}
    </span>
  {/if}
</label>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  @mixin color-styles($color) {
    &:has(input[data-color="#{$color}"]) {
      --color-switch-on: var(--color-tick-#{$color}, var(--color-tick-purple));
    }
  }

  .trakt-switch {
    --button-width: var(--custom-width, var(--ni-44));
    --button-height: var(--ni-24);

    --text-width: calc(var(--button-width) - var(--ni-32));
    --text-offset: var(--ni-8);

    --tick-size: var(--ni-18);
    --tick-offset: var(--ni-3);

    --color-switch-on: var(--color-tick-purple);
    --color-background-switch: color-mix(
      in srgb,
      var(--color-foreground) 14%,
      var(--color-input-background)
    );
    --color-foreground-switch: var(--color-text-secondary);
    --color-tick: var(--shade-10);

    all: unset;
    cursor: pointer;

    display: flex;
    position: relative;
    align-items: center;

    min-width: var(--button-width);
    max-width: var(--button-width);
    width: var(--button-width);
    height: var(--button-height);

    box-sizing: border-box;
    border-radius: var(--border-radius-xxl);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, box-shadow, outline;

    -webkit-tap-highlight-color: transparent;
    background-color: var(--color-background-switch);

    @each $color in "purple", "red", "blue", "orange", "default", "custom" {
      @include color-styles($color);
    }

    &.has-text {
      --button-width: var(--custom-width, var(--ni-64));
    }

    &:has(input:checked:not(:indeterminate)) {
      --color-background-switch: var(--color-switch-on);
      --color-foreground-switch: var(--shade-10);

      box-shadow: none;
    }

    @include for-mouse {
      &:hover:has(input:not([disabled]):not(:checked)) {
        --color-background-switch: color-mix(
          in srgb,
          var(--color-foreground) 22%,
          var(--color-input-background)
        );
      }

      &:hover:has(input:not([disabled]):checked) {
        --color-background-switch: color-mix(
          in srgb,
          var(--color-switch-on) 84%,
          var(--shade-950)
        );
      }
    }

    &:has(input:active[disabled]) {
      animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
    }

    &:has(input[disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:has(input:indeterminate) {
      .trakt-switch-tick {
        opacity: 0.7;
      }
    }

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    &:has(input:checked) {
      .trakt-switch-text {
        transform: translateX(0);
      }

      .trakt-switch-tick {
        transform: translateX(
          calc(
            var(--rtl-sign) *
              (var(--button-width) - var(--tick-size) - 2 * var(--tick-offset))
          )
        );
      }
    }

    &:has(input:indeterminate) {
      .trakt-switch-tick {
        transform: translateX(
          calc(
            var(--rtl-sign) *
              (var(--button-width) - var(--tick-size) - 2 * var(--tick-offset)) /
              2
          )
        );
      }
    }

    &:has(input:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }

    .trakt-switch-text {
      user-select: none;
      color: var(--color-foreground-switch);
      font-size: var(--ni-12);

      transition: var(--transition-increment) ease-in-out;
      transition-property: color, transform;

      position: absolute;
      inset-inline-start: var(--text-offset);
      width: var(--text-width);

      transform: translateX(
        calc(
          var(--rtl-sign) *
            (var(--button-width) - var(--text-width) - 2 * var(--text-offset))
        )
      );
    }

    .trakt-switch-tick {
      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      top: var(--tick-offset);
      inset-inline-start: var(--tick-offset);

      width: var(--tick-size);
      height: var(--tick-size);

      background: var(--color-tick);
      color: var(--color-switch-on);
      border-radius: 50%;
      box-shadow: 0 var(--ni-1) var(--ni-3)
        color-mix(in srgb, var(--shade-950) 30%, transparent);

      transition: var(--transition-increment) ease-in-out;
      transition-property: transform, opacity;

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }
  }
</style>
