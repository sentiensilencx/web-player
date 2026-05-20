
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Play, TrendingUp, Loader2, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Track, MusicSource, Library, Folder } from '@/lib/types';
import { searchMusic } from '@/lib/music-service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DiscoveryProps {
  activeService: MusicSource;
  library: Library;
  onPlayTrack: (track: Track) => void;
  onAddTrack: (track: Track, folderId: string) => void;
}

export function MuraDiscovery({ activeService, library, onPlayTrack, onAddTrack }: DiscoveryProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trending, setTrending] = useState<Track[]>([]);
  
  const userPlaylists = Object.values(library.folders).filter(f => f.id !== 'root');

  useEffect(() => {
    const loadTrending = async () => {
      const data = await searchMusic('trending music hits', activeService);
      setTrending(data);
    };
    loadTrending();
  }, [activeService]);

  useEffect(() => {
    if (query.trim().length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const data = await searchMusic(query, activeService);
          setResults(data);
        } finally {
          setIsSearching(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query, activeService]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden font-body">
      <div className="p-8 pb-4">
        <h1 className="text-5xl font-black mb-6 tracking-tighter lowercase leading-none">discovery</h1>
        <div className="relative group max-w-2xl">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center h-6 w-6">
            {isSearching ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <Input 
            placeholder={`search catalog on youtube music...`} 
            className="h-14 pl-14 bg-card border-border/30 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/5 text-base lowercase placeholder:text-muted-foreground/30 transition-all hover:border-border"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-8 pt-2 space-y-16 pb-32">
          {results.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-6 lowercase">search results</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(track => (
                  <DiscoveryTrackCard 
                    key={track.id} 
                    track={track} 
                    onPlay={() => onPlayTrack(track)} 
                    onAdd={(fid) => onAddTrack(track, fid)}
                    playlists={userPlaylists}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest lowercase">trending on youtube</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trending.map(track => (
                  <DiscoveryTrackCard 
                    key={track.id} 
                    track={track} 
                    onPlay={() => onPlayTrack(track)} 
                    onAdd={(fid) => onAddTrack(track, fid)}
                    playlists={userPlaylists}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function DiscoveryTrackCard({ 
  track, 
  onPlay, 
  onAdd,
  playlists
}: { 
  track: Track; 
  onPlay: () => void; 
  onAdd: (fid: string) => void;
  playlists: Folder[];
}) {
  return (
    <Card 
      className="flex items-center gap-4 p-4 bg-card border-border/30 hover:border-border transition-all group rounded-2xl shadow-sm cursor-pointer"
      onClick={onPlay}
    >
      <div className="relative h-20 w-20 shrink-0">
        <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover rounded-xl shadow-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-sm font-black truncate group-hover:text-primary transition-colors leading-tight">{track.title}</h5>
        <div className="mt-1">
          <p className="text-[10px] text-muted-foreground font-black lowercase tracking-tight mb-0.5">artist</p>
          <p className="text-[11px] font-bold truncate lowercase text-foreground/80">{track.artist}</p>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl bg-background border border-border/30 hover:bg-primary hover:text-white shrink-0 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 bg-card border-border shadow-xl z-[200]">
          <DropdownMenuLabel className="text-[9px] font-black lowercase opacity-50">save to...</DropdownMenuLabel>
          <DropdownMenuItem className="text-[11px] font-bold lowercase rounded-lg" onClick={(e) => { e.stopPropagation(); onAdd('root'); }}>
            your library
          </DropdownMenuItem>
          {playlists.length > 0 && <DropdownMenuSeparator />}
          {playlists.map(p => (
            <DropdownMenuItem key={p.id} className="text-[11px] font-bold lowercase rounded-lg" onClick={(e) => { e.stopPropagation(); onAdd(p.id); }}>
              {p.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
