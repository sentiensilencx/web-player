
"use client";

import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  MoreVertical,
  Search,
  Music,
  Heart,
  Settings,
  Github,
  Share2,
  PlusCircle,
  Pencil
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Library, Folder, Track } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MainLibraryProps {
  activeFolder: Folder;
  library: Library;
  onPlayTrack: (trackId: string) => void;
  onSearchToggle: () => void;
  currentTrackId: string | null;
  isPlaying: boolean;
  onToggleLike: (trackId: string) => void;
  onToggleLikeFolder?: (folderId: string) => void;
  onToggleTheme?: () => void;
  onAddTrackToFolder?: (track: Track, folderId: string) => void;
  onUpdatePlaylist?: (folderId: string, name: string, imageUrl?: string) => void;
}

const TrackRow = ({ 
  track, 
  index, 
  onPlay,
  isActive,
  isPlayingTrack,
  isLiked,
  onToggleLike,
  playlists,
  onAddToFolder
}: { 
  track: Track; 
  index: number; 
  onPlay: (id: string) => void;
  isActive: boolean;
  isPlayingTrack: boolean;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  playlists: Folder[];
  onAddToFolder?: (track: Track, folderId: string) => void;
}) => {
  return (
    <div 
      className={cn(
        "group flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer animate-spring-up border border-transparent",
        isActive ? "bg-primary/5 border-primary/10" : "hover:bg-accent/5"
      )}
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => onPlay(track.id)}
    >
      <div className="w-5 flex justify-center text-[9px] text-muted-foreground font-bold">
        {isActive && isPlayingTrack ? (
           <div className="flex items-center gap-0.5 h-2.5">
             <span className="w-0.5 h-full bg-primary animate-[bounce_1s_infinite_0ms]" />
             <span className="w-0.5 h-full bg-primary animate-[bounce_1s_infinite_200ms]" />
             <span className="w-0.5 h-full bg-primary animate-[bounce_1s_infinite_400ms]" />
           </div>
        ) : isActive ? (
           <Play className="h-2.5 w-2.5 fill-current text-primary" />
        ) : (
          <span className="group-hover:hidden">{index + 1}</span>
        )}
        {!isActive && (
          <Play className="h-2.5 w-2.5 hidden group-hover:block text-primary fill-current" />
        )}
      </div>

      <div className="relative h-10 w-10 shrink-0">
        <img 
          src={track.imageUrl} 
          alt={track.title} 
          className="h-full w-full rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h5 className={cn("text-sm font-black truncate transition-colors leading-tight", isActive ? "text-primary" : "group-hover:text-primary")}>
          {track.title}
        </h5>
        <p className="text-[10px] text-muted-foreground truncate font-medium lowercase mt-0.5">{track.artist}</p>
      </div>

      <div className="hidden md:block w-1/4 text-[10px] text-muted-foreground truncate font-medium lowercase">
        {track.album || '-'}
      </div>

      <div className="w-10 text-[9px] text-muted-foreground text-right font-black">
        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={(e) => e.stopPropagation()}>
              <PlusCircle className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 bg-card border-border">
            <DropdownMenuLabel className="text-[9px] font-black lowercase opacity-50">add to playlist</DropdownMenuLabel>
            {playlists.map(p => (
              <DropdownMenuItem 
                key={p.id} 
                className="text-[11px] font-bold lowercase rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToFolder?.(track, p.id);
                }}
              >
                {p.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-7 w-7 rounded-full", isLiked ? "text-primary" : "hover:text-primary")} 
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track.id);
          }}
        >
          <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
        </Button>
      </div>
    </div>
  );
};

