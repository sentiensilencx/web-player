
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Music, Youtube, Plus, Command, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Track, MusicSource } from '@/lib/types';
import { searchMusic } from '@/lib/music-service';
import { cn } from '@/lib/utils';

interface HybridSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrack: (track: Track) => void;
  preferredSource: MusicSource;
}

export function MuraHybridSearch({ isOpen, onClose, onAddTrack, preferredSource }: HybridSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const data = await searchMusic(query, preferredSource);
          setResults(data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query, preferredSource]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-sidebar border-border p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl">
        <div className="p-4 border-b border-border flex items-center gap-3">
          {isSearching ? <Loader2 className="h-5 w-5 text-primary animate-spin" /> : <Search className="h-5 w-5 text-primary" />}
          <Input 
            autoFocus
            placeholder={`Searching ${preferredSource === 'spotify' ? 'Spotify' : 'YouTube Music'}...`} 
            className="flex-1 border-none bg-transparent focus-visible:ring-0 text-lg p-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/20 text-[10px] font-bold text-muted-foreground">
             <Command className="h-3 w-3" />
             <span>ESC</span>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh] custom-scrollbar">
          {results.length > 0 ? (
            <div className="p-2 space-y-1">
              <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex justify-between">
                <span>{preferredSource.toUpperCase()} RESULTS</span>
                <span className="text-primary">Live Simulated Data</span>
              </div>
              {results.map(track => (
                <div 
                  key={track.id}
                  className="group flex items-center gap-4 p-3 rounded-xl hover:bg-accent/10 transition-all cursor-pointer"
                  onClick={() => {
                    onAddTrack(track);
                    onClose();
                  }}
                >
                  <div className="relative h-12 w-12 shrink-0">
                    <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover rounded-lg shadow" />
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-background rounded-full border border-border flex items-center justify-center">
                        {track.source === 'spotify' ? <Music className="h-3 w-3 text-[#1DB954]" /> : <Youtube className="h-3 w-3 text-[#FF0000]" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{track.title}</h5>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : query.length > 0 && !isSearching ? (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                <Search className="h-12 w-12 mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">No results found for "{query}" on {preferredSource}</p>
            </div>
          ) : (
            <div className="p-8 space-y-6">
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Popular on {preferredSource}</p>
                    <div className="flex flex-wrap gap-2">
                        {['Lofi Girl', 'Metro Boomin', 'Sleep Music', 'Summer Hits 2024', 'Classical Focus'].map(tag => (
                            <Badge key={tag} variant="outline" className="px-3 py-1 cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className={cn("p-4 rounded-2xl border transition-all", preferredSource === 'spotify' ? "bg-[#1DB954]/10 border-[#1DB954]/40" : "bg-accent/5 border-border opacity-50")}>
                        <Music className={cn("h-8 w-8", preferredSource === 'spotify' ? "text-[#1DB954]" : "text-muted-foreground")} />
                        <div className="mt-2">
                            <p className="text-xs font-bold">Spotify</p>
                            <p className="text-[10px] text-muted-foreground">{preferredSource === 'spotify' ? 'Active Backend' : 'Switch via Sidebar'}</p>
                        </div>
                    </div>
                    <div className={cn("p-4 rounded-2xl border transition-all", preferredSource === 'ytm' ? "bg-[#FF0000]/10 border-[#FF0000]/40" : "bg-accent/5 border-border opacity-50")}>
                        <Youtube className={cn("h-8 w-8", preferredSource === 'ytm' ? "text-[#FF0000]" : "text-muted-foreground")} />
                        <div className="mt-2">
                            <p className="text-xs font-bold">YT Music</p>
                            <p className="text-[10px] text-muted-foreground">{preferredSource === 'ytm' ? 'Active Backend' : 'Switch via Sidebar'}</p>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
