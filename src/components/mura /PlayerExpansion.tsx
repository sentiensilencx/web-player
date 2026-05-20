
"use client";

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Music, Youtube, ChevronDown, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Track } from '@/lib/types';
import { searchMusic } from '@/lib/music-service';
import { Badge } from '@/components/ui/badge';

interface PlayerExpansionProps {
  track: Track | null;
  onClose: () => void;
  onPlaySimilar: (track: Track) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isVideoVisible: boolean;
  onToggleVideo: () => void;
}

export function PlayerExpansion({ track, onClose, onPlaySimilar, isPlaying, onTogglePlay, isVideoVisible, onToggleVideo }: PlayerExpansionProps) {
  const [similarTracks, setSimilarTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (track) {
      setLoading(true);
      searchMusic(`${track.artist} official music`, 'ytm')
        .then(res => setSimilarTracks(res.slice(0, 8)))
        .finally(() => setLoading(false));
    }
  }, [track]);

  if (!track) return null;

  return (
    <div className="absolute inset-0 z-[150] bg-background pane-blur flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 overflow-hidden font-body">
      <div className="h-16 flex items-center justify-between px-10 border-b border-border/10">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-accent/10 h-10 w-10">
          <ChevronDown className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground lowercase">now playing on youtube music</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-[10px] font-black lowercase rounded-xl"
          onClick={onToggleVideo}
        >
          {isVideoVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {isVideoVisible ? 'audio only' : 'show video'}
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* LEFT CONTENT AREA */}
        <div className="flex-1 flex flex-col items-start justify-center p-12 lg:p-24 space-y-8 overflow-hidden">
          <div className="w-full max-w-xl space-y-8">
            {/* 1:1 Album Art placeholder when video is off OR playing on right */}
            {(!isVideoVisible) && (
              <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl animate-spring-up">
                <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">{track.title}</h2>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest lowercase">artist</p>
                <p className="text-xl lg:text-3xl font-bold text-muted-foreground lowercase">{track.artist}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-8">
                <Button 
                  onClick={onTogglePlay}
                  className="rounded-full h-16 px-12 gap-4 font-black lowercase text-xl shadow-xl shadow-primary/20"
                >
                  {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
                  {isPlaying ? 'pause' : 'play'}
                </Button>
                <Badge variant="secondary" className="px-8 py-4 rounded-full text-[11px] font-black bg-accent/10 hover:bg-accent/20 cursor-pointer lowercase transition-colors">
                  related
                </Badge>
                <Badge variant="secondary" className="px-8 py-4 rounded-full text-[11px] font-black bg-accent/10 hover:bg-accent/20 cursor-pointer lowercase transition-colors">
                  lyrics
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT VIDEO/RELATED AREA */}
        <div className="w-full lg:w-[480px] border-l border-border/10 bg-accent/5 flex flex-col min-h-0">
          <div className="p-8 border-b border-border/10 flex items-center justify-between bg-card/20">
             <div className="flex items-center gap-3">
               <Sparkles className="h-4 w-4 text-primary" />
               <h3 className="text-[10px] font-black uppercase tracking-widest lowercase">up next</h3>
             </div>
             {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
          </div>
          
          <ScrollArea className="flex-1 custom-scrollbar">
            {/* VIDEO PLACEHOLDER SPACE - The actual player is fixed in MuraPlayer.tsx but visually matches this space */}
            <div className="p-8">
               <div className="w-full aspect-video rounded-3xl bg-black/10 border border-border/30 flex items-center justify-center mb-8 overflow-hidden">
                  {!isVideoVisible ? (
                    <div className="flex flex-col items-center opacity-40">
                       <Youtube className="h-10 w-10 mb-2" />
                       <span className="text-[9px] font-black uppercase">audio only active</span>
                    </div>
                  ) : null}
               </div>

               <div className="space-y-6">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="h-20 w-20 rounded-2xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-muted rounded" />
                        <div className="h-2 w-1/2 bg-muted rounded" />
                      </div>
                    </div>
                  ))
                ) : (
                  similarTracks.map(t => (
                    <div 
                      key={t.id}
                      className="group flex items-center gap-4 p-4 rounded-[2.5rem] hover:bg-background hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer border border-transparent"
                      onClick={() => onPlaySimilar(t)}
                    >
                      <div className="relative h-20 w-20 shrink-0">
                        <img src={t.imageUrl} alt={t.title} className="h-full w-full object-cover rounded-2xl shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-black truncate group-hover:text-primary transition-colors leading-tight">{t.title}</h5>
                        <p className="text-[10px] text-muted-foreground font-black truncate lowercase mt-1 opacity-60">{t.artist}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
