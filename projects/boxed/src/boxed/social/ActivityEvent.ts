export type ActivityActor = {
  name: string;
  href: string;
  avatar: string;
};

export type ActivityEvent = {
  key: string;
  at: Date;
  actor: ActivityActor;
  others: number;
  type: 'movie' | 'episode';
  title: string;
  code: string | null;
  href: string;
  poster: string;
  rating: number | null;
};