export function MuraMainLibrary({ 
  activeFolder, 
  library, 
  onPlayTrack, 
  onSearchToggle, 
  currentTrackId, 
  isPlaying,
  onToggleLike,
  onToggleLikeFolder,
  onToggleTheme,
  onAddTrackToFolder,
  onUpdatePlaylist
}: MainLibraryProps) {
  const tracksInFolder = activeFolder.trackIds.map(id => library.tracks[id]).filter(Boolean);
  const isFolderLiked = library.likedFolderIds.includes(activeFolder.id);
  const userPlaylists = Object.values(library.folders).filter(f => f.id !== 'root');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(activeFolder.name);
  const [editImage, setEditImage] = useState(activeFolder.imageUrl || '');

  const handleEditSubmit = () => {
    if (onUpdatePlaylist) {
      onUpdatePlaylist(activeFolder.id, editName, editImage);
    }
    setIsEditOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background min-w-0 overflow-hidden font-body">
      <div className="h-20 flex items-center justify-between px-8 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md group" onClick={onSearchToggle}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="w-full bg-card/50 border border-border/30 h-11 rounded-xl pl-11 pr-4 flex items-center text-xs font-medium text-muted-foreground cursor-pointer hover:bg-card hover:border-border transition-all lowercase">
              search library...
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-card border border-border/30 hover:bg-card transition-all">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-card border-border shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black lowercase text-muted-foreground">playlist options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activeFolder.id !== 'root' && activeFolder.id !== 'liked-songs' && (
              <DropdownMenuItem className="rounded-xl gap-3 text-xs font-bold lowercase" onClick={() => {
                setEditName(activeFolder.name);
                setEditImage(activeFolder.imageUrl || '');
                setIsEditOpen(true);
              }}>
                <Pencil className="h-3.5 w-3.5" />
                edit playlist
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="rounded-xl gap-3 text-xs font-bold lowercase" onClick={onToggleTheme}>
              <Settings className="h-3.5 w-3.5" />
              configure theme
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl gap-3 text-xs font-bold lowercase">
              <Share2 className="h-3.5 w-3.5" />
              share playlist
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl gap-3 text-xs font-bold lowercase" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                <Github className="h-3.5 w-3.5" />
                mura on github
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-8">
          <div className="flex items-end gap-10 mb-10 group">
            <div className="h-48 w-48 rounded-[2.5rem] bg-card border border-border shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-700">
              {activeFolder.imageUrl ? (
                <img src={activeFolder.imageUrl} alt={activeFolder.name} className="h-full w-full object-cover" />
              ) : (
                <Music className="h-16 w-16 text-primary/10" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-primary/40 mb-2 lowercase">
                playlist
              </p>
              <h1 className="text-6xl font-black mb-6 tracking-tighter lowercase leading-none">{activeFolder.name}</h1>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-bold lowercase">
                <span className="text-primary font-black">mura listener</span>
                <span className="opacity-20">•</span>
                <span>{tracksInFolder.length} tracks</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <Button 
              className="h-16 w-16 rounded-[1.75rem] bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center border-none"
              onClick={() => tracksInFolder[0] && onPlayTrack(tracksInFolder[0].id)}
            >
              <Play className="h-8 w-8 fill-current text-primary-foreground" />
            </Button>
            {activeFolder.id !== 'root' && activeFolder.id !== 'liked-songs' && (
              <Button 
                variant="outline" 
                size="icon" 
                className={cn("h-12 w-12 rounded-2xl border-border/50 transition-colors", isFolderLiked ? "text-primary border-primary/30" : "text-muted-foreground hover:text-primary")}
                onClick={() => onToggleLikeFolder?.(activeFolder.id)}
              >
                <Heart className={cn("h-5 w-5", isFolderLiked && "fill-current")} />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 px-4 py-4 border-b border-border/30 text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4 lowercase">
            <div className="w-5 flex justify-center">#</div>
            <div className="flex-1">title</div>
            <div className="hidden md:block w-1/4">album</div>
            <div className="w-10 text-right"><Clock className="h-3.5 w-3.5 inline-block" /></div>
          </div>

          <div className="space-y-0.5 pb-20">
            {tracksInFolder.length > 0 ? (
              tracksInFolder.map((track, i) => (
                <TrackRow 
                  key={`${activeFolder.id}-${track.id}-${i}`} 
                  track={track} 
                  index={i} 
                  onPlay={onPlayTrack} 
                  isActive={currentTrackId === track.id}
                  isPlayingTrack={isPlaying}
                  isLiked={library.likedTrackIds.includes(track.id)}
                  onToggleLike={onToggleLike}
                  playlists={userPlaylists}
                  onAddToFolder={onAddTrackToFolder}
                />
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-card flex items-center justify-center mb-6 border border-border/30">
                  <Music className="h-8 w-8 text-primary/20" />
                </div>
                <p className="text-xs font-black lowercase">this playlist is currently empty</p>
                <Button variant="outline" className="mt-6 rounded-xl px-6 h-10 lowercase font-black text-[10px]" onClick={onSearchToggle}>
                  open discovery
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] bg-card p-8 font-body z-[500]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter lowercase">edit playlist</DialogTitle>
            <DialogDescription className="text-xs lowercase text-muted-foreground">update your collection details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">playlist name</Label>
              <Input 
                id="edit-name" 
                placeholder="my awesome mix" 
                className="h-12 rounded-xl lowercase" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image" className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">cover image url</Label>
              <Input 
                id="edit-image" 
                placeholder="https://..." 
                className="h-12 rounded-xl"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSubmit} className="w-full h-14 rounded-2xl font-black lowercase text-base shadow-lg hover:scale-[1.01] transition-transform">
              save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
