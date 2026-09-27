import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';

export type ServiceChipModel = {
  service: StreamingServiceOption;
  isPreferred: boolean;
};

export function toServiceChips(
  streamOn: StreamOn | Nil,
  limit: number,
): ReadonlyArray<ServiceChipModel> {
  const services = streamOn?.services;
  if (!services) return [];

  const preferredKey = streamOn.preferred?.key;
  const ordered: ReadonlyArray<StreamingServiceOption> = [
    ...services.streaming,
    ...services.free,
    ...services.onDemand,
  ];

  const unique = ordered.filter((service, index) =>
    ordered.findIndex((other) => other.source === service.source) === index
  );

  return unique
    .map((service) => ({ service, isPreferred: service.key === preferredKey }))
    .toSorted((a, b) => Number(b.isPreferred) - Number(a.isPreferred))
    .slice(0, limit);
}
