import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';

const TRAILING_ROLES = new Set<CrewPosition>(['self', 'narrator', 'unknown']);

type RoleCount = { position: CrewPosition; count: number };

const rank = (role: RoleCount, knownFor: CrewPosition | Nil) => {
  if (role.position === knownFor) return 0;
  if (TRAILING_ROLES.has(role.position)) return 2;
  return 1;
};

export function toRoleOrder(
  credits: MediaCredits | undefined,
  knownFor: CrewPosition | Nil,
): ReadonlyArray<RoleCount> {
  return Array.from(credits?.entries() ?? [])
    .map(([position, list]) => ({ position, count: list.length }))
    .filter((role) => role.count > 0)
    .toSorted((a, b) =>
      rank(a, knownFor) - rank(b, knownFor) || b.count - a.count
    );
}
