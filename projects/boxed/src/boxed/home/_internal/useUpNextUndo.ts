import type { UpNextEntry } from '$lib/requests/models/UpNextEntry.ts';
import { BehaviorSubject } from 'rxjs';

const UNDO_WINDOW_MS = 5000;

const LAST_MARK_SOURCE = new BehaviorSubject<UpNextEntry | null>(null);

let expiry: ReturnType<typeof setTimeout> | undefined;

function clear(entry: UpNextEntry) {
  if (LAST_MARK_SOURCE.value !== entry) return;

  clearTimeout(expiry);
  LAST_MARK_SOURCE.next(null);
}

function remember(entry: UpNextEntry) {
  clearTimeout(expiry);
  LAST_MARK_SOURCE.next(entry);
  expiry = setTimeout(() => clear(entry), UNDO_WINDOW_MS);
}

export function useUpNextUndo() {
  return {
    lastMark: LAST_MARK_SOURCE.asObservable(),
    remember,
    clear,
  };
}
