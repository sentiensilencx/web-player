
"use client";

import React from 'react';
import { Sparkles, Play, Music, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function MuraMixes() {
  const mockMixes = [
    { id: 'm1', name: 'My Supermix', description: 'Your favorite tracks and more.', color: 'bg-blue-500/10', icon: <Sparkles className="h-8 w-8 text-blue-500" /> },
    { id: 'm2', name: 'New Release Mix', description: 'Fresh tracks just for you.', color: 'bg-green-500/10', icon: <Music className="h-8 w-8 text-green-500" /> },
    { id: 'm3', name: 'Chill Mix', description: 'Perfect for late night vibes.', color: 'bg-purple-500/10', icon: <Heart className="h-8 w-8 text-purple-500" /> },
    { id: 'm4', name: 'Energy Mix', description: 'Get your blood pumping.', color: 'bg-orange-500/10', icon: <Play className="h-8 w-8 text-orange-500" /> },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden font-body">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
           <Sparkles className="h-5 w-5 text-primary" />
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground lowercase">curated for you</p>
        </div>
        <h1 className="text-5xl font-black mb-6 tracking-tighter lowercase leading-none">your mixes</h1>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-8 pt-2 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockMixes.map(mix => (
              <Card key={mix.id} className="group relative aspect-square rounded-[2rem] bg-card border-border/30 overflow-hidden cursor-pointer hover:border-primary/30 transition-all shadow-sm">
                <div className={`absolute inset-0 ${mix.color} opacity-50`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform">
                    {mix.icon}
                  </div>
                  <h3 className="text-lg font-black tracking-tight leading-tight lowercase mb-1">{mix.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium lowercase px-4">{mix.description}</p>
                </div>
                <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Play className="h-4 w-4 fill-current text-primary-foreground" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
             <div className="flex items-center gap-3 mb-6">
                <Music className="h-4 w-4 text-primary" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest lowercase">trending genres</p>
             </div>
             <div className="flex flex-wrap gap-3">
               {['alternative', 'lo-fi beats', 'modern jazz', 'indie soul', 'ambient focus', 'dream pop'].map(genre => (
                 <Badge key={genre} variant="outline" className="px-6 py-2.5 rounded-2xl border-border/40 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer text-[11px] font-bold lowercase">
                    {genre}
                 </Badge>
               ))}
             </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
