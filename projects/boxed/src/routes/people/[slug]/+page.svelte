<script lang="ts">
  import PageContainer from "$boxed/components/PageContainer.svelte";
  import PersonCredits from "$boxed/person/PersonCredits.svelte";
  import PersonHeader from "$boxed/person/PersonHeader.svelte";
  import { usePerson } from "$routes/people/[slug]/usePerson.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { person, isLoading } = usePerson(fromRune(() => params.slug));

  const loadedPerson = $derived($isLoading ? null : ($person ?? null));
</script>

<TraktPage
  audience="all"
  title={$person?.name}
  image={$person?.headshot?.url.medium}
>
  <PageContainer>
    <PersonHeader person={loadedPerson} />
    {#key params.slug}
      <PersonCredits
        slug={params.slug}
        knownFor={$isLoading ? undefined : ($person?.knownFor ?? null)}
      />
    {/key}
  </PageContainer>
</TraktPage>
