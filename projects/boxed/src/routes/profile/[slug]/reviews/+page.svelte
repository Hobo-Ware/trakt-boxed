<script lang="ts">
  import ProfileShell from "$boxed/profile/ProfileShell.svelte";
  import ReviewsView from "$boxed/profile/reviews/ReviewsView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#key params.slug}
  <ProfileShell
    slug={params.slug}
    tab="reviews"
    title={(name) => m.boxed_profile_reviews_title({ name })}
  >
    {#snippet children(context)}
      <ReviewsView {context} />
    {/snippet}
  </ProfileShell>
{/key}
