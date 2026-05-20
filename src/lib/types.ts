
export type MusicSource = 'spotify' | 'ytm';
export type RepeatMode = 'off' | 'one' | 'queue';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  imageUrl?: string;
  source: MusicSource;
  duration: number; // in seconds
  url: string;
  lyrics?: string;
  youtubeId?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  childFolderIds: string[];
  trackIds: string[];
  imageUrl?: string;
}

export interface Library {
  folders: Record<string, Folder>;
  tracks: Record<string, Track>;
  rootFolderId: string;
  likedTrackIds: string[];
  likedFolderIds: string[]; // Added to track favorite playlists
}
