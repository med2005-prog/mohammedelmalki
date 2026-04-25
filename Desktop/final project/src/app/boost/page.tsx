"use client";

import { useState } from "react";
import {
  Check, Zap, Star, Crown, Sparkles, Rocket,
  ShieldCheck, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

type PlanId = "starter" | "basic" | "standard" | "pro" | "premium";

const PLANS = [
  {
    id: "starter" as PlanId,
    name: { en: "Starter", fr: "Débutant", ar: "المبتدئ" },
    price: 0,
    duration: { en: "12 hours", fr: "12 heures", ar: "12 ساعة" },
    visibility: "×2",
    freeLabel: { en: "One-time", fr: "Une fois", ar: "مرة واحدة" },
    features: {
      en: ["2× Visibility", "Higher in list"],
      fr: ["2× Visibilité", "Plus haut dans la liste"],
      ar: ["ضعف الظهور", "يظهر أعلى في القائمة"]
    },
    icon: Zap,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    id: "basic" as PlanId,
    name: { en: "Basic", fr: "Basique", ar: "الأساسي" },
    price: 10,
    duration: { en: "24 hours", fr: "24 heures", ar: "24 ساعة" },
    visibility: "×3",
    features: {
      en: ["3× Visibility", "Top search results"],
      fr: ["3× Visibilité", "Résultats de recherche"],
      ar: ["3× الظهور", "أعلى في نتائج البحث"]
    },
    icon: Sparkles,
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    id: "standard" as PlanId,
    name: { en: "Standard", fr: "Standard", ar: "القياسي" },
    price: 25,
    duration: { en: "3 days", fr: "3 jours", ar: "3 أيام" },
    visibility: "×6",
    popular: true,
    badge: "Featured",
    badgeColor: "bg-primary text-white",
    features: {
      en: ["6× Visibility", "Top of list", "Featured badge"],
      fr: ["6× Visibilité", "Haut de liste", "Badge Sponsorisé"],
      ar: ["6× الظهور", "قمة القائمة", 'شارة "مميز"']
    },
    icon: Star,
    gradient: "from-primary to-blue-600",
  },
  {
    id: "pro" as PlanId,
    name: { en: "Pro", fr: "Pro", ar: "الاحترافي" },
    price: 40,
    duration: { en: "5 days", fr: "5 jours", ar: "5 أيام" },
    visibility: "×8",
    badge: "Featured",
    badgeColor: "bg-violet-600 text-white",
    features: {
      en: ["8× Visibility", "Priority listing", "Featured badge", "City notifications"],
      fr: ["8× Visibilité", "Liste prioritaire", "Badge Sponsorisé", "Notifications ville"],
      ar: ["8× الظهور", "قائمة أولوية", 'شارة "مميز"', "إشعار لمستخدمي مدينتك"]
    },
    icon: Rocket,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "premium" as PlanId,
    name: { en: "Premium", fr: "Premium", ar: "البريميوم" },
    price: 60,
    duration: { en: "7 days", fr: "7 jours", ar: "7 أيام" },
    visibility: "×10",
    crown: true,
    badge: "Urgent",
    badgeColor: "bg-amber-500 text-white",
    features: {
      en: ["10× Visibility", "Top of home page", "Featured & Urgent badges", "Social media promotion"],
      fr: ["10× Visibilité", "Haut de page d'accueil", "Badges Sponsorisé & Urgent", "Promotion RS"],
      ar: ["10× الظهور", "قمة الصفحة الرئيسية", 'شارتا "مميز" و"عاجل"', "إشعارات المدينة", "ترويج على التواصل الاجتماعي"]
    },
    icon: Crown,
    gradient: "from-amber-400 to-orange-500",
  },
];

export default function BoostPage() {
  const { t, dir, language } = useLanguage();
  const [selected, setSelected] = useState<PlanId>("standard");
  const router = useRouter();
  const selectedPlan = PLANS.find((p) => p.id === selected)!;
  const lang = language as "en" | "fr" | "ar";

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12" dir={dir}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
          <Rocket size={14} /> {t("boost.title")}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
           {language === 'ar' ? "🚀 رَوّج إعلانك وزيد فرص الاسترجاع" : "🚀 Boost Your Post & Recover Faster"}
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          {t("boost.subtitle")}
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selected === plan.id;
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(plan.id)}
              className={cn(
                "relative flex flex-col p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 group",
                isSelected
                  ? "border-primary shadow-2xl shadow-primary/15 bg-primary/[0.03]"
                  : "border-border bg-background hover:border-primary/40",
                plan.popular && !isSelected && "border-primary/30 shadow-lg"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full tracking-widest shadow-lg whitespace-nowrap">
                   {t("boost.popular")}
                </span>
              )}
              {plan.crown && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full tracking-widest shadow-lg whitespace-nowrap">
                   {language === 'ar' ? "👑 الأفضل" : "👑 Best"}
                </span>
              )}

              <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center mb-4 text-white bg-gradient-to-br transition-transform group-hover:scale-110", plan.gradient)}>
                <Icon size={20} />
              </div>

              <div className="mb-4">
                <h3 className="font-black text-base">{plan.name[lang]}</h3>
                <div className="flex items-baseline gap-1 mt-0.5">
                  {plan.id === "starter" ? (
                    <span className="text-xl font-black text-emerald-600">
                      {language === 'ar' ? "مجاناً" : "FREE"}
                    </span>
                  ) : (
                    <>
                      <span className="text-xl font-black">{plan.price}</span>
                      <span className="text-xs font-bold text-muted-foreground">DH</span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                  {plan.duration[lang]} · {plan.visibility}
                </p>
              </div>

              <ul className="space-y-1.5 flex-1 mb-4">
                {plan.features[lang].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[11px] font-medium">
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/15 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={8} strokeWidth={3.5} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <div className={cn("w-full py-2 rounded-xl text-xs font-black text-center transition-all", isSelected ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-secondary text-muted-foreground")}>
                {isSelected ? "✓" : t("boost.choose")}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="max-w-xl mx-auto space-y-4 text-center">
        <button
          onClick={() => router.push("/my-posts")}
          className="w-full flex items-center justify-center gap-3 font-black py-4 px-8 rounded-2xl text-lg transition-all shadow-xl bg-gradient-to-l from-primary to-blue-600 text-white shadow-primary/25 hover:opacity-90"
        >
          <Rocket size={20} />
          {language === 'ar' ? "اختر إعلاناً لترويجه" : "Choose a post to boost"}
          <ArrowRight size={18} className={dir === 'rtl' ? "rotate-180" : ""} />
        </button>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck size={13} className="text-green-500" />
          {language === 'ar' ? "دفع آمن · ضمان استرجاع" : "Secure Payment · Money Back Guarantee"}
        </p>
      </div>
    </div>
  );
}
