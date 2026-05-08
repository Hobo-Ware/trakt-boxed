<script lang="ts">
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import AddNewListButton from "./CreateListButton.svelte";

  const { isLoading } = useAllPersonalLists();
</script>

<AddNewListButton isLoading={$isLoading} />
