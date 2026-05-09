<script lang="ts">
  /*
    Right-rail sign-in CTA card on the desktop summary surface.
    Mirrors Letterboxd's "Sign in to log, rate, like or review"
    card. Rendered only for anonymous viewers; authed members get
    nothing here (action affordances live elsewhere on the page).
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";

  const { isAuthorized, login } = useAuth();
</script>

{#if !$isAuthorized}
  <div class="lb-signin-card">
    <p class="lb-signin-eyebrow">
      {m.lb_signin_card_eyebrow()}
    </p>
    <p class="lb-signin-text">
      {m.lb_signin_card_lede()}
    </p>
    <button
      type="button"
      class="lb-signin-cta"
      onclick={() => login()}
    >
      {m.lb_signin_card_cta()}
    </button>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-signin-card {
    border: 1px solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
    border-radius: var(--border-radius-xs);
    padding: var(--ni-18);
    background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .lb-signin-eyebrow {
    margin: 0;
    font-size: var(--ni-11);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--color-text-secondary);
  }

  .lb-signin-text {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground) 90%, transparent);
    font-size: var(--ni-14);
    line-height: 1.5;
  }

  .lb-signin-cta {
    border: 0;
    padding: var(--ni-12) var(--ni-18);
    background: var(--tboxed-positive);
    color: var(--shade-1000);
    border-radius: var(--border-radius-xs);
    font-size: var(--ni-12);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    cursor: pointer;

    &:hover {
      filter: brightness(1.1);
    }
  }
</style>
