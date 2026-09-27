<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<span class="boxed-vip-chip">{m.tag_text_vip()}</span>

<style lang="scss">
  .boxed-vip-chip {
    padding: var(--ni-2) var(--ni-6);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--shade-10);

    font-size: var(--ni-10);
    font-weight: 700;
    letter-spacing: 0.06em;
  }
</style>
