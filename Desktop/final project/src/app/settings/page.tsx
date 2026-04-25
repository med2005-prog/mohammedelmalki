"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  User, 
  Bell, 
  Globe, 
  LogOut, 
  ChevronRight,
  Camera
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t, dir, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Member",
    phone: user?.phone || "+212 6XX-XXXXXX"
  });
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    matching: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "Member",
        phone: user.phone || "+212 6XX-XXXXXX"
      });
      if ((user as any).notifications) {
        setNotifications((user as any).notifications);
      }
    }
  }, [user]);

  const saveProfile = async (updates: any) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (err) {
      console.error(err);
      alert(t("settings.saveError") || "Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      id: "profile",
      title: t("settings.profile"),
      icon: User,
      items: [
        { label: t("settings.editName"), value: profileData.name, key: "name", editable: true },
        { label: t("settings.email"), value: user?.email || "mohammed@example.com", editable: false },
        { label: t("settings.phone"), value: profileData.phone, key: "phone", editable: true }
      ]
    },
    {
      id: "notifications",
      title: t("settings.notifications"),
      icon: Bell,
      items: [
        { label: t("settings.push"), type: "toggle", key: "push" },
        { label: t("settings.emailUpdates"), type: "toggle", key: "email" },
        { label: t("settings.matchingAlerts"), type: "toggle", key: "matching" }
      ]
    },
    {
      id: "appearance",
      title: t("settings.appearance"),
      icon: Globe,
      items: [
        { 
          label: t("settings.language"), 
          type: "select", 
          options: [
            { code: "en", name: "English" },
            { code: "fr", name: "Français" },
            { code: "ar", name: "العربية" }
          ],
          current: language
        },
        { label: t("settings.darkMode"), type: "toggle", key: "darkMode", value: isDarkMode }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={dir}>
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">{t("nav.settings")}</h1>
        <p className="text-muted-foreground mt-1 font-bold">
           {language === 'ar' ? "قم بتخصيص حسابك وتفضيلاتك." : "Personalize your account and preferences."}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-1">
          {sections.map((section) => (
            <button 
              key={section.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                section.id === "profile" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <section.icon size={18} />
              {section.title}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut size={18} />
              {t("auth.form.logout")}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-card border rounded-3xl p-6 flex items-center gap-6">
             <div className="relative group">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                   {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={40} className="text-muted-foreground" />}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow-lg border-2 border-background">
                   <Camera size={12} />
                </button>
             </div>
             <div>
                <h3 className="text-lg font-black tracking-tight">{user?.name || "Member"}</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  {t("profile.memberSince")} 2024
                </p>
             </div>
          </div>

          {sections.map((section) => (
            <div key={section.id} className="bg-card border rounded-3xl overflow-hidden">
               <div className="px-6 py-4 border-b bg-muted/30">
                  <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{section.title}</h4>
               </div>
               <div className="divide-y divide-border">
                  {section.items.map((item: any, idx: number) => (
                    <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                       <span className="text-sm font-bold text-foreground">{item.label}</span>
                       
                       {item.type === "toggle" ? (
                         <button 
                           onClick={() => {
                             if (item.key === "darkMode") setIsDarkMode(!isDarkMode);
                             else setNotifications(prev => ({ ...prev, [item.key!]: !prev[item.key as keyof typeof prev] }));
                           }}
                           className={cn(
                             "w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none",
                             (item.key === "darkMode" ? isDarkMode : (notifications as any)[item.key!]) ? "bg-primary" : "bg-muted-foreground/30"
                           )}
                         >
                           <div className={cn(
                             "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                             dir === 'rtl' 
                               ? ((item.key === "darkMode" ? isDarkMode : (notifications as any)[item.key!]) ? "-translate-x-6" : "-translate-x-1")
                               : ((item.key === "darkMode" ? isDarkMode : (notifications as any)[item.key!]) ? "translate-x-6" : "translate-x-1")
                           )} />
                         </button>
                       ) : item.type === "select" ? (
                         <div className="flex gap-2">
                            {item.options?.map((opt: any) => (
                              <button 
                                key={opt.code}
                                onClick={() => setLanguage(opt.code as any)}
                                className={cn(
                                  "px-3 py-1 rounded-lg text-xs font-black transition-all",
                                  language === opt.code ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {opt.name}
                              </button>
                            ))}
                         </div>
                       ) : (
                         <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground group cursor-pointer hover:text-primary transition-colors">
                           {item.value}
                           <ChevronRight size={14} className={cn("transition-transform", dir === 'rtl' ? 'rotate-180' : '')} />
                         </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          ))}

          <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-3xl flex items-center justify-between gap-4">
             <div>
                <h4 className="text-sm font-black text-destructive">{t("settings.accountDeletion")}</h4>
                <p className="text-xs text-muted-foreground mt-1 font-bold">{t("settings.deleteDesc")}</p>
             </div>
             <button className="px-4 py-2 border border-destructive/30 rounded-xl text-xs font-black text-destructive hover:bg-destructive hover:text-white transition-all whitespace-nowrap">
                {t("settings.deleteBtn")}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
