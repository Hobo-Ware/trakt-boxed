<script lang="ts">
  import type { TitleFact } from "./TitleFact.ts";

  const { facts }: { facts: ReadonlyArray<TitleFact> } = $props();
</script>

<dl class="boxed-title-facts">
  {#each facts as fact (fact.key)}
    <div class="boxed-title-fact">
      <dt>{fact.label}</dt>
      <dd>{fact.value}</dd>
    </div>
  {/each}
</dl>

<style>
  .boxed-title-facts {
    margin: 0;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-176), 1fr));
    gap: var(--ni-12) var(--ni-24);
  }

  .boxed-title-fact {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;

    dt {
      font-size: var(--ni-11);
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    dd {
      margin: 0;
      font-size: var(--ni-14);
      color: var(--color-text-primary);
    }
  }
</style>
