<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { YirListProgress } from "$lib/requests/models/YirDetail.ts";

  const RINGS = 3;

  const { lists }: { lists: ReadonlyArray<YirListProgress> | null } = $props();
</script>

<ul class="boxed-list-progress">
  {#if lists === null}
    {#each { length: RINGS }, index (index)}
      <li aria-hidden="true">
        <span class="progress-ring" style:--progress="0%"></span>
      </li>
    {/each}
  {:else if lists.length === 0}
    <li class="progress-empty">{m.boxed_profile_empty()}</li>
  {:else}
    {#each lists as list (list.id)}
      <li>
        <span
          class="progress-ring"
          style:--progress={`${Math.round(list.percentage)}%`}
        >
          <span class="progress-value">{Math.round(list.percentage)}%</span>
        </span>
        <span class="progress-text">
          <span class="progress-title">{list.title}</span>
          <span class="progress-count">
            {m.yir_label_watched_of({
              watched: String(list.watched),
              total: String(list.total),
            })}
          </span>
        </span>
      </li>
    {/each}
  {/if}
</ul>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .boxed-list-progress {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--ni-16);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--ni-16);
      min-height: var(--ni-80);
      padding: var(--ni-18);
      border-radius: var(--border-radius-m);
      background: var(--color-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    }
  }

  .progress-ring {
    flex-shrink: 0;
    width: var(--ni-80);
    height: var(--ni-80);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: conic-gradient(
      var(--purple-500) 0 var(--progress),
      var(--color-border) var(--progress) 100%
    );
  }

  .progress-value {
    width: var(--ni-64);
    height: var(--ni-64);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-card-background);
    font-family: var(--boxed-font-title);
    font-size: var(--ni-20);
    font-weight: 600;
  }

  .progress-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .progress-title {
    font-size: var(--ni-14);
    font-weight: 500;
  }

  .progress-count {
    font-family: "Roboto Mono", monospace;
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .boxed-list-progress li.progress-empty {
    grid-column: 1 / -1;
    justify-content: center;
    color: var(--color-text-secondary);
  }
</style>
