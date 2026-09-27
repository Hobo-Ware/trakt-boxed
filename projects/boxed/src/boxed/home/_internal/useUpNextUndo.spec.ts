import { UpNextMappedMock } from '$mocks/data/sync/mapped/UpNextMappedMock.ts';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUpNextUndo } from './useUpNextUndo.ts';

const entry = UpNextMappedMock.at(0);

describe('store: useUpNextUndo', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should remember the last marked entry', async () => {
    if (!entry) throw new Error('missing mock');
    const { lastMark, remember, clear } = useUpNextUndo();

    remember(entry);

    expect(await firstValueFrom(lastMark)).toBe(entry);
    clear(entry);
  });

  it('should forget the entry after the undo window', async () => {
    if (!entry) throw new Error('missing mock');
    const { lastMark, remember } = useUpNextUndo();

    remember(entry);
    vi.advanceTimersByTime(5000);

    expect(await firstValueFrom(lastMark)).toBeNull();
  });

  it('should keep a newer entry when an older one is cleared', async () => {
    if (!entry) throw new Error('missing mock');
    const newer = { ...entry, id: -1 };
    const { lastMark, remember, clear } = useUpNextUndo();

    remember(entry);
    remember(newer);
    clear(entry);

    expect(await firstValueFrom(lastMark)).toBe(newer);
    clear(newer);
  });
});
