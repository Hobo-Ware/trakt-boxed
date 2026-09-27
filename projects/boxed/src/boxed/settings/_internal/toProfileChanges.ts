type ProfileFields = {
  name: string;
  location: string;
  about: string;
};

type ProfileChangesParams = {
  draft: Partial<ProfileFields>;
  current: ProfileFields;
};

const PROFILE_KEYS = ['name', 'location', 'about'] as const;

export function toProfileChanges(
  { draft, current }: ProfileChangesParams,
): Partial<ProfileFields> {
  return Object.fromEntries(
    PROFILE_KEYS.flatMap((key) => {
      const value = draft[key]?.trim();
      if (value === undefined || value === current[key]) return [];
      return [[key, value]];
    }),
  );
}
