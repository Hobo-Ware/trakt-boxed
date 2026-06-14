<script lang="ts">
  import { page } from '$app/state';
  import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
  import * as m from '$lib/features/i18n/messages.ts';
  import RenderForFeature from '$lib/guards/RenderForFeature.svelte';
  import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

  type Tab = { key: string; label: string; href: string };

  const baseTabs: Tab[] = [
    { key: 'general', label: m.link_text_general_settings(), href: UrlBuilder.settings.general() },
    { key: 'data', label: m.link_text_data_settings(), href: UrlBuilder.settings.data() },
    { key: 'preview', label: m.link_text_preview_settings(), href: UrlBuilder.settings.preview() },
  ];

  const streamingTab: Tab = {
    key: 'streaming-sync',
    label: m.link_text_streaming_sync_settings(),
    href: UrlBuilder.settings.streamingSync(),
  };

  const isActive = (href: string) => {
    const path = page.url.pathname;
    if (href === '/settings') return path === '/settings';
    return path === href || path.startsWith(`${href}/`);
  };
</script>

<nav class="lb-settings-subnav" aria-label="Settings sections">
  {#each baseTabs as tab (tab.key)}
    <a
      class="lb-settings-subnav__tab"
      data-active={isActive(tab.href) ? 'true' : undefined}
      href={tab.href}
    >{tab.label}</a>
  {/each}
  <RenderForFeature flag={FeatureFlag.StreamingSync}>
    {#snippet enabled()}
      <a
        class="lb-settings-subnav__tab"
        data-active={isActive(streamingTab.href) ? 'true' : undefined}
        href={streamingTab.href}
      >{streamingTab.label}</a>
    {/snippet}
  </RenderForFeature>
</nav>

<style lang="scss">
  .lb-settings-subnav {
    display: flex;
    gap: var(--gap-l);
    border-bottom: 1px solid color-mix(in srgb, var(--shade-10) 8%, transparent);
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }

    &__tab {
      cursor: pointer;
      padding: 12px 0;
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-decoration: none;
      position: relative;
      flex-shrink: 0;

      &:hover { color: var(--color-text-primary); }

      &[data-active='true'] {
        color: var(--color-text-primary);

        &::after {
          content: '';
          position: absolute;
          inset: auto 0 -1px 0;
          height: 2px;
          background: var(--color-watched);
        }
      }
    }
  }
</style>
