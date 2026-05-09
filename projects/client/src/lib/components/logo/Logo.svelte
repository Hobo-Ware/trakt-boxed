<script lang="ts">
  /*
    Wordmark + three-dot mark, side by side. Letterboxd's chrome
    pattern: solid circles plus the brand name in display sans,
    all-lowercase, tight tracking. trakt-boxed reads as a kindred
    member of the same family.
  */
  type LogoProps = {
    showWordmark?: boolean;
  };

  const { showWordmark = true }: LogoProps = $props();
</script>

<span class="trakt-boxed-logo" class:has-wordmark={showWordmark}>
  <svg
    class="trakt-boxed-logo-mark"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 18"
    aria-hidden="true"
  >
    <circle cx="9" cy="9" r="9" fill="var(--tboxed-rating)" />
    <circle cx="30" cy="9" r="9" fill="var(--tboxed-positive)" />
    <circle cx="51" cy="9" r="9" fill="var(--tboxed-network)" />
  </svg>

  {#if showWordmark}
    <span class="trakt-boxed-logo-wordmark">trakt-boxed</span>
  {/if}
</span>

<style>
  .trakt-boxed-logo {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-12);
  }

  .trakt-boxed-logo-mark {
    height: var(--ni-18);
    width: auto;
    flex-shrink: 0;
  }

  .trakt-boxed-logo-wordmark {
    font-weight: 700;
    font-size: var(--ni-22);
    letter-spacing: -0.02em;
    color: var(--color-foreground);
    line-height: 1;

    /*
      Letterboxd-style: lowercase wordmark, slim tracking. The "tb"
      is left as a normal stroke; the "boxed" suffix keeps weight.
    */
  }

  /*
    When the wordmark is hidden, the mark stands alone (mobile chrome
    and the splash hero use this).
  */
  .trakt-boxed-logo:not(.has-wordmark) .trakt-boxed-logo-mark {
    height: var(--ni-22);
  }
</style>
