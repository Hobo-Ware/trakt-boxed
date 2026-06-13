<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
</script>

<section class="lists-hero">
  <p class="lists-hero__copy">{m.lists_hero_copy()}</p>
  <a class="lists-hero__cta" href="/lists/smart/create">{m.lists_hero_cta()}</a>
</section>

<style lang="scss">
  .lists-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);
    padding: clamp(40px, 6vw, 80px) clamp(16px, 3vw, 32px) clamp(20px, 4vw, 40px);
    text-align: center;
  }

  .lists-hero__copy {
    margin: 0;
    font-size: clamp(1rem, 1.6vw, 1.25rem);
    color: var(--color-text-primary);
    max-width: 60ch;
    line-height: 1.45;
  }

  .lists-hero__cta {
    display: inline-block;
    padding: 0.6rem 1.4rem;
    border-radius: 3px;
    background: var(--color-background-green, var(--green-500));
    color: var(--shade-1000);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;

    &:hover { background: var(--green-400); }
  }
</style>
