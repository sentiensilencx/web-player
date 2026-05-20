
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat, 
  Repeat1,
  Shuffle,
  Maximize2,
  Heart,
  ListMusic
} from 'lucide-react';
import { Track, RepeatMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onBack: () => void;
  isLiked: boolean;
  onToggleLike: (trackId: string) => void;
  onOpenLyrics: () => void;
  onToggleExpand: () => void;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
  isExpanded?: boolean;
  isVideoVisible?: boolean;
}

export function MuraPlayer({ 
  currentTrack, isPlaying, onTogglePlay, onNext, onBack, isLiked, onToggleLike, onOpenLyrics, onToggleExpand, repeatMode, onToggleRepeat, isExpanded, isVideoVisible = true
}: PlayerProps) {
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setPlayed(0);
  }, [currentTrack?.id]);

  const handleProgress = useCallback((state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  }, [seeking]);

  const handleDuration = useCallback((d: number) => setDuration(d), []);

  const handleSeekChange = useCallback((val: number[]) => {
    setPlayed(val[0] / 100);
  }, []);

  const handleSeekMouseUp = useCallback((val: number[]) => {
    setSeeking(false);
    playerRef.current?.seekTo(val[0] / 100);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* THE ACTUAL VIDEO/AUDIO PORTAL - Positioned for Expansion View */}
      <div className={cn(
        "transition-all duration-700 overflow-hidden bg-black z-[250] pointer-events-none shadow-2xl",
        isExpanded && isVideoVisible
          ? "fixed top-[15%] right-[40px] w-[450px] aspect-video rounded-[2.5rem] border-8 border-card opacity-100 scale-100 pointer-events-auto" 
          : "fixed top-0 right-0 opacity-0 scale-90"
      )}>
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${currentTrack.id}`}
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={onNext}
          progressInterval={250} // Optimized interval for older hardware
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: { modestbranding: 1, rel: 0, showinfo: 0, iv_load_policy: 3 }
            }
          }}
        />
      </div>

      {/* INVISIBLE PLAYER FOR AUDIO-ONLY MODE */}
      <div className="hidden">
        {(!isExpanded || !isVideoVisible) ? (
           <ReactPlayer
            url={`https://www.youtube.com/watch?v=${currentTrack.id}`}
            playing={isPlaying}
            volume={volume}
            muted={isMuted}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={onNext}
            width={0}
            height={0}
          />
        ) : null}
      </div>

      <footer className="h-16 bg-background/95 pane-blur border-t border-border px-10 flex items-center justify-between gap-6 z-[300] relative">
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <div className="relative group cursor-pointer" onClick={onToggleExpand}>
            <img src={currentTrack.imageUrl} className="h-11 w-11 object-cover rounded-xl shadow-lg transition-transform group-hover:scale-105" alt={currentTrack.title} />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
               <Maximize2 className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-black truncate leading-tight tracking-tight">{currentTrack.title}</h4>
            <p className="text-[10px] text-muted-foreground truncate font-medium lowercase opacity-70">{currentTrack.artist}</p>
          </div>
          <Button 
            variant="ghost" size="icon" className="h-8 w-8 ml-1" 
            onClick={(e) => { e.stopPropagation(); onToggleLike(currentTrack.id); }}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isLiked ? "text-primary fill-current" : "text-muted-foreground/40 hover:text-primary")} />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl px-8">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-30 hover:opacity-100">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onBack}>
              <SkipBack className="h-5 w-5 fill-current" />
            </Button>
            <Button 
              onClick={onTogglePlay}
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-transform active:scale-95 border-none"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current translate-x-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onNext}>
              <SkipForward className="h-5 w-5 fill-current" />
            </Button>
            <Button 
              variant="ghost" size="icon" 
              className={cn("h-8 w-8 transition-colors", repeatMode !== 'off' ? "text-primary" : "text-muted-foreground opacity-30 hover:opacity-100")}
              onClick={onToggleRepeat}
            >
              {repeatMode === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-4 w-full">
            <span className="text-[9px] text-muted-foreground font-black w-10 text-right opacity-60">{formatTime(played * duration)}</span>
            <Slider 
              value={[played * 100]} 
              max={100} 
              step={0.01} 
              onValueChange={handleSeekChange} 
              onPointerDown={() => setSeeking(true)} 
              onPointerUp={() => {
                handleSeekMouseUp([played * 100]);
              }} 
              className="flex-1" 
            />
            <span className="text-[9px] text-muted-foreground font-black w-10 opacity-60">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/4">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" onClick={onOpenLyrics}>
            <ListMusic className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 w-40">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground p-0" onClick={() => setIsMuted(!isMuted)}>
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider value={isMuted ? [0] : [volume * 100]} max={100} onValueChange={(val) => setVolume(val[0] / 100)} className="flex-1" />
          </div>
        </div>
      </footer>
    </>
  );
}
