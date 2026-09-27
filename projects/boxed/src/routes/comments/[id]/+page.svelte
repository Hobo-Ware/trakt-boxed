<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import ReviewPage from "$boxed/review/ReviewPage.svelte";
  import type { ReviewTarget } from "$boxed/review/ReviewTarget.ts";
  import { useCommentItem } from "$routes/comments/[id]/useCommentItem.ts";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { directCommentTargetUrl } from "$lib/sections/summary/directCommentTargetUrl.ts";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const commentId = $derived(Number(params.id));
  const { target, isLoading } = useCommentItem(fromRune(() => commentId));

  const reviewTarget = $derived(
    $target && $target.type !== "list" ? ($target as ReviewTarget) : null,
  );
</script>

{#if $target?.type === "list"}
  <Redirect to={directCommentTargetUrl({ commentId, target: $target })} />
{:else if !$isLoading && !$target}
  <Error404Page />
{:else}
  <TraktPage
    audience="all"
    image={DEFAULT_SHARE_COVER}
    title={m.dialog_title_comment()}
    hasDynamicContent={true}
  >
    <PageContainer>
      {#key commentId}
        <ReviewPage {commentId} target={reviewTarget} />
      {/key}
    </PageContainer>
  </TraktPage>
{/if}
