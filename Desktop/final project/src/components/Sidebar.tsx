"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { 
  Home, 
  Search,
  PlusCircle, 
  FolderHeart, 
  MessageSquare, 
  Briefcase, 
  Settings,
  BellRing,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { t, dir } = useLanguage();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [msgRes, notifRes] = await Promise.all([
          fetch("/api/messages/unread-count"),
          fetch("/api/notifications/unread-count")
        ]);
        const msgData = await msgRes.json();
        const notifData = await notifRes.json();
        
        if (msgData.success) setUnreadMessages(msgData.data);
        if (notifData.success) setUnreadNotifications(notifData.data);
      } catch (error) {
        console.error("Failed to fetch sidebar counts", error);
      }
    };

    fetchCounts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.reportLost"), href: "/report/lost", icon: Search },
    { name: t("nav.reportFound"), href: "/report/found", icon: PlusCircle },
    { name: t("nav.myPosts"), href: "/my-posts", icon: FolderHeart },
    { name: t("nav.messages"), href: "/messages", icon: MessageSquare, badge: unreadMessages },
    { name: t("notif.title"), href: "/notifications", icon: BellRing, badge: unreadNotifications },
    { name: t("nav.businesses"), href: "/businesses", icon: Briefcase },
  ];


  return (
    <aside className={cn(
      "flex flex-col border-r bg-card/80 backdrop-blur-xl transition-all duration-300 h-full",
      className
    )} dir={dir}>
      <div className="h-16 flex items-center justify-between px-6 border-b">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
          <div className="relative shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e3a8a"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="url(#logo-bg)"/>
              <circle cx="14" cy="13" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
              <line x1="18.5" y1="17.5" x2="22" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-black text-lg tracking-tight">Recover<span className="text-primary">It</span></span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-2 md:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-3">
          {t("nav.menu")}
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {item.name}
              </div>
              {item.badge > 0 && (
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full",
                  isActive ? "bg-white text-primary" : "bg-primary text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Settings size={18} />
          {t("nav.settings")}
        </Link>
      </div>
    </aside>
  );
}
