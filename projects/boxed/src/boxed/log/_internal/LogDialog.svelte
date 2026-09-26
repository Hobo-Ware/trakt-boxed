<script lang="ts">
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { Dialog } from "bits-ui";

  const {
    title,
    onClose,
    children,
  }: ChildrenProps & { title: string; onClose: () => void } = $props();
</script>

<Dialog.Root
  open
  onOpenChange={(isOpen) => {
    if (!isOpen) onClose();
  }}
>
  <Dialog.Portal>
    <Dialog.Overlay class="boxed-log-overlay" />
    <Dialog.Content class="boxed-log-dialog" interactOutsideBehavior="close">
      <Dialog.Title class="boxed-visually-hidden">{title}</Dialog.Title>
      <span class="boxed-log-handle" aria-hidden="true"></span>
      <Dialog.Close class="boxed-log-close" aria-label={m.button_label_close()}>
        <CloseIcon />
      </Dialog.Close>
      {@render children()}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.boxed-log-overlay) {
    position: fixed;
    inset: 0;
    z-index: var(--layer-overlay);
    background: color-mix(in srgb, var(--shade-950) 72%, transparent);
    backdrop-filter: blur(var(--ni-4));
  }

  :global(.boxed-log-dialog) {
    position: fixed;
    z-index: var(--layer-overlay);
    inset-inline-start: 50%;
    top: 50%;
    translate: -50% -50%;

    box-sizing: border-box;
    width: min(var(--ni-920), calc(100vw - 2 * var(--layout-distance-side)));
    max-height: calc(100dvh - 2 * var(--ni-40));
    overflow-y: auto;
    padding: var(--ni-32);

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow:
      0 0 0 var(--border-thickness-xxs) var(--color-border),
      0 var(--ni-24) var(--ni-64) color-mix(in srgb, var(--shade-950) 70%, transparent);

    @include for-tablet-sm-and-below {
      inset-inline: 0;
      top: auto;
      bottom: 0;
      translate: none;

      width: 100%;
      max-height: calc(100dvh - var(--ni-40));
      padding: var(--ni-20) var(--layout-distance-side)
        calc(var(--ni-20) + env(safe-area-inset-bottom, 0px));

      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }
  }

  :global(.boxed-log-dialog:dir(rtl)) {
    translate: 50% -50%;

    @include for-tablet-sm-and-below {
      translate: none;
    }
  }

  .boxed-log-handle {
    display: none;

    @include for-tablet-sm-and-below {
      display: block;
      width: var(--ni-40);
      height: var(--ni-4);
      margin: 0 auto var(--ni-16);
      border-radius: var(--border-radius-xxl);
      background: var(--color-border);
    }
  }

  :global(.boxed-log-close) {
    position: absolute;
    top: var(--ni-16);
    inset-inline-end: var(--ni-16);

    width: var(--ni-40);
    height: var(--ni-40);
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: var(--border-radius-m);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
      background: var(--color-input-background);
    }
  }

  :global(.boxed-visually-hidden) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
