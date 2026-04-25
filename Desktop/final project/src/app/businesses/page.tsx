"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Briefcase, MapPin, Star, ShieldCheck, ArrowRight, Building2, Store, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BusinessesPage() {
  const { t, dir, language } = useLanguage();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/users?isBusiness=true");
        const data = await response.json();
        if (data.success) {
          setPartners(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12" dir={dir}>
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden mb-16 bg-slate-950 text-white">
         <div className="absolute inset-0 opacity-40">
            <Image 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
              alt="Business Partners" 
              fill 
              className="object-cover"
            />
         </div>
         <div className="relative z-10 p-12 md:p-20 flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-[0.2em] mb-6">
               <Briefcase size={14} className="text-primary" />
               {t("biz.title")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
               {t("biz.hero.title")}
            </h1>
            <p className="text-lg text-white/70 mb-10 font-medium">
               {t("biz.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link href="/signup?type=business" className="px-8 py-3 bg-primary text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-xl shadow-primary/40">
                  {t("biz.hero.btnRegister")}
               </Link>
               <button className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black hover:bg-white/20 transition-all">
                  {t("biz.hero.howItWorks")}
               </button>
            </div>
         </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
         {[
           { icon: ShieldCheck, title: t("biz.card1.title"), desc: t("biz.card1.desc") },
           { icon: Store, title: t("biz.card2.title"), desc: t("biz.card2.desc") },
           { icon: Building2, title: t("biz.card3.title"), desc: t("biz.card3.desc") }
         ].map((feat, idx) => (
           <div key={idx} className="p-8 bg-card border rounded-[2rem] hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                 <feat.icon size={24} />
              </div>
              <h3 className="text-lg font-black mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
           </div>
         ))}
      </div>

      {/* Partner List */}
      <div className="mb-12">
         <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-4 gap-4">
            <h2 className="text-2xl font-black tracking-tight">{t("biz.activePartners")}</h2>
            <Link href="/map" className="text-sm font-black text-primary hover:underline inline-flex items-center gap-1">
               {t("biz.viewMap")} <ArrowRight size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
         </div>
         {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="animate-spin text-primary" size={40} />
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {partners.length > 0 ? partners.map((partner) => (
               <div key={partner._id} className="bg-card border rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all">
                  <div className="relative h-48">
                     <Image src={partner.avatar || "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=400&auto=format&fit=crop"} alt={partner.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary">
                        {partner.businessType || t("biz.partner")}
                     </div>
                  </div>
                  <div className="p-6">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black text-lg group-hover:text-primary transition-colors">{partner.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                           <Star size={14} fill="currentColor" />
                           {partner.rating || "4.8"}
                        </div>
                     </div>
                     <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold mb-6">
                        <MapPin size={14} />
                        {partner.city || (language === 'ar' ? 'أكادير' : 'Agadir')}, {language === 'ar' ? 'المغرب' : 'Morocco'}
                     </div>
                     <button className="w-full py-3 bg-secondary rounded-xl font-black text-sm hover:bg-primary hover:text-white transition-all">
                        {t("biz.contact")}
                     </button>
                  </div>
               </div>
               )) : (
                  <div className="col-span-1 md:col-span-3 py-20 text-center text-muted-foreground font-bold">
                     {t("biz.empty")}
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
}
