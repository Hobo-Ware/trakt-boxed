<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { isDrawerNavigation } from "./isDrawerNavigation.ts";

  beforeNavigate((nav) => {
    if (nav.type !== "link") return;
    if (!nav.from || !nav.to) return;
    if (!isDrawerNavigation({ from: nav.from.url, to: nav.to.url })) return;

    nav.cancel();
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(nav.to.url, { noScroll: true, replaceState: true, keepFocus: true });
  });
</script>
