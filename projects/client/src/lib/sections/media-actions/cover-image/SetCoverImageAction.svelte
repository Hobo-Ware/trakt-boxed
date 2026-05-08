<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import { useCoverImage } from "./useCoverImage";

  type SetCoverImageActionProps = {
    style: "action" | "dropdown-item";
    id: number;
    type: ExtendedMediaType;
    title: string;
    variant?: "primary" | "secondary";
  };

  const {
    style,
    id,
    type,
    title,
    variant = "secondary",
  }: SetCoverImageActionProps = $props();

  const { isSettingCoverImage, setCoverImage } = $derived(
    useCoverImage({ type, id }),
  );

  const commonProps = $derived({
    onclick: setCoverImage,
    label: m.button_label_set_cover_image({ title }),
  });
</script>

{#if style === "action"}
  <ActionButton style="ghost" disabled={$isSettingCoverImage} {...commonProps}>
    <CoverImageIcon />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem color="default" style="flat" {variant} {...commonProps}>
    {m.button_text_set_cover_image()}
    {#snippet icon()}
      <CoverImageIcon />
    {/snippet}
  </DropdownItem>
{/if}
