<script lang="ts">
  /*
    Letterboxd-style editorial banner that crowns the authed home
    above the existing tracking surfaces (UpNext, WatchList, etc.).
    Fraunces serif greeting + an eyebrow with the local date so the
    dashboard reads as a personal journal rather than a feed.
  */
  import * as m from "$lib/features/i18n/messages.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";

  const { user } = useUser();

  const firstName = $derived($user?.name?.first ?? $user?.username ?? "");

  const todayLabel = $derived.by(() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
        .format(new Date())
        .toUpperCase();
    } catch {
      return "";
    }
  });

  const greeting = $derived.by(() => {
    const hour = new Date().getHours();
    if (hour < 5) return m.lb_home_welcome_late();
    if (hour < 12) return m.lb_home_welcome_morning();
    if (hour < 18) return m.lb_home_welcome_afternoon();
    return m.lb_home_welcome_evening();
  });
</script>

<header class="lb-home-welcome">
  <p class="lb-home-welcome-eyebrow">
    {#if todayLabel}
      <span class="lb-home-welcome-date">{todayLabel}</span>
    {/if}
    <span class="lb-home-welcome-divider" aria-hidden="true">·</span>
    <span>{m.lb_home_welcome_journal()}</span>
  </p>
  <h1 class="lb-home-welcome-title">
    {firstName
      ? m.lb_home_welcome_named({ greeting, name: firstName })
      : greeting}
  </h1>
  <p class="lb-home-welcome-subline">{m.lb_home_welcome_subline()}</p>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .lb-home-welcome {
    width: 100%;
    max-width: var(--ni-1280);
    margin: var(--ni-22) auto var(--ni-32);
    padding: 0 var(--ni-16);
    box-sizing: border-box;

    @include for-tablet-lg {
      padding-inline: var(--ni-32);
      margin-block: var(--ni-44) var(--ni-44);
    }
  }

  .lb-home-welcome-eyebrow {
    margin: 0 0 var(--ni-12) 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ni-6);
    font-size: var(--ni-11);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--color-text-secondary);
  }

  .lb-home-welcome-date {
    color: var(--tboxed-positive);
  }

  .lb-home-welcome-divider {
    color: color-mix(in srgb, var(--color-foreground) 25%, transparent);
  }

  .lb-home-welcome-title {
    margin: 0;
    font-family: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.05;
    color: var(--color-foreground);
    font-size: var(--ni-32);

    @include for-tablet-sm {
      font-size: var(--ni-44);
    }

    @include for-tablet-lg {
      font-size: var(--ni-60);
    }
  }

  .lb-home-welcome-subline {
    margin: var(--ni-10) 0 0 0;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);
    max-width: var(--ni-560);
    line-height: 1.5;
  }
</style>
