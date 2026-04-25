"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Laptop, 
  Wallet, 
  Key, 
  Dog, 
  Briefcase, 
  Package, 
  Watch, 
  Glasses, 
  Camera, 
  Smartphone,
  Car,
  Gift,
  ChevronRight,
  Search
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CategoriesPage() {
  const { t, dir, language } = useLanguage();

  const categories = [
    { name: t("cat.electronics"), icon: Laptop, slug: "electronics", count: 124, color: "text-blue-500 bg-blue-500/10" },
    { name: t("cat.wallets"), icon: Wallet, slug: "wallets", count: 86, color: "text-amber-500 bg-amber-500/10" },
    { name: t("cat.keys"), icon: Key, slug: "keys", count: 53, color: "text-emerald-500 bg-emerald-500/10" },
    { name: t("cat.pets"), icon: Dog, slug: "pets", count: 42, color: "text-orange-500 bg-orange-500/10" },
    { name: t("cat.bags"), icon: Briefcase, slug: "bags", count: 38, color: "text-purple-500 bg-purple-500/10" },
    { name: t("cat.other"), icon: Gift, slug: "other", count: 22, color: "text-gray-500 bg-gray-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" dir={dir}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
         <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            {t("sidebar.categories")}
         </h1>
         <p className="text-lg text-muted-foreground font-medium">
            {language === 'ar' 
              ? "اختر فئة للعثور على العناصر المفقودة أو المبلغ عنها بشكل أسرع." 
              : language === 'fr'
              ? "Choisissez une catégorie pour trouver plus rapidement les objets perdus ou signalés."
              : "Choose a category to find lost or reported items faster. Our smart filters help narrow down your search."}
         </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-16">
         <div className="relative">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", dir === 'rtl' ? "right-6" : "left-6")} size={20} />
            <input 
              type="text" 
              placeholder={t("topbar.search")}
              className={cn("w-full bg-card border-2 border-border/50 rounded-3xl py-4 text-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all", 
                dir === 'rtl' ? "pr-14 pl-6" : "pl-14 pr-32"
              )}
            />
            <button className={cn("absolute top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-white text-sm font-black rounded-2xl hover:opacity-90 transition-all shadow-md",
              dir === 'rtl' ? "left-3" : "right-3"
            )}>
              {t("topbar.btnSearch")}
            </button>
         </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {categories.map((cat) => (
           <Link 
             key={cat.slug} 
             href={`/category/${cat.slug}`}
             className="group bg-card border border-border/50 rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
           >
             <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110", cat.color)}>
                <cat.icon size={36} />
             </div>
             <h3 className="font-black text-lg mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>{cat.count} {t("nav.home")}</span>
                <ChevronRight size={14} className={cn("transition-transform group-hover:translate-x-1", dir === 'rtl' ? "rotate-180 group-hover:-translate-x-1" : "")} />
             </div>
           </Link>
         ))}
      </div>

      {/* Help Section */}
      <div className="mt-24 p-12 bg-primary/5 rounded-[3rem] border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="max-w-md">
            <h2 className="text-2xl font-black mb-4">
              {language === 'ar' ? "لم تجد ما تبحث عنه؟" : "Can't find a specific category?"}
            </h2>
            <p className="text-muted-foreground font-medium">
               {language === 'ar' 
                 ? "تستخدم خوارزمية المطابقة لدينا أيضاً الذكاء الاصطناعي لمسح أوصاف العناصر، لذلك حتى لو اخترت \"أخرى\"، فسنظل نجد أفضل التطابقات."
                 : "Our matching algorithm also uses AI to scan item descriptions, so even if you choose \"Other\", we'll still find the best matches."}
            </p>
         </div>
         <Link 
            href="/report/lost"
            className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
          >
            {t("hero.btnLost")}
         </Link>
      </div>
    </div>
  );
}
