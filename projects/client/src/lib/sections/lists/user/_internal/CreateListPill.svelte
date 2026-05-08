<script lang="ts">
  /*
    Inline create-list pill. Default state is a "+" hint; on tap it
    expands into a text input — type the name, hit Enter, the list is
    created via useSaveList which invalidates List.Created so the
    surrounding list refreshes.

    This is the fast-add path. The full SaveListDrawer is still the
    right call when the user wants to set description / privacy up
    front; the pill is for the common case of "I just want a new list
    called Watchlist 2026".
  */
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { onMount, tick } from "svelte";
  import { useSaveList } from "./useSaveList";

  let isExpanded = $state(false);
  let name = $state("");
  let inputElement: HTMLInputElement | undefined;

  const { isSaving, saveList } = useSaveList({ type: "create" });

  async function expand() {
    isExpanded = true;
    await tick();
    inputElement?.focus();
  }

  function collapse() {
    isExpanded = false;
    name = "";
  }

  async function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      collapse();
      return;
    }

    await saveList({ name: trimmed, description: "", privacy: "private" });
    collapse();
  }

  function handleKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "Escape") {
      collapse();
    }
  }

  onMount(() => {
    /* Auto-collapse when clicking outside the pill. */
    function onDocClick(e: MouseEvent) {
      if (!isExpanded) return;
      const target = e.target as Node | null;
      if (
        inputElement?.parentElement &&
        target &&
        !inputElement.parentElement.contains(target)
      ) {
        if (!name.trim()) collapse();
        else submit();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  });
</script>

<div class="trakt-create-list-pill" class:is-expanded={isExpanded}>
  {#if isExpanded}
    <input
      bind:this={inputElement}
      bind:value={name}
      onkeydown={handleKey}
      disabled={$isSaving}
      placeholder={m.input_placeholder_lists_name()}
      aria-label={m.button_label_create_list()}
    />
  {:else}
    <button
      type="button"
      class="trakt-create-list-pill-trigger"
      onclick={expand}
      aria-label={m.button_label_create_list()}
    >
      <PlusIcon />
      <span class="summary-eyebrow">{m.button_label_create_list()}</span>
    </button>
  {/if}
</div>

<style>
  .trakt-create-list-pill {
    display: inline-flex;
    align-items: center;

    height: var(--ni-32);
    padding: 0 var(--gap-s);

    border-radius: 999px;
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 18%, transparent);

    background: color-mix(in srgb, var(--color-foreground) 4%, transparent);

    transition: var(--transition-increment) ease-in-out;
    transition-property: width, border-color, background;

    overflow: hidden;
  }

  .trakt-create-list-pill.is-expanded {
    border-color: var(--tboxed-positive);
    background: color-mix(in srgb, var(--tboxed-positive) 8%, transparent);
  }

  .trakt-create-list-pill-trigger {
    all: unset;
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    color: var(--color-text-secondary);
  }

  .trakt-create-list-pill-trigger:hover {
    color: var(--color-foreground);
  }

  :global(.trakt-create-list-pill-trigger svg) {
    width: var(--ni-14);
    height: var(--ni-14);
  }

  .trakt-create-list-pill input {
    all: unset;

    flex-grow: 1;
    min-width: var(--ni-180);

    color: var(--color-foreground);
    font-size: var(--font-size-text);

    padding: 0 var(--gap-xs);
  }

  .trakt-create-list-pill input::placeholder {
    color: var(--color-text-secondary);
  }
</style>
