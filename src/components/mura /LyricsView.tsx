
"use client";

import React from 'react';
import { X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Track } from '@/lib/types';

interface LyricsViewProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LyricsView({ track, isOpen, onClose }: LyricsViewProps) {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 pane-blur flex flex-col animate-in fade-in duration-300">
      <div className="h-16 flex items-center justify-between px-8 border-b border-border/20">
        <div className="flex items-center gap-4">
          <img src={track.imageUrl} alt={track.title} className="h-10 w-10 rounded shadow-lg" />
          <div>
            <h4 className="text-sm font-bold">{track.title}</h4>
            <p className="text-xs text-muted-foreground">{track.artist}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-8 md:px-24">
        <div className="max-w-3xl mx-auto py-12">
          {track.lyrics ? (
            <div className="space-y-6">
              {track.lyrics.split('\n').map((line, i) => (
                <p key={i} className="text-2xl md:text-4xl font-black tracking-tight text-foreground/80 hover:text-primary transition-colors cursor-default">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
              <Music className="h-20 w-20 mb-6" />
              <h2 className="text-3xl font-bold">No lyrics found</h2>
              <p className="mt-2">Try playing another track from the mura library.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
