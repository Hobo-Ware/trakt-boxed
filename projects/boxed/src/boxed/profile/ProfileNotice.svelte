<script lang="ts">
  const { title, text }: { title?: string; text: string } = $props();
</script>

<div class="boxed-profile-notice">
  {#if title}<p class="notice-title">{title}</p>{/if}
  <p>{text}</p>
</div>

<style>
  .boxed-profile-notice {
    min-height: var(--ni-240);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
    text-align: center;
    color: var(--color-text-secondary);

    p {
      margin: 0;
      max-width: var(--ni-480);
      line-height: 1.5;
    }

    .notice-title {
      font-family: var(--boxed-font-title);
      font-size: var(--ni-22);
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }
</style>
