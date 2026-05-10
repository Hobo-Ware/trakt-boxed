<script lang="ts">
  /*
    People detail route. Reads the position filter ("movies",
    "shows") off the URL search params and lets PeopleSummary
    decide what to render. No mutations to the data hook.
  */
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { crewPositionSchema } from "$lib/requests/models/CrewPosition";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import PeopleSummary from "$lib/sections/summary/PeopleSummary.svelte";
  import type { PageProps } from "./$types";
  import { usePerson } from "./usePerson";

  const { params }: PageProps = $props();
  const { person, isLoading } = $derived(usePerson(params.slug));

  const mapToCrewPosition = (value: string | Nil) =>
    crewPositionSchema.safeParse(value?.toLowerCase()).data;

  const positions = $derived.by(() => ({
    movies: mapToCrewPosition(page.url.searchParams.get("movies")),
    shows: mapToCrewPosition(page.url.searchParams.get("shows")),
  }));
</script>

<TraktPage
  audience="all"
  title={$person?.name}
  image={$person?.headshot?.url.medium}
>
  <RenderFor audience="authenticated">
    <NavbarStateSetter mode="minimal" />
  </RenderFor>

  {#if !$isLoading && $person}
    <PeopleSummary person={$person} {positions} />
  {/if}
</TraktPage>
