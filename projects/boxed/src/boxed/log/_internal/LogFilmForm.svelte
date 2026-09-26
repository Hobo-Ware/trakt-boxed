<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePostNote } from "$lib/features/notes/usePostNote.ts";
  import type { MarkAsWatchedAt } from "$lib/models/MarkAsWatchedAt.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore.ts";
  import { useCheckIn } from "$lib/sections/media-actions/check-in/useCheckIn.ts";
  import { useFavorites } from "$lib/sections/media-actions/favorite/useFavorites.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts";
  import { usePostComment } from "$lib/sections/summary/components/comments/usePostComment.ts";
  import { useRatings } from "$lib/sections/summary/components/rating/useRatings.ts";
  import LogField from "./LogField.svelte";
  import LogRating from "./LogRating.svelte";
  import LogWatchDate from "./LogWatchDate.svelte";
  import type { LogStep } from "./LogStep.ts";
  import { isReviewTooShort, planLog, type LogDraft } from "./planLog.ts";

  const { media, onDone }: { media: MediaEntry; onDone: () => void } =
    $props();

  const { history, ratings, favorites } = useUser();

  const target = $derived({ type: "movie" as const, media });
  const { markAsWatched } = $derived(
    useMarkAsWatched({ ...target, isToastEnabled: false }),
  );
  const { checkin, isCheckingIn, isWatchable } = $derived(useCheckIn(target));
  const { addRating, removeRating } = $derived(
    useRatings({ type: "movie", id: media.id }),
  );
  const { addToFavorites, removeFromFavorites } = $derived(
    useFavorites({
      type: "movie",
      id: media.id,
      title: media.title,
      isToastEnabled: false,
    }),
  );
  const { postComment } = usePostComment();
  const { postNote } = usePostNote();
  const { notify } = useActionToast();

  const baseline = $derived({
    rating: $ratings?.movies.get(media.id)?.rating ?? null,
    isLiked: $favorites?.movies.has(media.id) ?? false,
  });
  const isRewatch = $derived($history?.movies.has(media.id) ?? false);

  let draft: LogDraft = $state({
    logWatch: true,
    watchedAt: "now",
    rating: null,
    isLiked: false,
    review: "",
    isSpoiler: false,
    note: "",
  });
  let hasSeededBaseline = false;
  let isSaving = $state(false);
  let hasSaveFailed = $state(false);

  $effect(() => {
    if (hasSeededBaseline || $ratings === undefined) return;

    hasSeededBaseline = true;
    draft.rating = baseline.rating;
    draft.isLiked = baseline.isLiked;
  });

  const reviewTooShort = $derived(isReviewTooShort(draft.review));

  const runStep = async (step: LogStep) => {
    switch (step.kind) {
      case "watch":
        return await markAsWatched(step.at);
      case "rate":
        return addRating(step.rating);
      case "unrate":
        return await removeRating();
      case "like":
        return await addToFavorites();
      case "unlike":
        return await removeFromFavorites();
      case "review":
        return await postComment({
          commentType: "post",
          type: "movie",
          media,
          comment: step.text,
          isSpoiler: step.isSpoiler,
          gif: null,
        });
      case "note":
        return await postNote({
          media: { type: "movie", id: media.id },
          notes: step.text,
          type: "note",
        });
    }
  };

  const save = async () => {
    if (reviewTooShort || isSaving) return;

    isSaving = true;
    hasSaveFailed = false;
    try {
      const steps = planLog({ draft, baseline, canLike: true });
      for (const step of steps) {
        await runStep(step);
      }
      notify({ message: m.boxed_log_saved() });
      onDone();
    } catch {
      hasSaveFailed = true;
    } finally {
      isSaving = false;
    }
  };

  const startCheckIn = async () => {
    await checkin();
    onDone();
  };

  const openLists = () =>
    manageListsDrawerStore.open({
      target: { type: "movie", media },
      title: media.title,
    });

  const setWatchedAt = (at: MarkAsWatchedAt) => (draft.watchedAt = at);
</script>

<form
  class="boxed-log-form"
  onsubmit={(event) => {
    event.preventDefault();
    save();
  }}
>
  <div class="boxed-log-poster">
    <CrossOriginImage
      src={media.poster.url.medium}
      alt={m.image_alt_media_poster({ title: media.title })}
      loading="eager"
    />
  </div>

  <div class="boxed-log-body">
    <header class="boxed-log-header">
      <span class="boxed-log-eyebrow">{m.boxed_log_eyebrow()}</span>
      <h2 class="boxed-log-title">
        {media.title}
        {#if media.year}<span class="boxed-log-year">{media.year}</span>{/if}
      </h2>
    </header>

    <div class="boxed-log-row">
      <label class="boxed-log-check">
        <input type="checkbox" bind:checked={draft.logWatch} />
        <span>{m.boxed_log_add_to_diary()}</span>
      </label>
      {#if isRewatch}
        <span class="boxed-log-chip">{m.boxed_log_rewatch()}</span>
      {/if}
      {#if isWatchable}
        <button
          type="button"
          class="boxed-log-secondary"
          disabled={$isCheckingIn}
          onclick={startCheckIn}
        >
          <span class="boxed-log-live" aria-hidden="true"></span>
          {m.button_text_checkin()}
        </button>
      {/if}
    </div>

    {#if draft.logWatch}
      <LogWatchDate value={draft.watchedAt} onChange={setWatchedAt} />
    {/if}

    <div class="boxed-log-grid">
      <LogField label={m.boxed_log_review_label()} forId="boxed-log-review">
        <textarea
          id="boxed-log-review"
          rows="6"
          placeholder={m.boxed_log_review_placeholder()}
          bind:value={draft.review}
          aria-invalid={reviewTooShort}
        ></textarea>
        <div class="boxed-log-review-foot">
          <label class="boxed-log-check">
            <input type="checkbox" bind:checked={draft.isSpoiler} />
            <span>{m.boxed_log_contains_spoilers()}</span>
          </label>
          <span class="boxed-log-hint" class:is-error={reviewTooShort}>
            {#if reviewTooShort}{m.boxed_log_review_too_short()}{/if}
          </span>
        </div>
      </LogField>

      <div class="boxed-log-side">
        <LogRating
          rating={draft.rating}
          onChange={(rating) => (draft.rating = rating)}
        />

        <button
          type="button"
          class="boxed-log-like"
          aria-pressed={draft.isLiked}
          onclick={() => (draft.isLiked = !draft.isLiked)}
        >
          <FavoriteIcon state={draft.isLiked ? "filled" : "open"} />
          <span>{m.boxed_log_like()}</span>
        </button>

        <button type="button" class="boxed-log-secondary" onclick={openLists}>
          {m.button_text_manage_lists()}
        </button>
      </div>
    </div>

    <LogField label={m.boxed_log_note_label()} forId="boxed-log-note">
      <input
        id="boxed-log-note"
        type="text"
        maxlength="500"
        bind:value={draft.note}
      />
      <span class="boxed-log-hint">{m.boxed_log_note_hint()}</span>
    </LogField>

    {#if hasSaveFailed}
      <p class="boxed-log-error" role="alert">{m.boxed_log_save_failed()}</p>
    {/if}

    <footer class="boxed-log-footer">
      <button type="button" class="boxed-log-secondary" onclick={onDone}>
        {m.button_text_cancel()}
      </button>
      <button
        type="submit"
        class="boxed-log-primary"
        disabled={isSaving || reviewTooShort || $isCheckingIn}
      >
        {m.boxed_log_save()}
      </button>
    </footer>
  </div>
</form>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./logForm" as *;

  @include log-form;
  @include log-film-extras;
</style>
