<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import JoinTraktButton from "$lib/sections/navbar/components/JoinTraktButton.svelte";
  import type { Snippet } from "svelte";

  type ActionShellProps = {
    label: string | undefined;
    header: Snippet;
    rating: Snippet;
    children: Snippet;
  };

  const { label, header, rating, children }: ActionShellProps = $props();

  const { isAuthorized } = useAuth();
</script>

<section class="boxed-action-card" aria-label={label}>
  {#if $isAuthorized}
    {@render header()}
    <div class="boxed-action-rating">{@render rating()}</div>
  {:else}
    <div class="boxed-action-join">
      <p>{m.boxed_title_join_prompt()}</p>
      <JoinTraktButton size="small" />
    </div>
  {/if}

  {@render children()}
</section>

<style>
  .boxed-action-card {
    display: flex;
    flex-direction: column;

    border-radius: var(--border-radius-m);
    overflow: hidden;
    background:
      linear-gradient(
        to bottom,
        color-mix(in srgb, var(--ambient-glow, transparent) 18%, transparent) 0%,
        transparent var(--ni-180)
      ),
      var(--color-card-background);
    box-shadow:
      inset 0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--color-foreground) 6%, transparent),
      0 var(--ni-24) var(--ni-48) calc(-1 * var(--ni-28))
        color-mix(in srgb, var(--ambient-glow, transparent) 50%, transparent);
  }

  .boxed-action-rating {
    box-sizing: border-box;
    height: var(--ni-88);

    display: flex;
    align-items: center;
    justify-content: center;

    border-top: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-action-join {
    box-sizing: border-box;
    min-height: var(--ni-120);
    padding: var(--ni-16);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-12);

    text-align: center;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    p {
      margin: 0;
    }
  }
</style>
