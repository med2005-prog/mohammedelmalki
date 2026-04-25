"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current && audioBlob) {
      audioRef.current = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-3 bg-secondary/80 backdrop-blur-md p-2 px-4 rounded-full border border-primary/20 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
      {isRecording ? (
        <>
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="text-sm font-mono font-bold w-12">{formatTime(recordingTime)}</span>
          </div>
          <div className="flex-1 h-8 bg-primary/5 rounded-lg flex items-center justify-center gap-1">
             {[...Array(12)].map((_, i) => (
               <div 
                 key={i} 
                 className="w-1 bg-primary rounded-full animate-grow" 
                 style={{ 
                   height: `${Math.random() * 80 + 20}%`,
                   animationDelay: `${i * 0.1}s` 
                 }} 
               />
             ))}
          </div>
          <button 
            onClick={stopRecording}
            className="p-2 bg-destructive text-white rounded-full hover:opacity-90 transition-all"
          >
            <Square size={16} fill="currentColor" />
          </button>
        </>
      ) : audioBlob ? (
        <>
          <button onClick={handlePlayPause} className="p-2 text-primary hover:bg-primary/10 rounded-full">
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <div className="flex-1 text-xs font-bold text-muted-foreground">
            {language === 'ar' ? "رسالة صوتية" : language === 'fr' ? "Message vocal" : "Audio Message"} ({formatTime(recordingTime)})
          </div>
          <button onClick={() => { setAudioBlob(null); onCancel(); }} className="p-2 text-muted-foreground hover:text-destructive">
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => onSend(audioBlob)}
            className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg shadow-primary/20"
          >
            {language === 'ar' ? "إرسال" : language === 'fr' ? "Envoyer" : "Send"}
          </button>
        </>
      ) : (
        <>
          <button 
            onClick={startRecording}
            className="flex items-center gap-2 p-2 px-4 bg-primary text-white rounded-full hover:opacity-90 transition-all"
          >
            <Mic size={18} />
            <span className="text-sm font-bold">
              {language === 'ar' ? "تسجيل صوتي" : language === 'fr' ? "Enregistrer" : "Record Audio"}
            </span>
          </button>
          <button onClick={onCancel} className="text-sm font-bold text-muted-foreground hover:text-foreground">
             {language === 'ar' ? "إلغاء" : "Cancel"}
          </button>
        </>
      )}
    </div>
  );
}
