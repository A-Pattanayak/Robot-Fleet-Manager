export const FILTERS = ["all", "active", "idle", "charging", "error"];

export const STATUS_CONFIG = {
  active: {
    label: "Active",
    key: "active",
    textColor: "text-emerald-300",
    statColor: "text-emerald-300",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
    badgeDot: "bg-emerald-500",
    buttonStyle: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20",
  },

  idle: {
    label: "Idle",
    key: "idle",
    textColor: "text-zinc-300",
    statColor: "text-zinc-300",
    badgeBg: "bg-zinc-700",
    badgeText: "text-zinc-200",
    badgeDot: "bg-zinc-400",
    buttonStyle: "border-zinc-600 text-zinc-200 bg-zinc-800 hover:bg-zinc-700",
  },

  charging: {
    label: "Charging",
    key: "charging",
    textColor: "text-amber-300",
    statColor: "text-amber-300",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-300",
    badgeDot: "bg-amber-500",
    buttonStyle: "border-amber-500/30 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20",
  },

  error: {
    label: "Error",
    key: "error",
    textColor: "text-red-300",
    statColor: "text-red-300",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-300",
    badgeDot: "bg-red-500",
    buttonStyle: "border-red-500/30 text-red-300 bg-red-500/10 hover:bg-red-500/20",
  },
};

export const STAT_CONFIG = [
  {
    label: "Total",
    key: "all",
    color: "text-white",
    dotColor: "bg-red-600",
  },
  ...Object.values(STATUS_CONFIG).map((status) => ({
    label: status.label,
    key: status.key,
    color: status.statColor,
    dotColor: status.badgeDot,
  })),
];

export const STATUS_OPTIONS = Object.values(STATUS_CONFIG).map((status) => ({
  label: status.label,
  value: status.key,
  style: status.buttonStyle,
}));

export const CITY_OPTIONS = [
  {
    label: "Delhi",
    value: "delhi",
  },
  {
    label: "Mumbai",
    value: "mumbai",
  },
  {
    label: "Pune",
    value: "pune",
  },
  {
    label: "Hyderabad",
    value: "hyderabad",
  },
  {
    label: "Bangalore",
    value: "bangalore",
  },
  {
    label: "Kolkata",
    value: "kolkata",
  },
  {
    label: "Chennai",
    value: "chennai",
  },
];

export const EMPTY_ROBOT_FORM = {
  id: "",
  name: "",
  task: "",
  cityId: "delhi",
};
