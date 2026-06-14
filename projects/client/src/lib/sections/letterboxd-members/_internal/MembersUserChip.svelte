<script lang="ts">
  import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Props = { user: UserProfile };
  const { user }: Props = $props();

  const name = $derived(user.name?.full || `@${user.username}`);
  const href = $derived(UrlBuilder.profile.user(user.slug ?? user.username));
</script>

<a class="members-chip" {href} aria-label={name}>
  <span class="members-chip__avatar">
    {#if user.avatar?.url}
      <img src={user.avatar.url} alt="" loading="lazy" />
    {:else}
      <span aria-hidden="true">{name.charAt(0)}</span>
    {/if}
  </span>
  <span class="members-chip__name">{name}</span>
</a>

<style lang="scss">
  .members-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 4px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--shade-900) 80%, transparent);
    border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);
    color: var(--color-text-primary);
    text-decoration: none;
    font-size: 0.85rem;

    &__avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--shade-900) 60%, transparent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-family-serif, Georgia, serif);
      font-size: 0.85rem;
      color: var(--color-text-secondary);

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    &__name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 14ch;
    }

    &:hover {
      border-color: var(--color-watched);
    }
  }
</style>
