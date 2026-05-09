<script lang="ts">
  /*
    A single Letterboxd-style member row: avatar, bold username,
    "activity for film" subtitle slot, optional trailing rating /
    heart cluster. Reference: research/notes/members-popular.md.
  */
  import Link from "$lib/components/link/Link.svelte";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type Member = {
    username: string;
    name: { full?: string; first?: string };
    slug?: string | null;
    avatar?: { url?: string };
  };

  type MemberRowProps = {
    member: Member;
    subtitle?: string;
  };

  const { member, subtitle }: MemberRowProps = $props();

  const href = $derived(
    member.slug ? UrlBuilder.profile.user(member.slug) : "#",
  );
  const avatar = $derived(member.avatar?.url ?? "");
  const displayName = $derived(member.name.full ?? member.username);
</script>

<Link {href} color="inherit">
  <div class="lb-member-row">
    {#if avatar}
      <img class="lb-member-avatar" src={avatar} alt={displayName} loading="lazy" />
    {:else}
      <span class="lb-member-avatar lb-member-avatar-placeholder" aria-hidden="true">
        {(displayName?.[0] ?? "?").toUpperCase()}
      </span>
    {/if}

    <div class="lb-member-info">
      <span class="lb-member-name">{displayName}</span>
      {#if subtitle}
        <span class="lb-member-subtitle">{subtitle}</span>
      {/if}
    </div>
  </div>
</Link>

<style>
  .lb-member-row {
    display: flex;
    align-items: center;
    gap: var(--ni-12);

    padding: var(--ni-12) var(--ni-16);
    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }

  .lb-member-avatar {
    width: var(--ni-32);
    height: var(--ni-32);
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .lb-member-avatar-placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    color: var(--color-text-secondary);
    font-weight: 700;
    font-size: var(--ni-13);
    line-height: 1;
  }

  .lb-member-info {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .lb-member-name {
    color: var(--color-foreground);
    font-weight: 700;
    font-size: var(--ni-14);
  }

  .lb-member-subtitle {
    color: var(--color-text-secondary);
    font-size: var(--ni-10);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
</style>
