import { BATTERY_LIMITS } from "./Constant";

export const BATTERY_CONFIG = {
  high: {
    bg: "bg-emerald-500",
    text: "text-emerald-300",
  },
  medium: {
    bg: "bg-amber-400",
    text: "text-amber-300",
  },
  low: {
    bg: "bg-red-500",
    text: "text-red-300",
  },
};

export const getBatteryConfig = (battery) => {
  if (battery > BATTERY_LIMITS.high) return BATTERY_CONFIG.high;
  if (battery > BATTERY_LIMITS.medium) return BATTERY_CONFIG.medium;
  return BATTERY_CONFIG.low;
};
