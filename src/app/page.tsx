
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MuraSidebar } from '@/components/mura/Sidebar';
import { MuraPlayer } from '@/components/mura/Player';
import { MuraMainLibrary } from '@/components/mura/MainLibrary';
import { MuraDiscovery } from '@/components/mura/Discovery';
import { MuraMixes } from '@/components/mura/Mixes';
import { SettingsModal } from '@/components/mura/SettingsModal';
import { LyricsView } from '@/components/mura/LyricsView';
import { PlayerExpansion } from '@/components/mura/PlayerExpansion';
import { INITIAL_LIBRARY } from '@/lib/mock-data';
import { Library, Track, MusicSource, RepeatMode, Folder } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { useUser, useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export default function MuraApp() {
  const { user } = useUser();
  const auth = useAuth();
  
  const [library, setLibrary] = useState<Library>(INITIAL_LIBRARY);
  const [discoveryTracks, setDiscoveryTracks] = useState<Record<string, Track>>({});
  
  const [activeView, setActiveView] = useState<'library' | 'discovery' | 'mixes'>('library');
  const [activeFolderId, setActiveFolderId] = useState('root');
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeService, setActiveService] = useState<MusicSource>('ytm');
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeFolder = useMemo(() => {
    if (activeFolderId === 'liked-songs') {
      return {
        id: 'liked-songs',
        name: 'liked songs',
        parentId: null,
        childFolderIds: [],
        trackIds: library.likedTrackIds,
        imageUrl: 'https://picsum.photos/seed/liked/400/400'
      } as Folder;
    }
    return library.folders[activeFolderId] || library.folders['root'];
  }, [library.folders, library.likedTrackIds, activeFolderId]);
  
  const currentTrack = useMemo(() => {
    if (!currentTrackId) return null;
    return library.tracks[currentTrackId] || discoveryTracks[currentTrackId];
  }, [currentTrackId, library.tracks, discoveryTracks]);

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Welcome!", description: "Successfully linked your Google account." });
    } catch (error) {
      toast({ title: "Login Failed", description: "Could not link account.", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed out", description: "You are now browsing as a guest." });
  };

  const handleSelectFolder = useCallback((id: string) => {
    setActiveView('library');
    setActiveFolderId(id);
    setIsExpandedView(false);
  }, []);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

  const handleAddPlaylist = useCallback((name: string, imageUrl?: string) => {
    const id = `f-${Date.now()}`;
    const newFolder: Folder = { 
      id, 
      name, 
      parentId: 'root', 
      childFolderIds: [], 
      trackIds: [],
      imageUrl: imageUrl || `https://picsum.photos/seed/${id}/400/400`
    };
    
    setLibrary(prev => {
      const folders = { ...prev.folders };
      const rootFolder = { ...folders['root'] };
      folders[id] = newFolder;
      rootFolder.childFolderIds = [...rootFolder.childFolderIds, id];
      folders['root'] = rootFolder;
      return { ...prev, folders };
    });
    
    toast({ title: "playlist created", description: `added "${name}" to your library.` });
  }, []);

  const handleUpdatePlaylist = useCallback((folderId: string, name: string, imageUrl?: string) => {
    setLibrary(prev => {
      const folders = { ...prev.folders };
      if (!folders[folderId]) return prev;
      folders[folderId] = { ...folders[folderId], name, imageUrl: imageUrl || folders[folderId].imageUrl };
      return { ...prev, folders };
    });
    toast({ title: "playlist updated", description: `saved changes to "${name}".` });
  }, []);

  const handlePlayTrack = useCallback((trackId: string, trackObject?: Track) => {
    if (trackObject && !library.tracks[trackId]) {
      setDiscoveryTracks(prev => ({ ...prev, [trackId]: trackObject }));
    }
    if (currentTrackId === trackId) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentTrackId(trackId);
      setIsPlaying(true);
      setIsExpandedView(true);
    }
  }, [currentTrackId, library.tracks]);

  const handleNextTrack = useCallback(() => {
    const trackIds = activeFolder.trackIds;
    if (trackIds.length === 0 || !currentTrackId) return;
    const currentIndex = trackIds.indexOf(currentTrackId);
    const nextIndex = (currentIndex + 1) % trackIds.length;
    setCurrentTrackId(trackIds[nextIndex]);
  }, [activeFolder.trackIds, currentTrackId]);

  const handlePrevTrack = useCallback(() => {
    const trackIds = activeFolder.trackIds;
    if (trackIds.length === 0 || !currentTrackId) return;
    const currentIndex = trackIds.indexOf(currentTrackId);
    const prevIndex = (currentIndex - 1 + trackIds.length) % trackIds.length;
    setCurrentTrackId(trackIds[prevIndex]);
  }, [activeFolder.trackIds, currentTrackId]);

  const handleToggleLike = useCallback((trackId: string) => {
    setLibrary(prev => {
      const isLiked = prev.likedTrackIds.includes(trackId);
      const likedTrackIds = isLiked 
        ? prev.likedTrackIds.filter(id => id !== trackId)
        : [...prev.likedTrackIds, trackId];
      const track = discoveryTracks[trackId] || prev.tracks[trackId];
      const newTracks = track ? { ...prev.tracks, [trackId]: track } : prev.tracks;
      return { ...prev, likedTrackIds, tracks: newTracks };
    });
  }, [discoveryTracks]);

  const handleToggleLikeFolder = useCallback((folderId: string) => {
    setLibrary(prev => {
      const isLiked = prev.likedFolderIds.includes(folderId);
      const likedFolderIds = isLiked 
        ? prev.likedFolderIds.filter(id => id !== folderId)
        : [...prev.likedFolderIds, folderId];
      return { ...prev, likedFolderIds };
    });
  }, []);

  const handleAddTrackToFolder = useCallback((track: Track, folderId: string = 'root') => {
    setLibrary(prev => {
      const newTracks = { ...prev.tracks, [track.id]: track };
      const targetFolder = { ...prev.folders[folderId] };
      if (!targetFolder.trackIds.includes(track.id)) {
        targetFolder.trackIds = [...targetFolder.trackIds, track.id];
      }
      return {
        ...prev,
        tracks: newTracks,
        folders: { ...prev.folders, [folderId]: targetFolder }
      };
    });
    const folderName = library.folders[folderId]?.name || "library";
    toast({ title: "added to folder", description: `"${track.title}" added to ${folderName}.` });
  }, [library.folders]);

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-[0.82rem] font-body transition-colors duration-500">
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <MuraSidebar 
          library={library} 
          activeView={activeView}
          activeFolderId={activeFolderId} 
          onSelectFolder={handleSelectFolder}
          onSelectDiscovery={() => { setActiveView('discovery'); setIsExpandedView(false); }}
          onSelectMixes={() => { setActiveView('mixes'); setIsExpandedView(false); }}
          onAddPlaylist={handleAddPlaylist}
          onOpenSettings={() => setIsSettingsOpen(true)}
          user={user}
        />
        
        <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
          {activeView === 'library' && (
            <MuraMainLibrary 
              activeFolder={activeFolder} 
              library={library}
              onPlayTrack={(id) => handlePlayTrack(id)}
              currentTrackId={currentTrackId}
              isPlaying={isPlaying}
              onToggleLike={handleToggleLike}
              onToggleLikeFolder={handleToggleLikeFolder}
              onSearchToggle={() => setActiveView('discovery')}
              onToggleTheme={toggleTheme}
              onAddTrackToFolder={handleAddTrackToFolder}
              onUpdatePlaylist={handleUpdatePlaylist}
            />
          )}
          {activeView === 'discovery' && (
            <MuraDiscovery 
              activeService={activeService}
              library={library}
              onPlayTrack={(track) => handlePlayTrack(track.id, track)}
              onAddTrack={(track, fid) => handleAddTrackToFolder(track, fid)}
            />
          )}
          {activeView === 'mixes' && (
            <MuraMixes />
          )}

          {isExpandedView && (
            <PlayerExpansion 
              track={currentTrack} 
              onClose={() => setIsExpandedView(false)} 
              onPlaySimilar={(track) => handlePlayTrack(track.id, track)}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              isVideoVisible={isVideoVisible}
              onToggleVideo={() => setIsVideoVisible(!isVideoVisible)}
            />
          )}
        </main>
      </div>

      <MuraPlayer 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNextTrack}
        onBack={handlePrevTrack}
        isLiked={currentTrack ? library.likedTrackIds.includes(currentTrack.id) : false}
        onToggleLike={handleToggleLike}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onToggleExpand={() => setIsExpandedView(!isExpandedView)}
        repeatMode={repeatMode}
        isExpanded={isExpandedView}
        isVideoVisible={isVideoVisible}
        onToggleRepeat={() => setRepeatMode(prev => {
          if (prev === 'off') return 'queue';
          if (prev === 'queue') return 'one';
          return 'off';
        })}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
