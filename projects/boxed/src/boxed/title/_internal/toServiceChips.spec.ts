import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import { describe, expect, it } from 'vitest';
import { toServiceChips } from './toServiceChips.ts';

const base = (source: string) => ({
  link: `https://example.com/${source}` as const,
  source,
  is4k: false,
});

const streaming = (source: string) => ({
  ...base(source),
  type: 'streaming' as const,
  key: `streaming-${source}`,
});

const free = (source: string) => ({
  ...base(source),
  type: 'free' as const,
  key: `free-${source}`,
});

const onDemand = (source: string) => ({
  ...base(source),
  type: 'on-demand' as const,
  key: `on-demand-${source}`,
  prices: { rent: 3.99 },
});

describe('util: toServiceChips', () => {
  it('should list subscription, free, then on-demand services, one per source', () => {
    const streamOn: StreamOn = {
      services: {
        streaming: [streaming('max')],
        free: [free('tubi')],
        onDemand: [onDemand('apple_tv'), onDemand('max')],
      },
    };

    expect(toServiceChips(streamOn, 5).map((chip) => chip.service.key))
      .toEqual(['streaming-max', 'free-tubi', 'on-demand-apple_tv']);
  });

  it('should put the preferred service first and cap the list', () => {
    const streamOn: StreamOn = {
      services: {
        streaming: [
          streaming('max'),
          streaming('netflix'),
        ],
        free: [],
        onDemand: [],
      },
      preferred: streaming('netflix'),
    };

    const chips = toServiceChips(streamOn, 1);

    expect(chips).toHaveLength(1);
    expect(chips.at(0)).toMatchObject({
      isPreferred: true,
      service: { source: 'netflix' },
    });
  });

  it('should return nothing without services', () => {
    expect(toServiceChips(undefined, 3)).toEqual([]);
    expect(toServiceChips({}, 3)).toEqual([]);
  });
});
