<script lang="ts">
  import { page } from "$app/state";
  import ErrorScreen from "$boxed/static/ErrorScreen.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import RetryIcon from "$lib/components/icons/RetryIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const isNotFound = $derived(page.status === 404);
</script>

{#snippet retryIcon()}
  <RetryIcon />
{/snippet}

{#snippet notFoundActions()}
  <Button
    variant="primary"
    color="purple"
    style="flat"
    href={UrlBuilder.home()}
    label={m.link_text_back_to_safety()}
  >
    {m.link_text_back_to_safety()}
  </Button>
{/snippet}

{#snippet retryActions()}
  <Button
    variant="primary"
    color="purple"
    style="flat"
    onclick={() => window.location.reload()}
    label={m.button_label_retry()}
    icon={retryIcon}
  >
    {m.button_text_retry()}
  </Button>
{/snippet}

{#if isNotFound}
  <ErrorScreen
    kicker={m.error_kicker_404()}
    title={m.page_title_error_404()}
    message={m.error_text_404()}
    actions={notFoundActions}
  />
{:else}
  <ErrorScreen
    kicker={m.error_kicker_unexpected_error()}
    title={m.page_title_unexpected_error()}
    message={page.error?.message ?? m.error_text_unexpected_error_short()}
    actions={retryActions}
  />
{/if}
