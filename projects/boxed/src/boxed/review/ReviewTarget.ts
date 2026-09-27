import type { DirectCommentTarget } from '$lib/requests/models/DirectCommentTarget.ts';

export type ReviewTarget = Exclude<DirectCommentTarget, { type: 'list' }>;
