<script lang="ts">
  import { lineClamp } from "$lib/components/text/lineClamp";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { Marked } from "marked";
  import { createHeadingRenderer } from "./marked/createHeadingRenderer";
  import { createParagraphRenderer } from "./marked/createParagraphRenderer";

  const maxPreviewLines = 3;

  type CommentBodyProps = {
    comment: MediaComment;
    type: "full" | "preview";
    onClick?: () => void;
  };

  const { comment, type, onClick }: CommentBodyProps = $props();

  const marked = $derived(
    new Marked({
      renderer: {
        paragraph: createParagraphRenderer(),
        heading: createHeadingRenderer(),
      },
    }),
  );
</script>

{#snippet commentText()}
  {@html marked.parse(comment.comment, { gfm: true, breaks: true })}
{/snippet}

{#if type === "full"}
  <div class="trakt-comment">
    {@render commentText()}
  </div>
{:else}
  <button class="trakt-comment-preview" onclick={onClick}>
    <div
      class="trakt-comment trakt-comment-preview-content"
      use:lineClamp={{ lines: maxPreviewLines }}
      style="--max-lines: {maxPreviewLines}"
    >
      {@render commentText()}
    </div>
  </button>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    font-size: var(--font-size-text);

    :global(a) {
      @include default-link-style;
    }

    :global(p),
    :global(li) {
      font-size: inherit;
    }

    :global(.trakt-comment-heading) {
      text-transform: none;
      text-decoration: underline;
    }
  }

  .trakt-comment-preview {
    --preview-height: var(--ni-52);

    all: unset;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    display: flex;
    height: var(--preview-height);

    .trakt-comment-preview-content {
      :global(p) {
        line-height: calc(var(--preview-height) / var(--max-lines));
      }
    }
  }
</style>
