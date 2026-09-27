import type { ListItem } from '$lib/requests/models/ListItem.ts';
import type { PosterMedia } from '../../poster/PosterMedia.ts';

export function toListPoster(item: ListItem): PosterMedia {
  switch (item.type) {
    case 'movie':
    case 'show':
      return { ...item.entry, key: item.key };
    case 'episode':
      return { ...item.entry.show, key: item.key };
    case 'season':
      return {
        ...item.entry.show,
        key: item.key,
        poster: item.entry.season.poster ?? item.entry.show.poster,
      };
  }
}
