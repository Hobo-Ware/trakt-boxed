<script lang="ts">
  import { goto } from "$app/navigation";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListPrivacy } from "$lib/requests/models/ListPrivacy.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListReorderDrawer from "$lib/sections/lists/user/ListReorderDrawer.svelte";
  import { useSaveList } from "$lib/sections/lists/user/useSaveList.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import PillSwitch from "../components/PillSwitch.svelte";

  const PRIVACY_OPTIONS: ReadonlyArray<{ value: ListPrivacy; label: () => string }> = [
    { value: "public", label: m.text_list_public },
    { value: "private", label: m.text_private },
  ];

  type ListEditorProps = {
    list: MediaListSummary | null;
    isPrivateByDefault: boolean;
    cancelHref: string;
  };

  const { list, isPrivateByDefault, cancelHref }: ListEditorProps = $props();

  const initial = untrack(() => ({
    name: list?.name ?? "",
    description: list?.description ?? "",
    privacy: list?.privacy ?? (isPrivateByDefault ? "private" : "public"),
  }));

  let name = $state(initial.name);
  let description = $state(initial.description);
  let privacy: ListPrivacy = $state(initial.privacy);
  let isReordering = $state(false);

  const { saveList, isSaving } = untrack(() =>
    list
      ? useSaveList({ type: "update", listId: list.slug })
      : useSaveList({ type: "create" }),
  );

  const isNameValid = $derived(name.trim().length > 0);
  const isDirty = $derived(
    name !== initial.name ||
      description !== initial.description ||
      privacy !== initial.privacy,
  );

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!isNameValid || !isDirty) return;

    const slug = await saveList({ name, description, privacy });
    const owner = list?.user.slug;

    if (list && owner) {
      await goto(UrlBuilder.users(owner).lists(slug ?? list.slug), {
        replaceState: true,
      });
      return;
    }

    await goto(`${UrlBuilder.profile.user("me")}/lists`, { replaceState: true });
  };
</script>

<form class="boxed-list-editor" onsubmit={submit}>
  <h1>{list ? m.page_title_edit_list() : m.page_title_create_list()}</h1>

  <label class="boxed-list-editor-field">
    <span>{m.input_placeholder_lists_name()}</span>
    <input
      type="text"
      bind:value={name}
      required
      disabled={$isSaving}
      aria-invalid={!isNameValid && isDirty}
    />
    <small class:is-visible={!isNameValid && isDirty}>
      {m.validation_text_list_name()}
    </small>
  </label>

  <label class="boxed-list-editor-field">
    <span>{m.input_placeholder_lists_description()}</span>
    <textarea rows="5" bind:value={description} disabled={$isSaving}></textarea>
  </label>

  <div class="boxed-list-editor-privacy">
    <PillSwitch
      options={PRIVACY_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label(),
      }))}
      value={privacy}
      label={m.boxed_list_privacy_label()}
      disabled={$isSaving}
      onChange={(next) => (privacy = next)}
    />
  </div>

  <div class="boxed-list-editor-actions">
    {#if list}
      <button
        type="button"
        class="boxed-list-editor-secondary"
        onclick={() => (isReordering = true)}
      >
        {m.button_text_reorder()}
      </button>
    {/if}
    <a class="boxed-list-editor-secondary" href={cancelHref}>
      {m.button_text_cancel()}
    </a>
    <button
      type="submit"
      class="boxed-list-editor-primary"
      disabled={$isSaving || !isNameValid || !isDirty}
    >
      {list ? m.boxed_log_save() : m.button_text_create()}
    </button>
  </div>
</form>

{#if list && isReordering}
  <ListReorderDrawer
    source={{ type: "user-list", list }}
    title={m.drawer_title_reorder_list()}
    onClose={() => (isReordering = false)}
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-list-editor {
    max-width: var(--ni-640);
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);

    h1 {
      @include boxed-page-title;
    }
  }

  .boxed-list-editor-field {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);

    span {
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    input,
    textarea {
      box-sizing: border-box;
      width: 100%;
      padding: var(--ni-12) var(--ni-14);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--border-radius-m);
      background: var(--color-input-background);
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--ni-16);

      &:focus-visible {
        outline: none;
        border-color: var(--color-link-active);
      }
    }

    textarea {
      resize: vertical;
      line-height: 1.6;
    }

    small {
      min-height: var(--ni-16);
      font-size: var(--ni-12);
      color: var(--color-input-error);
      visibility: hidden;

      &.is-visible {
        visibility: visible;
      }
    }
  }

  .boxed-list-editor-privacy {
    align-self: flex-start;
  }

  .boxed-list-editor-actions {
    padding-top: var(--ni-12);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ni-12);
    border-top: var(--border-thickness-xxs) solid var(--color-border);
  }

  .boxed-list-editor-secondary,
  .boxed-list-editor-primary {
    height: var(--ni-40);
    padding-inline: var(--ni-18);
    display: inline-flex;
    align-items: center;
    border: none;
    border-radius: var(--border-radius-m);
    font: inherit;
    font-size: var(--ni-14);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }

  .boxed-list-editor-secondary {
    background: var(--color-input-background);
    color: var(--color-text-primary);

    &:first-child {
      margin-inline-end: auto;
    }
  }

  .boxed-list-editor-primary {
    background: var(--purple-500);
    color: var(--shade-10);

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }
</style>
