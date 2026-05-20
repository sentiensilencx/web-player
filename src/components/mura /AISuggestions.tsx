
"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, Plus, Music, X } from 'lucide-react';
import { aiCuratedTrackSuggestions, AICuratedTrackSuggestionsOutput } from '@/ai/flows/ai-curated-track-suggestions';
import { Folder, Track, Library } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface AISuggestionsProps {
  folder: Folder;
  library: Library;
  onClose: () => void;
  onAddTrack: (track: any) => void;
}

export function MuraAISuggestions({ folder, library, onClose, onAddTrack }: AISuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AICuratedTrackSuggestionsOutput | null>(null);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const existingTracks = folder.trackIds.map(id => library.tracks[id]).filter(Boolean).map(t => ({
        title: t.title,
        artist: t.artist,
        album: t.album,
      }));

      const result = await aiCuratedTrackSuggestions({
        existingTracks,
        folderName: folder.name,
        folderDescription: `A music folder containing ${existingTracks.length} tracks.`
      });
      setSuggestions(result);
    } catch (error) {
      toast({
        title: "AI Failed",
        description: "Could not generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 h-full bg-sidebar border-l border-sidebar-border flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <h3 className="text-sm font-bold uppercase tracking-wider">AI Curator</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        {!suggestions && !loading && (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-sm font-bold mb-2">Grow your "{folder.name}" folder</h4>
            <p className="text-xs text-muted-foreground mb-6">
              Our AI analyzes your existing tracks to find the perfect additions.
            </p>
            <Button onClick={generateSuggestions} className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </Button>
          </div>
        )}

        {loading && (
          <div className="py-20 flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium animate-pulse">Curating your list...</p>
          </div>
        )}

        {suggestions && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Recommended for you</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-primary text-[10px]" onClick={generateSuggestions}>
                Refresh
              </Button>
            </div>
            {suggestions.suggestedTracks.map((track, i) => (
              <Card key={i} className="bg-accent/10 border-none p-3 group hover:bg-accent/20 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold truncate group-hover:text-primary transition-colors">{track.title}</h5>
                    <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-primary/20 hover:bg-primary hover:text-white"
                    onClick={() => {
                        onAddTrack(track);
                        toast({ title: "Added!", description: `${track.title} added to library.` });
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-[10px] leading-relaxed italic text-muted-foreground border-t border-border/30 pt-2">
                  "{track.reason}"
                </p>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
