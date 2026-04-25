"use client";

import { useState, useEffect } from "react";
import { Phone, PhoneOff, Video, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import { CallInterface } from "./CallInterface";

export function IncomingCallListener() {
  const { user } = useAuth();
  const { language, dir } = useLanguage();
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [activeCall, setActiveCall] = useState<any>(null);
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkCalls = async () => {
      try {
        const res = await fetch("/api/calls");
        const data = await res.json();
        if (data.success && data.data) {
          if (!activeCall && !isRinging) {
            setIncomingCall(data.data);
            setIsRinging(true);
            // Play ringtone
            const audio = new Audio("/sounds/ringtone.mp3");
            audio.play().catch(() => {});
          }
        }
      } catch (err) {
        console.error("Failed to check calls", err);
      }
    };

    const interval = setInterval(checkCalls, 4000);
    return () => clearInterval(interval);
  }, [user, activeCall, isRinging]);

  const handleAccept = () => {
    setActiveCall(incomingCall);
    setIsRinging(false);
  };

  const handleReject = async () => {
    try {
      await fetch("/api/calls/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId: incomingCall._id, status: "rejected" })
      });
    } catch (err) {
      console.error(err);
    }
    setIncomingCall(null);
    setIsRinging(false);
  };

  return (
    <>
      <AnimatePresence>
        {isRinging && incomingCall && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] w-[350px] bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-6 text-white"
            dir={dir}
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1 animate-pulse">
                  {incomingCall.caller?.avatar ? (
                    <Image src={incomingCall.caller.avatar} alt="" width={96} height={96} className="rounded-full object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-3xl font-black">
                      {incomingCall.caller?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-full shadow-lg">
                  {incomingCall.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black">{incomingCall.caller?.name}</h3>
                <p className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
                  {incomingCall.type === 'video' 
                    ? (language === 'ar' ? "مكالمة فيديو واردة..." : "Incoming Video Call...") 
                    : (language === 'ar' ? "مكالمة صوتية واردة..." : "Incoming Voice Call...")}
                </p>
              </div>

              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={handleReject}
                  className="flex-1 bg-destructive/20 text-destructive border border-destructive/30 py-4 rounded-2xl flex items-center justify-center gap-2 font-black hover:bg-destructive/30 transition-all"
                >
                  <PhoneOff size={20} />
                  {language === 'ar' ? "رفض" : "Reject"}
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  <Phone size={20} />
                  {language === 'ar' ? "رد" : "Answer"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCall && (
        <CallInterface
          userName={activeCall.caller?.name || activeCall.receiver?.name}
          userAvatar={activeCall.caller?.avatar || activeCall.receiver?.avatar}
          mode={activeCall.type}
          status="connected"
          onEnd={() => setActiveCall(null)}
          callId={activeCall._id}
          isIncoming={!!activeCall.caller}
        />
      )}
    </>
  );
}
