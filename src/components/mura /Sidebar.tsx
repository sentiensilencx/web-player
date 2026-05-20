
"use client";

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Library as LibraryIcon,
  Music,
  Settings,
  Youtube,
  Search,
  ListMusic,
  User,
  Sparkles,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Library, Folder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { User as FirebaseUser } from 'firebase/auth';

interface SidebarProps {
  library: Library;
  activeView: 'library' | 'discovery' | 'mixes';
  activeFolderId: string;
  onSelectFolder: (id: string) => void;
  onSelectDiscovery: () => void;
  onSelectMixes: () => void;
  onAddPlaylist: (name: string, imageUrl?: string) => void;
  onOpenSettings: () => void;
  user: FirebaseUser | null;
}

const FolderItem = ({ 
  folder, 
  library, 
  level, 
  activeFolderId, 
  activeView,
  onSelectFolder
}: { 
  folder: Folder; 
  library: Library; 
  level: number; 
  activeFolderId: string;
  activeView: string;
  onSelectFolder: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = activeView === 'library' && activeFolderId === folder.id;
  const hasChildren = folder.childFolderIds.length > 0;

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "group flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all",
          isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" : "hover:bg-accent/10 text-muted-foreground hover:text-foreground"
        )}
        style={{ marginLeft: `${level * 6}px` }}
        onClick={() => onSelectFolder(folder.id)}
      >
        {hasChildren ? (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="p-0.5 rounded-full hover:bg-muted/50"
          >
            {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <ListMusic className="h-4 w-4 shrink-0" />
        <span className="truncate text-[11px] font-bold lowercase tracking-tight">{folder.name}</span>
      </div>
      {isOpen && hasChildren && folder.childFolderIds.map(childId => (
        <FolderItem 
          key={childId} folder={library.folders[childId]} library={library} level={level + 1}
          activeFolderId={activeFolderId} activeView={activeView} onSelectFolder={onSelectFolder}
        />
      ))}
    </div>
  );
};

export function MuraSidebar({ 
  library, activeView, activeFolderId, onSelectFolder, onSelectDiscovery, onSelectMixes, onAddPlaylist, onOpenSettings, user
}: SidebarProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistImage, setNewPlaylistImage] = useState('');

  const handleCreateSubmit = () => {
    if (!newPlaylistName.trim()) return;
    onAddPlaylist(newPlaylistName, newPlaylistImage);
    setIsCreateOpen(false);
    setNewPlaylistName('');
    setNewPlaylistImage('');
  };

  return (
    <aside className="w-60 flex flex-col h-full bg-sidebar border-r border-sidebar-border select-none font-body shadow-inner overflow-hidden">
      <div className="p-5 flex items-center gap-3 group shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm rounded-full overflow-hidden shrink-0 transition-transform group-hover:scale-105">
            <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/mura-user/100/100"} />
            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[13px] font-black lowercase tracking-tighter truncate leading-tight">
              {user?.displayName || "guest user"}
            </span>
            <span className="text-[9px] text-muted-foreground lowercase leading-none opacity-60">
              {user ? "linked account" : "free listener"}
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onOpenSettings} 
          className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all shrink-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="bg-border/10 mb-2 shrink-0" />

      <div className="px-6 py-2 shrink-0">
        <nav className="space-y-1">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-4 h-11 rounded-xl transition-all lowercase", 
              activeView === 'library' && activeFolderId === 'root' ? "bg-primary/10 text-primary font-black" : "text-muted-foreground font-bold"
            )}
            onClick={() => onSelectFolder('root')}
          >
            <LibraryIcon className="h-4 w-4" />
            <span className="text-xs tracking-tight">your library</span>
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-4 h-11 rounded-xl transition-all lowercase", 
              activeView === 'library' && activeFolderId === 'liked-songs' ? "bg-primary/10 text-primary font-black" : "text-muted-foreground font-bold"
            )}
            onClick={() => onSelectFolder('liked-songs')}
          >
            <Heart className={cn("h-4 w-4", activeFolderId === 'liked-songs' && "fill-current")} />
            <span className="text-xs tracking-tight">liked songs</span>
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-4 h-11 rounded-xl transition-all lowercase", 
              activeView === 'discovery' ? "bg-primary/10 text-primary font-black" : "text-muted-foreground font-bold"
            )}
            onClick={onSelectDiscovery}
          >
            <Search className="h-4 w-4" />
            <span className="text-xs tracking-tight">discovery</span>
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-4 h-11 rounded-xl transition-all lowercase", 
              activeView === 'mixes' ? "bg-primary/10 text-primary font-black" : "text-muted-foreground font-bold"
            )}
            onClick={onSelectMixes}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-xs tracking-tight">mixes</span>
          </Button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-h-0 py-4">
        <div className="px-7 mb-4 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest lowercase opacity-50">playlists</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors" 
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-4 custom-scrollbar">
          <div className="space-y-0.5 pb-20">
            {library.folders['root'].childFolderIds.map(childId => (
              <FolderItem 
                key={childId} folder={library.folders[childId]} library={library} level={0}
                activeFolderId={activeFolderId} activeView={activeView} onSelectFolder={onSelectFolder}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-6 shrink-0 space-y-5 bg-sidebar border-t border-border/10">
        <div className="flex flex-col items-center">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3 lowercase w-full text-center opacity-40">backend active</p>
          <div className="w-full bg-[#FF0000] text-white h-12 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-500/10 transition-transform cursor-default">
            <Youtube className="h-4 w-4" />
            <span className="text-[11px] font-black lowercase tracking-tight">youtube music</span>
          </div>
        </div>
        
        <Separator className="bg-border/10" />
        
        <div className="flex items-center justify-center gap-3 text-primary pb-3 select-none group">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Music className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-2xl font-black tracking-tighter lowercase">mura</span>
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] bg-card p-8 font-body z-[500]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter lowercase">create playlist</DialogTitle>
            <DialogDescription className="text-xs lowercase text-muted-foreground">add a new collection to your library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">playlist name</Label>
              <Input 
                id="name" 
                placeholder="my awesome mix" 
                className="h-12 rounded-xl lowercase" 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">cover image url (optional)</Label>
              <Input 
                id="image" 
                placeholder="https://..." 
                className="h-12 rounded-xl"
                value={newPlaylistImage}
                onChange={(e) => setNewPlaylistImage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateSubmit} className="w-full h-14 rounded-2xl font-black lowercase text-base shadow-lg hover:scale-[1.01] transition-transform border-none">
              create playlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
