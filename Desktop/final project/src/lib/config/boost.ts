export type BoostPlan = "starter" | "basic" | "standard" | "pro" | "premium";

export interface BoostConfigItem {
  durationHours: number;
  rank: number;
  price: number; // MAD
  isFree: boolean;
}

export const BOOST_CONFIG: Record<BoostPlan, BoostConfigItem> = {
  starter:  { durationHours: 12,  rank: 1, price: 0,  isFree: true },
  basic:    { durationHours: 24,  rank: 2, price: 10,  isFree: false },
  standard: { durationHours: 72,  rank: 3, price: 25,  isFree: false },
  pro:      { durationHours: 120, rank: 4, price: 40,  isFree: false },
  premium:  { durationHours: 168, rank: 5, price: 60,  isFree: false },
};

export const VALID_PLANS = Object.keys(BOOST_CONFIG) as BoostPlan[];
