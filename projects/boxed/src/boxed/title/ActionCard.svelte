<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamOn } from "$lib/requests/models/StreamOn.ts";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore.ts";
  import { logComposerStore } from "../log/logComposerStore.ts";
  import type { PosterMedia } from "../poster/PosterMedia.ts";
  import ActionShell from "./ActionShell.svelte";
  import ActionRating from "./ActionRating.svelte";
  import ActionRow from "./ActionRow.svelte";
  import ActionToggles from "./_internal/ActionToggles.svelte";
  import ShareAction from "./ShareAction.svelte";
  import WhereToWatchRow from "./_internal/WhereToWatchRow.svelte";

  type ActionCardProps = {
    media: PosterMedia | undefined;
    streamOn: StreamOn | undefined;
    whereToWatchHref: string;
    activityHref: string;
    shareText: string;
  };

  const {
    media,
    streamOn,
    whereToWatchHref,
    activityHref,
    shareText,
  }: ActionCardProps = $props();

  const { isAuthorized } = useAuth();
</script>

<ActionShell label={media?.title}>
  {#snippet header()}
    <div class="boxed-action-toggles">
      {#if media}
        <ActionToggles {media} />
      {:else}
        {#each { length: 3 }, index (index)}
          <div class="boxed-action-toggle-skeleton">
            <Skeleton
              width="var(--ni-30)"
              height="var(--ni-30)"
              radius="var(--border-radius-m)"
            />
            <Skeleton width="var(--ni-56)" height="var(--ni-12)" />
          </div>
        {/each}
      {/if}
    </div>
  {/snippet}

  {#snippet rating()}
    {#if media}
      <ActionRating type={media.type} id={media.id} />
    {:else}
      <Skeleton width="var(--ni-160)" height="var(--ni-48)" />
    {/if}
  {/snippet}

  <div class="boxed-action-rows">
    {#if $isAuthorized}
      <ActionRow
        onclick={() => media && logComposerStore.compose({ type: media.type, media })}
      >
        {m.boxed_title_log_or_review()}
      </ActionRow>
    {/if}
    <div class="boxed-action-compact" class:is-second={$isAuthorized}>
      <ActionRow href={whereToWatchHref}>
        {m.button_text_where_to_watch()}
      </ActionRow>
    </div>
    {#if $isAuthorized}
      <ActionRow
        onclick={() =>
          media &&
          manageListsDrawerStore.open({
            target: { type: media.type, media },
            title: media.title,
          })}
      >
        {m.button_text_manage_lists()}
      </ActionRow>
    {/if}
    <div class="boxed-action-full">
      <WhereToWatchRow
        {streamOn}
        isLoading={!media || streamOn === undefined}
        href={whereToWatchHref}
      />
    </div>
    <div class="boxed-action-share">
      <ShareAction title={media?.title ?? ""} text={shareText} />
    </div>
    {#if $isAuthorized}
      <div class="boxed-action-activity">
        <ActionRow href={activityHref}>{m.boxed_title_your_activity()}</ActionRow>
      </div>
    {/if}
  </div>
</ActionShell>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-action-toggles {
    box-sizing: border-box;
    height: var(--ni-88);
    padding: var(--ni-8);

    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .boxed-action-toggle-skeleton {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-6);
  }

  .boxed-action-rows {
    display: flex;
    flex-direction: column;
  }

  .boxed-action-compact {
    display: none;
  }

  @include for-tablet-lg-and-below {
    .boxed-action-rows {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));

    }

    .boxed-action-compact {
      display: block;
    }

    .boxed-action-compact.is-second,
    .boxed-action-share {
      border-inline-start: var(--border-thickness-xxs) solid var(--color-border);
    }

    .boxed-action-full {
      display: none;
    }

    .boxed-action-activity {
      grid-column: 1 / -1;
    }
  }
</style>
