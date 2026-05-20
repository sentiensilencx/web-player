'use server';
/**
 * @fileOverview A Genkit flow for generating AI-curated track suggestions based on existing music in a folder.
 *
 * - aiCuratedTrackSuggestions - A function that handles the track suggestion process.
 * - AICuratedTrackSuggestionsInput - The input type for the aiCuratedTrackSuggestions function.
 * - AICuratedTrackSuggestionsOutput - The return type for the aiCuratedTrackSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrackMetadataSchema = z.object({
  title: z.string().describe('The title of the music track.'),
  artist: z.string().describe('The artist(s) of the music track.'),
  album: z.string().optional().describe('The album the track belongs to.'),
  genres: z.array(z.string()).optional().describe('A list of genres associated with the track.'),
  year: z.number().optional().describe('The release year of the track.'),
});

const AICuratedTrackSuggestionsInputSchema = z.object({
  existingTracks: z.array(TrackMetadataSchema).describe('An array of metadata for existing tracks in the folder.'),
  folderName: z.string().describe('The name of the music folder for which suggestions are needed.'),
  folderDescription: z.string().optional().describe('An optional description of the folder\'s theme or genre.'),
});
export type AICuratedTrackSuggestionsInput = z.infer<typeof AICuratedTrackSuggestionsInputSchema>;

const SuggestedTrackSchema = z.object({
  title: z.string().describe('The title of the suggested music track.'),
  artist: z.string().describe('The artist(s) of the suggested music track.'),
  reason: z.string().describe('A brief explanation why this track is suggested, based on the existing music.'),
});

const AICuratedTrackSuggestionsOutputSchema = z.object({
  suggestedTracks: z.array(SuggestedTrackSchema).max(5).describe('An array of up to 5 suggested music tracks.'),
});
export type AICuratedTrackSuggestionsOutput = z.infer<typeof AICuratedTrackSuggestionsOutputSchema>;

export async function aiCuratedTrackSuggestions(input: AICuratedTrackSuggestionsInput): Promise<AICuratedTrackSuggestionsOutput> {
  return aiCuratedTrackSuggestionsFlow(input);
}

const aiCuratedTrackSuggestionsPrompt = ai.definePrompt({
  name: 'aiCuratedTrackSuggestionsPrompt',
  input: {schema: AICuratedTrackSuggestionsInputSchema},
  output: {schema: AICuratedTrackSuggestionsOutputSchema},
  prompt: `You are an expert music curator for a music library application named Mura. Your task is to suggest new tracks for a specific music folder based on the existing music within it.

Analyze the following tracks currently in the folder named "{{{folderName}}}"{{#if folderDescription}} (Description: "{{{folderDescription}}}"){{/if}}:

{{#each existingTracks}}
- Title: {{{this.title}}}, Artist: {{{this.artist}}}{{#if this.album}}, Album: {{{this.album}}}{{/if}}{{#if this.genres}}, Genres: {{#each this.genres}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}{{#if this.year}}, Year: {{{this.year}}}{{/if}}
{{/each}}

Based on these tracks, suggest 5 new music tracks that would fit perfectly into this folder's style, mood, and genre. For each suggestion, provide the title, artist, and a concise reason for your recommendation.

Ensure your output strictly adheres to the JSON schema provided.`,
});

const aiCuratedTrackSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiCuratedTrackSuggestionsFlow',
    inputSchema: AICuratedTrackSuggestionsInputSchema,
    outputSchema: AICuratedTrackSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await aiCuratedTrackSuggestionsPrompt(input);
    return output!;
  }
);
