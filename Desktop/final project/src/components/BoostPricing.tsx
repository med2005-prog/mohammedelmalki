"use client";

import { useState } from "react";
import {
  Check, Zap, Star, Crown, Sparkles, Rocket,
  Loader2, ShieldCheck, ArrowRight, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface BoostPricingProps {
  postId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type PlanId = "starter" | "basic" | "standard" | "pro" | "premium";

interface Plan {
  id: PlanId;
  name: string;
  nameAr: string;
  price: number;
  priceLabel: string;
  duration: string;
  durationAr: string;
  visibility: string;
  features: string[];
  featuresAr: string[];
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  popular?: boolean;
  crown?: boolean;
  freeLabel?: string;
  badge?: string;
  badgeColor?: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    nameAr: "المبتدئ",
    price: 0,
    priceLabel: "مجاناً",
    duration: "12 hours",
    durationAr: "12 ساعة",
    visibility: "×2",
    freeLabel: "مرة واحدة فقط",
    features: ["x2 Visibility", "Appears higher in listings"],
    featuresAr: ["ضعف الظهور", "يظهر أعلى في القائمة"],
    icon: Zap,
    gradient: "from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-500",
  },
  {
    id: "basic",
    name: "Basic",
    nameAr: "الأساسي",
    price: 10,
    priceLabel: "10 MAD",
    duration: "24 hours",
    durationAr: "24 ساعة",
    visibility: "×3",
    features: ["x3 Visibility", "Higher in search results"],
    featuresAr: ["3× الظهور", "أعلى في نتائج البحث"],
    icon: Sparkles,
    gradient: "from-blue-400 to-indigo-500",
    iconBg: "bg-blue-500",
  },
  {
    id: "standard",
    name: "Standard",
    nameAr: "القياسي",
    price: 25,
    priceLabel: "25 MAD",
    duration: "3 days",
    durationAr: "3 أيام",
    visibility: "×6",
    popular: true,
    badge: "Featured",
    badgeColor: "bg-primary text-white",
    features: ["x6 Visibility", "Top listings", '"Featured" badge'],
    featuresAr: ["6× الظهور", "قمة القائمة", 'شارة "مميز"'],
    icon: Star,
    gradient: "from-primary to-blue-600",
    iconBg: "bg-primary",
  },
  {
    id: "pro",
    name: "Pro",
    nameAr: "الاحترافي",
    price: 40,
    priceLabel: "40 MAD",
    duration: "5 days",
    durationAr: "5 أيام",
    visibility: "×8",
    badge: "Featured",
    badgeColor: "bg-violet-600 text-white",
    features: [
      "x8 Visibility",
      "Priority listing",
      '"Featured" badge',
      "Notify users in your city",
    ],
    featuresAr: [
      "8× الظهور",
      "قائمة أولوية",
      'شارة "مميز"',
      "إشعار لمستخدمي مدينتك",
    ],
    icon: Rocket,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-600",
  },
  {
    id: "premium",
    name: "Premium",
    nameAr: "البريميوم",
    price: 60,
    priceLabel: "60 MAD",
    duration: "7 days",
    durationAr: "7 أيام",
    visibility: "×10",
    crown: true,
    badge: "Urgent",
    badgeColor: "bg-amber-500 text-white",
    features: [
      "x10 Visibility",
      "Top of homepage",
      '"Featured" + "Urgent" badges',
      "City notifications",
      "Social media promotion",
    ],
    featuresAr: [
      "10× الظهور",
      "قمة الصفحة الرئيسية",
      'شارتا "مميز" و"عاجل"',
      "إشعارات المدينة",
      "ترويج على وسائل التواصل",
    ],
    icon: Crown,
    gradient: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-500",
  },
];

export function BoostPricing({ postId, onSuccess, onCancel }: BoostPricingProps) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selected = PLANS.find((p) => p.id === selectedPlan)!;

  const handleBoost = async () => {
    setLoading(true);
    setError(null);
    try {
      // Free "Starter" plan → direct API
      if (selectedPlan === "starter") {
        const res = await fetch(`/api/posts/${postId}/boost`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ boostPlan: selectedPlan }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Something went wrong.");
          return;
        }
        setSuccess(true);
        setTimeout(() => onSuccess(), 1800);
      } else {
        // Paid plans → Stripe Checkout
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            planId: selectedPlan,
            planName: selected.name,
            price: selected.price,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setError(data.error || "Payment failed. Please try again.");
          return;
        }
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-6"
      >
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
          <ShieldCheck className="text-green-500" size={48} />
        </div>
        <div>
          <h3 className="text-2xl font-black">تم تفعيل الترويج! 🎉</h3>
          <p className="text-muted-foreground mt-2">
            إعلانك الآن في المقدمة لـ {selected.durationAr}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 py-2" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
          <Rocket size={14} /> ترويج الإعلان
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          🚀 رَوّج إعلانك وزيد فرص الاسترجاع
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          اختار الباقة المناسبة وخلي إعلانك يوصل لأكبر عدد من الناس
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "relative flex flex-col p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-primary shadow-2xl shadow-primary/15 bg-primary/[0.03]"
                  : "border-border bg-background/80 hover:border-primary/40",
                plan.popular && !isSelected && "border-primary/30 shadow-lg"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                  الأكثر طلباً ⭐
                </span>
              )}

              {/* Crown for Premium */}
              {plan.crown && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                  👑 الأفضل
                </span>
              )}

              {/* Starter free badge */}
              {plan.freeLabel && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                  مجاني ✓
                </span>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center mb-4 text-white bg-gradient-to-br",
                  plan.gradient
                )}
              >
                <Icon size={20} />
              </div>

              {/* Name & Price */}
              <div className="mb-4 space-y-0.5">
                <h3 className="font-black text-base">{plan.nameAr}</h3>
                <div className="flex items-baseline gap-1">
                  {plan.id === "starter" ? (
                    <span className="text-2xl font-black text-emerald-600">مجاناً</span>
                  ) : (
                    <>
                      <span className="text-2xl font-black">{plan.price}</span>
                      <span className="text-xs font-bold text-muted-foreground">درهم</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-semibold">
                  لمدة {plan.durationAr} · {plan.visibility} ظهور
                </p>
                {plan.freeLabel && (
                  <span className="text-[10px] font-black text-emerald-600">
                    {plan.freeLabel}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-5 flex-1">
                {plan.featuresAr.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs font-medium">
                    <div className="w-4 h-4 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Badge preview */}
              {plan.badge && (
                <span
                  className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-full w-fit mb-3",
                    plan.badgeColor
                  )}
                >
                  {plan.badge}
                </span>
              )}

              {/* Select indicator */}
              <div
                className={cn(
                  "w-full py-2 rounded-xl text-xs font-black text-center transition-all",
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {isSelected ? "✓ محدد" : "اختر"}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected plan summary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPlan}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shrink-0",
                selected.gradient
              )}
            >
              <selected.icon size={22} />
            </div>
            <div>
              <p className="font-black text-lg">{selected.nameAr}</p>
              <p className="text-sm text-muted-foreground">
                {selected.durationAr} · {selected.visibility} ظهور
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-3xl font-black text-primary">
              {selected.id === "starter" ? "مجاناً" : `${selected.price} MAD`}
            </p>
            {selected.id === "starter" && (
              <p className="text-xs font-bold text-emerald-600">مرة واحدة فقط</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
          <X size={18} className="shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleBoost}
          disabled={loading}
          className={cn(
            "flex-1 flex items-center justify-center gap-3 font-black py-4 px-8 rounded-2xl text-lg transition-all shadow-xl active:scale-[0.98]",
            "bg-gradient-to-l from-primary to-blue-600 text-white shadow-primary/25 hover:opacity-90 disabled:opacity-50"
          )}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <>
              <Rocket size={20} />
              {selected.id === "starter" ? "⚡ فعّل الترويج" : "🚀 رَوّج الآن"}
              <ArrowRight size={18} className="rotate-180" />
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-8 py-4 rounded-2xl font-bold border border-border hover:bg-secondary transition-all text-muted-foreground"
        >
          لاحقاً
        </button>
      </div>

      {/* Trust footer */}
      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-green-500" />
        الدفع الآمن عبر CMI · ضمان استرجاع المبلغ إذا لم تكن راضياً
      </p>
    </div>
  );
}
