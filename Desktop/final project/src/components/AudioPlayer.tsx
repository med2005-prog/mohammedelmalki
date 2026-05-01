"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Loader2, Mic } from "lucide-react";
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
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Consistent waveform bars
  const [waveformBars] = useState(() => 
    [...Array(30)].map(() => Math.random() * 0.6 + 0.3)
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
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

  const toggleSpeed = () => {
    const rates = [1, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / (duration || 1));

  return (
    <div className={cn(
      "flex items-center gap-3 py-1 min-w-[280px] max-w-full group",
      isSender ? "text-white" : "text-foreground"
    )}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Avatar with Mic Indicator */}
      <div className="relative shrink-0">
        <div className={cn(
          "w-11 h-11 rounded-full overflow-hidden border border-white/20 shadow-md",
          isSender ? "bg-white/20" : "bg-secondary"
        )}>
          {avatar ? (
            <Image src={avatar} alt="" width={44} height={44} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-40">
               <Mic size={20} />
            </div>
          )}
        </div>
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-background",
          isSender ? "bg-white text-primary" : "bg-primary text-white"
        )}>
          <Mic size={8} strokeWidth={4} />
        </div>
      </div>

      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        disabled={isLoading}
        className="shrink-0 transition-transform active:scale-90"
      >
        {isLoading ? (
          <Loader2 className="animate-spin opacity-50" size={24} />
        ) : isPlaying ? (
          <Pause size={24} fill="currentColor" />
        ) : (
          <Play size={24} fill="currentColor" />
        )}
      </button>

      {/* Waveform & Time */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="relative h-6 flex items-center gap-[2px] w-full">
          {waveformBars.map((height, i) => {
            const barProgress = i / waveformBars.length;
            const isActive = progress >= barProgress;
            return (
              <div 
                key={i}
                className={cn(
                  "w-[2px] rounded-full transition-all duration-150",
                  isActive 
                    ? (isSender ? "bg-white" : "bg-primary") 
                    : (isSender ? "bg-white/30" : "bg-primary/20")
                )}
                style={{ 
                  height: `${height * 100}%`,
                }}
              />
            );
          })}
          
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              const time = parseFloat(e.target.value);
              setCurrentTime(time);
              if (audioRef.current) audioRef.current.currentTime = time;
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
        
        <div className="flex justify-between items-center text-[10px] opacity-70 font-bold">
           <span>{formatTime(currentTime)}</span>
           <span>{duration > 0 ? formatTime(duration) : ""}</span>
        </div>
      </div>

      {/* Speed Button (Appears on right like WhatsApp) */}
      <button 
        onClick={toggleSpeed}
        className={cn(
          "shrink-0 px-1.5 py-0.5 rounded bg-black/5 text-[10px] font-black tracking-tighter transition-all hover:bg-black/10",
          isSender ? "text-white bg-white/20" : "text-primary bg-primary/5"
        )}
      >
        {playbackRate}x
      </button>
    </div>
  );
}
