<script lang="ts">
  import { page } from "$app/state";
  import ImportSourceCards from "$boxed/import/ImportSourceCards.svelte";
  import SettingsCard from "$boxed/settings/SettingsCard.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import DataSettings from "$lib/sections/settings/DataSettings.svelte";
</script>

<SettingsCard
  id="boxed-settings-import"
  title={m.welcome_import_heading()}
  description={m.welcome_import_description()}
>
  <ImportSourceCards
    selected={page.url.searchParams.get("source")}
    isInPlace
  />
</SettingsCard>

<DataSettings />
