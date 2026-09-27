import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type SettingsNavItem = {
  key: string;
  href: string;
  label: () => string;
  match: 'exact' | 'nested';
  isVip?: boolean;
};

export const settingsNavItems: ReadonlyArray<SettingsNavItem> = [
  {
    key: 'profile',
    href: UrlBuilder.settings.general(),
    label: m.page_title_profile,
    match: 'exact',
  },
  {
    key: 'general',
    href: UrlBuilder.settings.generalDetail(),
    label: m.link_text_general_settings,
    match: 'exact',
  },
  {
    key: 'account',
    href: UrlBuilder.settings.account(),
    label: m.link_text_account_settings,
    match: 'exact',
  },
  {
    key: 'data',
    href: UrlBuilder.settings.data(),
    label: m.boxed_settings_import_export,
    match: 'exact',
  },
  {
    key: 'streaming',
    href: UrlBuilder.settings.streamingServices(),
    label: m.header_streaming_services,
    match: 'nested',
  },
  {
    key: 'plex',
    href: UrlBuilder.settings.plex(),
    label: m.link_text_plex_settings,
    match: 'exact',
  },
  {
    key: 'apps',
    href: UrlBuilder.settings.appsConnected(),
    label: m.limit_title_connected_apps,
    match: 'nested',
  },
  {
    key: 'advanced',
    href: UrlBuilder.settings.advanced(),
    label: m.link_text_advanced_settings,
    match: 'exact',
  },
  {
    key: 'preview',
    href: UrlBuilder.settings.preview(),
    label: m.header_preview_features,
    match: 'exact',
  },
  {
    key: 'vip',
    href: UrlBuilder.vip(),
    label: m.tag_text_vip,
    match: 'exact',
    isVip: true,
  },
];
