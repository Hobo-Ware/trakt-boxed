<script lang="ts">
  import MoreButton from "$lib/components/buttons/more/MoreButton.svelte";
  import { MoreButtonIntlProvider } from "$lib/components/buttons/more/MoreButtonIntlProvider";
  import Card from "$lib/components/card/Card.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type CreditMemberItemProps = {
    member: CreditMember;
    type: ExtendedMediaType;
  };

  const { member, type }: CreditMemberItemProps = $props();
  const maxDescriptionItems = 1;

  let isDescriptionExpanded = $state(false);

  const episodeCount = $derived(
    type === "movie" || type === "episode" ? undefined : member.episodeCount,
  );
  const headshotUrl = $derived.by(() => {
    const url = member.headshot?.url.thumb;
    return url && !PLACEHOLDERS.includes(url) ? url : undefined;
  });
  const cardHeight = $derived(
    headshotUrl ? "var(--ni-80)" : "fit-content",
  );
  const personHref = $derived(UrlBuilder.people(member.key, member.positions));
  const descriptionItems = $derived(member.descriptionItems ?? []);
  const hasCollapsableDescription = $derived(
    descriptionItems.length > maxDescriptionItems,
  );
  const visibleDescriptionItems = $derived(
    isDescriptionExpanded
      ? descriptionItems
      : descriptionItems.slice(0, maxDescriptionItems),
  );
  const omittedDescriptionCount = $derived(
    Math.max(descriptionItems.length - maxDescriptionItems, 0),
  );
</script>

{#snippet avatar()}
  {#if headshotUrl}
    <div class="credit-member-avatar">
      <CrossOriginImage
        src={headshotUrl}
        alt={`${m.image_alt_person_headshot({ person: member.name })}`}
      />
    </div>
  {/if}
{/snippet}

{#snippet tags()}
  {#if episodeCount != null}
    <div class="credit-member-tags">
      <EpisodeCountTag
        count={episodeCount}
        i18n={TagIntlProvider}
        type="tag"
      />
    </div>
  {/if}
{/snippet}

{#snippet plainDetails()}
  <div class="credit-member-details">
    <p class="trakt-card-title bold ellipsis" title={member.name}>
      {member.name}
    </p>
    {#if member.description}
      <p
        class="trakt-card-subtitle trakt-credit-member-description secondary"
      >
        {member.description}
      </p>
    {/if}
    {@render tags()}
  </div>
{/snippet}

{#snippet collapsableDetails()}
  <div class="credit-member-details">
    <Link href={personHref} color="inherit">
      <p class="trakt-card-title bold ellipsis" title={member.name}>
        {member.name}
      </p>
    </Link>
    <div class="trakt-card-subtitle trakt-credit-member-description secondary">
      {#each visibleDescriptionItems as description, index (`${description}-${index}`)}
        <div class="credit-member-description-row">
          <p class="credit-member-description-text">
            {description}
          </p>

          {#if index === maxDescriptionItems - 1}
            <MoreButton
              i18n={MoreButtonIntlProvider}
              label={m.button_label_expand_category({
                category: m.translated_value_job_characters(),
              })}
              count={omittedDescriptionCount}
              onExpand={() => (isDescriptionExpanded = true)}
              onCollapse={() => (isDescriptionExpanded = false)}
            />
          {/if}
        </div>
      {/each}
    </div>
    {@render tags()}
  </div>
{/snippet}

<div class="trakt-credit-member-item" role="listitem">
  <Card
    classList="trakt-credit-member-card"
    variant="transparent"
    eager
    --height-card={cardHeight}
    --width-card="100%"
  >
    {#if hasCollapsableDescription}
      <div
        class="credit-member-card-content"
        data-has-headshot={Boolean(headshotUrl)}
      >
        {#if headshotUrl}
          <Link
            href={personHref}
            color="inherit"
            focusable={false}
            label={member.name}
          >
            {@render avatar()}
          </Link>
        {/if}

        {@render collapsableDetails()}
      </div>
    {:else}
      <Link href={personHref} color="inherit">
        <div
          class="credit-member-card-content"
          data-has-headshot={Boolean(headshotUrl)}
        >
          {@render avatar()}
          {@render plainDetails()}
        </div>
      </Link>
    {/if}
  </Card>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-credit-member-item {
    width: 100%;
    border-bottom: var(--border-thickness-xxs) solid var(--color-border);
  }

  :global(.trakt-credit-member-card) {
    min-width: 0;
    width: 100%;

    :global(.trakt-card-content),
    :global(.trakt-card-content > .trakt-link) {
      display: flex;
      width: 100%;
      height: auto;
      text-decoration: none;
    }

    :global(.trakt-link) {
      text-decoration: none;
    }

    @include for-mouse() {
      :global(.trakt-link:hover .trakt-card-title) {
        text-decoration: underline;
        text-underline-offset: var(--ni-2);
        text-decoration-thickness: var(--ni-2);
        text-decoration-color: var(--color-link-active);
      }
    }
  }

  .credit-member-card-content {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ni-12);

    width: 100%;
    min-width: 0;
    min-height: var(--ni-80);
    padding: var(--ni-8) 0;
    box-sizing: border-box;
  }

  .credit-member-card-content[data-has-headshot="false"] {
    grid-template-columns: minmax(0, 1fr);
    min-height: var(--ni-56);
    padding: var(--ni-10) 0;
  }

  .credit-member-avatar {
    width: var(--ni-44);
    height: var(--ni-64);

    flex-shrink: 0;
    overflow: hidden;

    border-radius: var(--border-radius-xs);
    background-color: var(--color-input-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
  }

  .credit-member-details {
    min-width: 0;
    padding: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .credit-member-card-content[data-has-headshot="false"]
    .credit-member-details {
    padding: 0;
  }

  .credit-member-tags {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    margin-top: var(--ni-2);

    :global(.trakt-tag) {
      height: var(--ni-20);
      box-sizing: border-box;
    }
  }

  .trakt-card-title,
  .trakt-card-subtitle {
    margin: 0;
  }

  .trakt-card-title {
    font-size: var(--ni-14);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .trakt-card-subtitle {
    font-size: var(--ni-12);
    line-height: 1.45;
    color: var(--color-text-secondary);
  }

  .trakt-credit-member-description {
    color: var(--color-text-secondary);
    overflow-wrap: anywhere;
    padding-inline-end: 0;
    white-space: normal;
    word-break: break-word;
  }

  .credit-member-description-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
    column-gap: var(--gap-xxs);
    width: 100%;

    :global(.trakt-button) {
      justify-self: end;
      transform-origin: right center;
    }
  }

  .credit-member-description-text {
    min-width: 0;
    margin: 0;
  }

  :global(.trakt-credit-member-card .trakt-link .trakt-credit-member-description) {
    color: var(--color-text-secondary);
  }
</style>
