<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { logComposerStore } from "../../log/logComposerStore.ts";
  import type { DiaryEntry } from "./DiaryEntry.ts";
  import { toEntryTitle } from "./_internal/toEntryTitle.ts";
  import { toLogTarget } from "./_internal/toLogTarget.ts";

  const { entry }: { entry: DiaryEntry } = $props();
</script>

<button
  type="button"
  class="boxed-diary-edit"
  aria-label={m.boxed_profile_diary_edit_label({ title: toEntryTitle(entry) })}
  onclick={() => logComposerStore.compose(toLogTarget(entry))}
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20h4L19 9l-4-4L4 16v4z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
</button>

<style>
  .boxed-diary-edit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-32);
    height: var(--ni-32);
    padding: 0;
    border: none;
    border-radius: var(--border-radius-s);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;

    svg {
      width: var(--ni-16);
      height: var(--ni-16);
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linejoin: round;
    }

    &:hover,
    &:focus-visible {
      background: var(--color-input-background);
      color: var(--color-text-primary);
    }
  }
</style>
