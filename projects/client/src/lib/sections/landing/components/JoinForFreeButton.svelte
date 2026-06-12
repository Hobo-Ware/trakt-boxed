<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { login } = useAuth();
</script>

<trakt-join-for-free-button>
  <Button
    color="purple"
    label={m.button_label_join_trakt()}
    style="flat"
    navigationType={DpadNavigationType.Item}
    onclick={login}
  >
    {m.button_text_join_trakt_for_free()}
  </Button>
</trakt-join-for-free-button>

<style>
  trakt-join-for-free-button {
    :global(.trakt-button) {
      position: relative;
      overflow: visible;
      width: 100%;

      &:before {
        --glow-size: var(--ni-2);

        content: "";

        position: absolute;
        top: calc(-1 * var(--glow-size));
        left: calc(-1 * var(--glow-size));

        width: calc(100% + 2 * var(--glow-size));
        height: calc(100% + 2 * var(--glow-size));

        background: linear-gradient(
          45deg,
          var(--green-500),
          var(--green-300),
          var(--green-100),
          var(--green-400),
          var(--green-700),
          var(--green-800),
          var(--green-900),
          var(--green-700),
          var(--green-500)
        );
        background-size: 400%;

        z-index: var(--layer-background);
        filter: blur(var(--ni-4));

        animation: shift-background 20s linear infinite;
        opacity: 1;
      }
    }
  }
</style>
