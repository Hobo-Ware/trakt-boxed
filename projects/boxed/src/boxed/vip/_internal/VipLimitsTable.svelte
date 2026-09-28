<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { mapToUpsellLimits } from "$lib/sections/vip/utils/mapToUpsellLimits.ts";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";

  const { limits } = useUser();

  const rows = $derived(mapToUpsellLimits($limits));
</script>

{#snippet value(limit: number)}
  {#if $limits}
    {toGroupedNumber(limit, languageTag())}
  {:else}
    <Skeleton width="var(--ni-40)" height="var(--ni-12)" />
  {/if}
{/snippet}

<table class="boxed-vip-limits">
  <thead>
    <tr>
      <th scope="col">{m.boxed_vip_limits_limit()}</th>
      <th scope="col">{m.boxed_vip_limits_free()}</th>
      <th scope="col" class="is-vip">{m.tag_text_vip()}</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as row (row.title)}
      <tr>
        <th scope="row">{row.title()}</th>
        <td>{@render value(row.limits.free)}</td>
        <td class="is-vip">{@render value(row.limits.vip)}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .boxed-vip-limits {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--ni-14);

    th,
    td {
      height: var(--ni-44);
      padding: 0;
      border-bottom: var(--border-thickness-xxs) solid var(--color-border);
      text-align: start;
      font-weight: 400;
    }

    td {
      width: var(--ni-80);
      text-align: end;
      font-family: var(--boxed-font-mono);
      font-variant-numeric: tabular-nums;
      color: var(--color-text-secondary);

      :global(> *) {
        margin-inline-start: auto;
      }
    }

    thead th {
      height: var(--ni-32);
      font-size: var(--ni-12);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    thead th:not(:first-child) {
      text-align: end;
    }

    tbody th {
      color: var(--color-text-primary);
    }

    .is-vip {
      color: var(--boxed-color-accent-text);
    }
  }
</style>
