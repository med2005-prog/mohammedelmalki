"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AudioPlayerProps {
  src: string;
  isSender?: boolean;
  avatar?: string;
}

export function AudioPlayer({ src, isSender, avatar }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate a random-looking but consistent waveform
  const waveformBars = useRef([...Array(35)].map(() => Math.random() * 0.8 + 0.2));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / (duration || 1));

  return (
    <div className={cn(
      "flex items-center gap-3 p-2 min-w-[280px] rounded-2xl transition-all",
      isSender ? "bg-primary/5" : "bg-secondary/50"
    )}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Avatar with Mic Icon (WhatsApp style) */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-sm bg-muted">
          {avatar ? (
            <Image src={avatar} alt="User" width={48} height={48} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">?</div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-md border border-border">
          <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </div>
      </div>

      {/* Play Button */}
      <button 
        onClick={togglePlay}
        disabled={isLoading}
        className="text-foreground hover:scale-110 active:scale-95 transition-all p-1"
      >
        {isLoading ? (
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        ) : isPlaying ? (
          <Pause size={28} fill="currentColor" />
        ) : (
          <Play size={28} fill="currentColor" />
        )}
      </button>

      {/* Waveform Area */}
      <div className="flex-1 flex flex-col gap-1 pr-2">
        <div className="relative h-10 flex items-center gap-[2px]">
          {waveformBars.current.map((height, i) => {
            const barProgress = i / waveformBars.current.length;
            const isActive = progress >= barProgress;
            return (
              <div 
                key={i}
                className={cn(
                  "w-[3px] rounded-full transition-all duration-300",
                  isActive ? "bg-primary" : "bg-muted-foreground/30"
                )}
                style={{ height: `${height * 100}%` }}
              />
            );
          })}
          
          {/* Transparent seeker overlay */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onChange={(e) => {
              const time = parseFloat(e.target.value);
              setCurrentTime(time);
              if (audioRef.current) audioRef.current.currentTime = time;
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
        
        {/* Timestamp */}
        <div className="text-[10px] font-bold text-muted-foreground/70">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}
