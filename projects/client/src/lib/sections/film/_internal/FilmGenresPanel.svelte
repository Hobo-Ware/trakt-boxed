<script lang="ts">
  import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

  type Props = { media: MediaEntry };
  const { media }: Props = $props();
</script>

<ul class="film-genres">
  {#each media.genres as genre (genre)}
    <li>
      <a class="film-genres__chip" href="/discover?genre={genre}">
        {genre.replace(/-/g, ' ')}
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  .film-genres {
    list-style: none;
    margin: 0;
    padding: var(--gap-m) 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);

    &__chip {
      display: inline-block;
      padding: 0.3rem 0.8rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--shade-900) 80%, transparent);
      color: var(--color-text-primary);
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
      border: 1px solid color-mix(in srgb, var(--shade-10) 6%, transparent);

      &:hover {
        color: var(--color-background-green, var(--green-500));
        border-color: var(--color-background-green, var(--green-500));
      }
    }
  }
</style>
