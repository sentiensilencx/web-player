
import { Library, Track } from './types';

export const INITIAL_TRACKS: Record<string, Track> = {};

export const INITIAL_LIBRARY: Library = {
  rootFolderId: 'root',
  likedTrackIds: [],
  likedFolderIds: [],
  folders: {
    'root': {
      id: 'root',
      name: 'your library',
      parentId: null,
      childFolderIds: [],
      trackIds: []
    }
  },
  tracks: INITIAL_TRACKS
};
