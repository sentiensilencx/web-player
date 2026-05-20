
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, Monitor, Youtube, User, Music, ExternalLink, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";
import { User as FirebaseUser } from 'firebase/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  user: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function SettingsModal({ isOpen, onClose, isDarkMode, onToggleTheme, user, onLogin, onLogout }: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] bg-card border-border rounded-[2rem] p-8 font-body shadow-2xl z-[300]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-black tracking-tighter lowercase text-foreground">mura settings</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium lowercase text-xs">
            manage your profile and application interface.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 lowercase">user profile</h4>
            <div className="flex flex-col gap-4 p-5 rounded-2xl bg-background/50 border border-border/30">
               <div className="flex items-center gap-4">
                 <Avatar className="h-14 w-14 rounded-2xl border-2 border-primary/10 shadow-lg">
                   <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/mura-user/100/100"} />
                   <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                 </Avatar>
                 <div className="flex-1">
                   <p className="text-sm font-black lowercase leading-none mb-1.5">{user?.displayName || "mura guest"}</p>
                   <p className="text-[10px] text-muted-foreground lowercase">{user ? "connected via google" : "offline session"}</p>
                 </div>
                 {user && (
                   <Button variant="ghost" size="icon" onClick={onLogout} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                     <LogOut className="h-4 w-4" />
                   </Button>
                 )}
               </div>
               {!user ? (
                 <Button 
                  variant="outline" 
                  className="w-full h-11 rounded-xl text-[11px] font-bold lowercase gap-3 bg-primary text-primary-foreground border-none shadow-md hover:scale-[1.01] transition-transform"
                  onClick={onLogin}
                 >
                   <Youtube className="h-4 w-4" />
                   link youtube account
                   <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                 </Button>
               ) : (
                 <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                   <Youtube className="h-4 w-4 text-[#FF0000]" />
                   <span className="text-[10px] font-black text-green-600 lowercase tracking-tight">account linked & synced</span>
                 </div>
               )}
            </div>
          </div>

          <Separator className="opacity-20" />

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 lowercase">appearance</h4>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center">
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold lowercase">theme mode</Label>
                  <p className="text-[10px] text-muted-foreground font-medium lowercase">{isDarkMode ? 'midnight' : 'cream'}</p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onToggleTheme} />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center">
                  <Monitor className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold lowercase">reduced motion</Label>
                  <p className="text-[10px] text-muted-foreground font-medium lowercase">optimize for speed</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>

          <Separator className="opacity-20" />

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 lowercase">streaming backends</h4>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center">
                  <Youtube className="h-4 w-4 text-[#FF0000]" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold lowercase">youtube music</Label>
                  <p className="text-[10px] text-muted-foreground font-medium lowercase">active (api v3)</p>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-tight border-primary/20 text-primary">active</div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8">
          <Button onClick={onClose} className="w-full h-14 rounded-2xl font-bold lowercase tracking-tight text-sm shadow-xl hover:scale-[1.01] transition-transform border-none">
            save settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
