<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ProfilePageBanner from "$lib/sections/profile-banner/ProfilePageBanner.svelte";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";
  import MonthToDate from "./MonthToDate.svelte";
  import ThisMonth from "./ThisMonth.svelte";
  import ThisYear from "./ThisYear.svelte";

  const { profile, slug }: DisplayableProfileProps = $props();
</script>

<div class="trakt-profile-details">
  <ProfilePageBanner {profile} {slug} />

  <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
    <div class="trakt-profile-details-item">
      <ThisMonth {slug} />
    </div>
    <div class="trakt-profile-details-item">
      <ThisYear {slug} source="profile" />
    </div>
  </RenderFor>

  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    <MonthToDate {slug} />
  </RenderFor>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-details {
    --details-column-count: 3;
    --profile-details-gap: var(--gap-l);

    width: 100%;
    height: 100%;
    overflow: hidden;

    display: grid;
    grid-template-columns: repeat(var(--details-column-count), minmax(0, 1fr));
    gap: var(--profile-details-gap);

    @include for-tablet-lg {
      --details-column-count: 2;
    }

    @include for-tablet-sm-and-below {
      overflow: visible;
      gap: var(--gap-s);
      --details-column-count: 1;
    }
  }

  .trakt-profile-details-item {
    position: relative;
    box-sizing: border-box;
    width: 100%;

    display: flex;
    justify-content: center;

    &::before {
      content: "";
      position: absolute;
      left: calc(-0.5 * var(--profile-details-gap));
      top: 0;
      bottom: 0;
      width: var(--ni-1);
      background: color-mix(in srgb, var(--color-border) 50%, transparent);
    }
  }
</style>
