
'use server';
/**
 * @fileOverview A Genkit flow for performing an AI-powered music search.
 * This simulates a real music API by using Gemini to find track metadata.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MusicSearchInputSchema = z.object({
  query: z.string().describe('The search term (song, artist, or genre).'),
  source: z.enum(['spotify', 'ytm']).describe('The music service backend to simulate.'),
});
export type MusicSearchInput = z.infer<typeof MusicSearchInputSchema>;

const SearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  imageUrl: z.string().optional(),
  duration: z.number().describe('Duration in seconds.'),
  lyrics: z.string().optional(),
});

const MusicSearchOutputSchema = z.object({
  results: z.array(SearchResultSchema).max(8),
});
export type MusicSearchOutput = z.infer<typeof MusicSearchOutputSchema>;

export async function musicSearch(input: MusicSearchInput): Promise<MusicSearchOutput> {
  return musicSearchFlow(input);
}

const musicSearchPrompt = ai.definePrompt({
  name: 'musicSearchPrompt',
  input: { schema: MusicSearchInputSchema },
  output: { schema: MusicSearchOutputSchema },
  prompt: `You are a music database assistant for the Mura music app.
  The user is searching for music on {{source}}.
  Query: "{{query}}"

  Based on this query, provide 8 realistic search results. 
  Include the song title, the real artist, the album name, and a plausible duration in seconds.
  Also, provide a snippet of lyrics (4-5 lines) for the top 3 results.
  
  For the imageUrl, use: https://picsum.photos/seed/{{source}}music/400/400 (you can vary the seed number slightly for each).
  
  Ensure the results feel specific to the query. If the query is "lofi", return lofi tracks. If it's "Taylor Swift", return her songs.`,
});

const musicSearchFlow = ai.defineFlow(
  {
    name: 'musicSearchFlow',
    inputSchema: MusicSearchInputSchema,
    outputSchema: MusicSearchOutputSchema,
  },
  async (input) => {
    const { output } = await musicSearchPrompt(input);
    return output!;
  }
);
