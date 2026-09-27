import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import type { PosterSize } from './PosterSize.ts';

const STORAGE_KEY = 'boxed-chart-poster-size';

const toPosterSize = (value: string | null): PosterSize =>
  value === 'small' ? 'small' : 'large';

const size = new BehaviorSubject<PosterSize>(
  toPosterSize(safeLocalStorage.getItem(STORAGE_KEY)),
);

export function usePosterSize() {
  return {
    size: size.asObservable(),
    setSize: (next: PosterSize) => {
      safeLocalStorage.setItem(STORAGE_KEY, next);
      size.next(next);
    },
  };
}
