import { Track, MusicSource } from './types';

/**
 * MUSIC SERVICE
 * This file handles searching for real tracks via the YouTube Data API.
 */

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const searchMusic = async (query: string, source: MusicSource): Promise<Track[]> => {
  if (!API_KEY) {
    console.error("YouTube API Key is missing. Please check your .env file.");
    return [];
  }

  try {
    // videoCategoryId=10 specifically targets the "Music" category on YouTube
    // We add "official music video" or "official audio" to the query to prioritize music-related content
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query + " official audio")}&type=video&videoCategoryId=10&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\(Official.*?\)/gi, "").replace(/\[Official.*?\]/gi, ""),
      artist: item.snippet.channelTitle.replace(" - Topic", "").replace("VEVO", ""),
      album: 'youtube music',
      imageUrl: item.snippet.thumbnails.high.url,
      source: 'ytm',
      duration: 0, 
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      youtubeId: item.id.videoId
    }));
  } catch (error) {
    console.error("YouTube search error:", error);
    return [];
  }
};