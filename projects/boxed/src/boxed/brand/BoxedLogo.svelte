<script lang="ts">
  type BoxedLogoProps = {
    variant?: "full" | "mark";
  };

  const { variant = "full" }: BoxedLogoProps = $props();
</script>

<span class="boxed-logo" data-variant={variant} dir="ltr">
  <svg
    class="boxed-logo-mark"
    viewBox="0 0 64 26"
    aria-hidden="true"
    focusable="false"
  >
    <rect class="is-watched" x="2" y="4" width="20" height="20" rx="5" />
    <rect class="is-watchlist" x="42" y="4" width="20" height="20" rx="5" />
    <rect class="is-brand" x="19" y="1" width="26" height="26" rx="7" />
    <path class="is-check" d="M25.5 14.2l4.2 4.2 8.8-8.8" />
  </svg>
  {#if variant === "full"}
    <span class="boxed-logo-word">
      <span class="boxed-logo-trakt">trakt</span><span class="boxed-logo-boxed"
        >boxed</span
      >
    </span>
  {/if}
</span>

<style>
  .boxed-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    font-size: var(--boxed-logo-size, var(--ni-24));
    line-height: 1;
    color: var(--color-text-primary);
    text-decoration: none;
  }

  .boxed-logo-mark {
    display: block;
    width: 2.83em;
    height: 1.15em;
    overflow: visible;

    rect {
      stroke: var(--color-background);
      stroke-width: 2.5;
    }

    .is-watched {
      fill: var(--boxed-color-watched);
    }

    .is-watchlist {
      fill: var(--boxed-color-watchlist);
    }

    .is-brand {
      fill: var(--purple-500);
    }

    .is-check {
      fill: none;
      stroke: var(--shade-10);
      stroke-width: 2.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  .boxed-logo-word {
    font-size: 1em;
    display: inline-flex;
    align-items: baseline;
    white-space: nowrap;
  }

  .boxed-logo-trakt {
    font-family: "Roboto", "Roboto Fallback", Arial, sans-serif;
    font-size: 0.92em;
    font-weight: 800;
    color: var(--color-text-primary);
    letter-spacing: -0.03em;
  }

  .boxed-logo-boxed {
    margin-inline-start: 0.12em;
    font-family: var(--boxed-font-title);
    font-size: 0.98em;
    font-style: italic;
    font-weight: 500;
    color: var(--boxed-color-accent-text);
  }
</style>
