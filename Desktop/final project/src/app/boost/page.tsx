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
    id: "basic" as PlanId,
    name: { en: "Basic", fr: "Basique", ar: "الأساسي" },
    yearlyPrice: 64,
    monthlyPrice: "8",
    features: {
      en: ["3x Visibility", "Basic Badge"],
      fr: ["3x Visibilité", "Badge Basique"],
      ar: ["ظهور 3x", "شارة أساسية"]
    },
    topBg: "bg-zinc-100",
  },
  {
    id: "standard" as PlanId,
    name: { en: "Standard", fr: "Standard", ar: "القياسي" },
    yearlyPrice: 144,
    monthlyPrice: "15",
    features: {
      en: ["6x Visibility", "Top of list", '"Featured" Badge'],
      fr: ["6x Visibilité", "Haut de liste", 'Badge "Sponsorisé"'],
      ar: ["ظهور 6x", "قمة القائمة", 'شارة "مميز"']
    },
    topBg: "bg-zinc-100",
  },
  {
    id: "pro" as PlanId,
    name: { en: "Professional", fr: "Professionnel", ar: "الاحترافي" },
    yearlyPrice: 240,
    monthlyPrice: "25",
    popular: true,
    features: {
      en: ["8x Visibility", "City Notifications", "Priority Support"],
      fr: ["8x Visibilité", "Notifications Ville", "Support Prioritaire"],
      ar: ["ظهور 8x", "إشعارات للمدينة", "دعم أولوية"]
    },
    topBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
  },
  {
    id: "premium" as PlanId,
    name: { en: "Premium", fr: "Premium", ar: "البريميوم" },
    yearlyPrice: 360,
    monthlyPrice: "37",
    features: {
      en: ["12x Visibility", "Full Prominence", "VIP Support"],
      fr: ["12x Visibilité", "Mise en avant totale", "Support VIP"],
      ar: ["ظهور 12x", "تصدر شامل", "دعم VIP"]
    },
    topBg: "bg-zinc-100",
  },
];

export default function BoostPage() {
  const { t, dir, language } = useLanguage();
  const [selected, setSelected] = useState<PlanId>("standard");
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();
  const selectedPlan = PLANS.find((p) => p.id === selected)!;
  const lang = language as "en" | "fr" | "ar";

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12" dir={dir}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10">
          {t("boost.title")}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900">
           {t("boost.heroTitle")}
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          {t("boost.subtitle")}
        </p>

        {/* Toggle Switch */}
        <div className="flex justify-center mt-8 mb-6">
          <div className="bg-zinc-100 p-1 rounded-full flex items-center relative">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                !isYearly ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {t("boost.monthly")}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2",
                isYearly ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {t("boost.yearly")}
              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {t("boost.save20")}
              </span>
            </button>
            <div
              className={cn(
                "absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out",
                isYearly ? (dir === 'rtl' ? "left-1 right-[50%]" : "right-1 left-[50%]") : (dir === 'rtl' ? "left-[50%] right-1" : "right-[50%] left-1")
              )}
            />
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelected(plan.id)}
              className={cn(
                "relative flex flex-col p-2.5 rounded-[2rem] border-2 cursor-pointer transition-all duration-200 bg-white shadow-sm",
                isSelected
                  ? "border-zinc-900 shadow-xl"
                  : "border-transparent hover:border-zinc-200"
              )}
            >
              {/* Top Section */}
              <div className={cn("rounded-[1.5rem] p-6 mb-2 flex flex-col", plan.topBg)}>
                <div className="bg-white/90 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full text-[11px] font-black mb-4 uppercase tracking-wider text-zinc-900 shadow-sm border border-zinc-200/50">
                  {plan.name[lang]}
                </div>
                <div className="flex items-end gap-1.5 mt-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-black text-zinc-900 leading-none">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice.replace("~", "")}
                  </span>
                  <span className="text-sm font-bold text-zinc-500 mb-1">
                    {isYearly ? t("boost.dhPerYear") : t("boost.dhPerMonth")}
                  </span>
                </div>
                {isYearly && (
                  <p className="text-xs font-bold text-zinc-400 mt-3">
                    ~{Math.round(plan.yearlyPrice / 12)} {t("boost.dhPerMonth")}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                className={cn(
                  "w-[calc(100%-1rem)] mx-auto rounded-full py-4 px-6 font-bold mt-2 mb-6 transition-all text-sm sm:text-base",
                  isSelected
                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/20"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                )}
              >
                {isSelected ? "✓" : t("boost.choose")}
              </button>

              {/* Features */}
              <div className="px-5 pb-5 flex-1">
                <ul className="space-y-3.5">
                  {plan.features[lang].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-semibold text-zinc-600">
                      <Check size={16} className="text-zinc-300 shrink-0" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="max-w-xl mx-auto space-y-4 text-center">
        <button
          onClick={() => router.push("/my-posts")}
          className="w-full flex items-center justify-center gap-3 font-black py-4 px-8 rounded-2xl text-lg transition-all shadow-xl bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-zinc-900/20 active:scale-[0.98]"
        >
          {t("boost.chooseToBoost")}
          <ArrowRight size={20} className={dir === 'rtl' ? "rotate-180" : ""} />
        </button>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck size={13} className="text-green-500" />
          {t("boost.securePayment")}
        </p>
      </div>
    </div>
  );
}
