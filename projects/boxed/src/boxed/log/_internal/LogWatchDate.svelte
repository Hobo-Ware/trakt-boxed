<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MarkAsWatchedAt } from "$lib/models/MarkAsWatchedAt.ts";
  import { fromDateInputValue } from "./fromDateInputValue.ts";
  import { toDateInputValue } from "./toDateInputValue.ts";

  type Choice = "now" | "released" | "other" | "unknown";

  const {
    value,
    onChange,
  }: { value: MarkAsWatchedAt; onChange: (at: MarkAsWatchedAt) => void } =
    $props();

  const today = toDateInputValue(new Date());
  const choice: Choice = $derived(value instanceof Date ? "other" : value);
  let otherDate = $state(today);

  const choices: ReadonlyArray<{ key: Choice; text: string }> = [
    { key: "now", text: m.button_label_mark_as_watched_now() },
    { key: "released", text: m.button_label_mark_as_watched_release_date() },
    { key: "other", text: m.button_label_mark_as_watched_other_date() },
    { key: "unknown", text: m.button_label_mark_as_watched_unknown_date() },
  ];

  const pick = (key: Choice) => {
    if (key !== "other") return onChange(key);

    onChange(fromDateInputValue(otherDate) ?? new Date());
  };

  const pickDate = (raw: string) => {
    otherDate = raw;
    const date = fromDateInputValue(raw);
    if (date) onChange(date);
  };
</script>

<fieldset class="boxed-watch-date">
  <legend class="boxed-watch-date-legend">{m.boxed_log_watched_on()}</legend>
  <div class="boxed-watch-date-options">
    {#each choices as option (option.key)}
      <label class="boxed-watch-date-option" class:is-active={choice === option.key}>
        <input
          type="radio"
          name="boxed-watch-date"
          value={option.key}
          checked={choice === option.key}
          onchange={() => pick(option.key)}
        />
        <span>{option.text}</span>
      </label>
    {/each}
    {#if choice === "other"}
      <input
        class="boxed-watch-date-input"
        type="date"
        max={today}
        value={otherDate}
        aria-label={m.button_label_mark_as_watched_other_date()}
        oninput={(event) => pickDate(event.currentTarget.value)}
      />
    {/if}
  </div>
</fieldset>

<style>
  .boxed-watch-date {
    margin: 0;
    padding: 0;
    border: none;

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-s);
  }

  .boxed-watch-date-legend {
    float: inline-start;
    margin-inline-end: var(--gap-xs);

    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .boxed-watch-date-options {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs);
  }

  .boxed-watch-date-option {
    position: relative;

    display: flex;
    align-items: center;
    height: var(--ni-32);
    padding-inline: var(--ni-12);

    border-radius: var(--border-radius-xxl);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    font-size: var(--ni-14);
    cursor: pointer;

    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    &:focus-within {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }

    &.is-active {
      background: color-mix(in srgb, var(--purple-500) 22%, transparent);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--purple-400);
    }
  }

  .boxed-watch-date-input {
    height: var(--ni-32);
    padding-inline: var(--ni-8);

    border: none;
    border-radius: var(--border-radius-s);
    background: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    color: var(--color-text-primary);
    color-scheme: inherit;
    font: inherit;
  }
</style>
