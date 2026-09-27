<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { useResetCoverImage } from "$lib/sections/settings/useResetCoverImage.ts";
  import { useSettings } from "$lib/sections/settings/useSettings.ts";
  import SettingsCard from "./SettingsCard.svelte";
  import { toProfileChanges } from "./_internal/toProfileChanges.ts";

  type Field = "name" | "location" | "about";
  type SaveStatus = "idle" | "saved" | "failed";

  const { user } = useUser();
  const { profile, isSavingSettings } = useSettings();
  const { resetCoverImage, hasCoverImage, isResettingCoverImage } =
    useResetCoverImage();

  let draft = $state<Partial<Record<Field, string>>>({});
  let status = $state<SaveStatus>("idle");

  const current = $derived({
    name: $profile.displayName,
    location: $profile.location,
    about: $profile.about,
  });
  const values = $derived({ ...current, ...draft });
  const changes = $derived(toProfileChanges({ draft, current }));
  const hasChanges = $derived(Object.keys(changes).length > 0);
  const isNameMissing = $derived(values.name.trim() === "");

  const edit = (field: Field, value: string) => {
    draft = { ...draft, [field]: value };
    status = "idle";
  };

  const cancel = () => {
    draft = {};
    status = "idle";
  };

  const save = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!hasChanges || isNameMissing) return;

    const didSave = await $profile.set(changes);
    status = didSave ? "saved" : "failed";
    if (didSave) draft = {};
  };

  const statusText = $derived.by(() => {
    if (status === "saved") return m.boxed_settings_saved();
    if (status === "failed") return m.error_text_failed_update();
    return "";
  });
</script>

<SettingsCard
  id="boxed-settings-profile"
  title={m.page_title_profile()}
  description={m.boxed_settings_profile_description()}
>
  <form class="boxed-profile-form" onsubmit={save}>
    <div class="profile-identity">
      <div class="profile-avatar">
        <ProfileImage
          isEditable
          --image-size="var(--ni-80)"
          --border-width="var(--border-thickness-xs)"
          name={$user.name.first}
          src={$user.avatar.url}
          isVip={$user.isVip}
        />
        <p class="field-hint">{m.boxed_settings_avatar_hint()}</p>
      </div>

      <div class="profile-cover">
        <div class="cover-preview">
          {#if $hasCoverImage && $user.cover.url}
            <CrossOriginImage src={$user.cover.url} alt="" />
          {/if}
        </div>
        <div class="cover-copy">
          <span class="field-label">{m.text_settings_cover_image()}</span>
          <span class="field-hint">
            {$hasCoverImage
              ? m.text_settings_cover_image_description()
              : m.text_settings_no_cover_image_description()}
          </span>
          <Button
            variant="secondary"
            style="outline"
            color="red"
            size="small"
            label={m.button_label_reset_cover_image()}
            onclick={resetCoverImage}
            disabled={!$hasCoverImage || $isResettingCoverImage}
          >
            {m.button_text_reset_cover_image()}
          </Button>
        </div>
      </div>
    </div>

    <div class="profile-fields">
      <label class="field">
        <span class="field-label">{m.text_display_name()}</span>
        <input
          type="text"
          name="name"
          autocomplete="name"
          required
          value={values.name}
          oninput={(event) => edit("name", event.currentTarget.value)}
        />
      </label>
      <label class="field">
        <span class="field-label">{m.text_location()}</span>
        <input
          type="text"
          name="location"
          value={values.location}
          oninput={(event) => edit("location", event.currentTarget.value)}
        />
      </label>
      <label class="field field-wide">
        <span class="field-label">{m.text_about()}</span>
        <textarea
          name="about"
          rows="4"
          value={values.about}
          oninput={(event) => edit("about", event.currentTarget.value)}
        ></textarea>
      </label>
    </div>

    <div class="profile-toggle">
      <span class="field-label">{m.text_private_account()}</span>
      <Switch
        label={m.switch_label_private()}
        checked={$profile.isPrivate}
        onclick={() => $profile.set({ private: !$profile.isPrivate })}
        disabled={$isSavingSettings}
        color="purple"
      />
    </div>

    <footer class="profile-actions">
      <p class="profile-status" data-status={status} aria-live="polite">
        {statusText}
      </p>
      <Button
        type="button"
        size="small"
        variant="secondary"
        style="flat"
        color="default"
        label={m.button_label_cancel()}
        onclick={cancel}
        disabled={!hasChanges || $isSavingSettings}
      >
        {m.button_text_cancel()}
      </Button>
      <Button
        type="submit"
        size="small"
        variant="primary"
        style="flat"
        color="purple"
        label={m.boxed_settings_save()}
        disabled={!hasChanges || isNameMissing || $isSavingSettings}
      >
        {m.boxed_settings_save()}
      </Button>
    </footer>
  </form>
</SettingsCard>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-profile-form {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .profile-identity {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--ni-32);
    align-items: center;

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-20);
    }
  }

  .profile-avatar {
    display: flex;
    align-items: center;
    gap: var(--ni-16);

    .field-hint {
      max-width: 18ch;
      margin: 0;
    }
  }

  .profile-cover {
    display: flex;
    align-items: center;
    gap: var(--ni-16);

    @include for-mobile {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .cover-preview {
    flex-shrink: 0;
    width: var(--ni-240);
    height: var(--ni-80);
    overflow: hidden;

    border-radius: var(--border-radius-m);
    background: linear-gradient(
      120deg,
      color-mix(in srgb, var(--green-700) 40%, var(--color-card-background)),
      color-mix(in srgb, var(--blue-700) 40%, var(--color-card-background)) 60%,
      var(--color-background)
    );
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    @include for-mobile {
      width: 100%;
      height: auto;
      aspect-ratio: 3 / 1;
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .cover-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-8);
    min-width: 0;
  }

  .profile-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    min-width: 0;

    input,
    textarea {
      box-sizing: border-box;
      width: 100%;
      padding: var(--ni-10) var(--ni-12);

      border: none;
      border-radius: var(--border-radius-m);
      background: var(--color-input-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--ni-14);
      line-height: 1.5;

      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--purple-400);
      }
    }

    input {
      height: var(--ni-40);
      padding-block: 0;
    }

    textarea {
      resize: vertical;
      min-height: var(--ni-104);
    }
  }

  .field-wide {
    grid-column: 1 / -1;
  }

  .field-label {
    font-size: var(--ni-14);
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .field-hint {
    font-size: var(--ni-12);
    line-height: 1.4;
    color: var(--color-text-secondary);
  }

  .profile-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ni-16);

    padding: var(--ni-14) var(--ni-16);
    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
  }

  .profile-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ni-10);

    padding-block-start: var(--ni-20);
    border-block-start: var(--border-thickness-xxs) solid var(--color-border);
  }

  .profile-status {
    flex: 1;
    min-height: 1.4em;
    margin: 0;
    font-size: var(--ni-14);
    color: var(--color-text-secondary);

    &[data-status="failed"] {
      color: var(--red-400);
    }
  }
</style>
