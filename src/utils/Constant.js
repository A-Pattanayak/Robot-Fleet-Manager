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

export const BATTERY_LIMITS = {
  medium: 30,
  high: 60,
  lowWarning: 20,
  critical: 15,
};

export const ROBOT_CARD_STATUS_LINE = {
  active: "bg-emerald-400",
  idle: "bg-zinc-400",
  charging: "bg-amber-400",
  error: "bg-red-500",
};

export const ROBOT_CARD_THEMES = [
  {
    glow: "from-red-500/20",
    wash: "bg-red-500/10",
  },
  {
    glow: "from-sky-500/20",
    wash: "bg-sky-500/10",
  },
  {
    glow: "from-emerald-500/20",
    wash: "bg-emerald-500/10",
  },
  {
    glow: "from-amber-500/20",
    wash: "bg-amber-500/10",
  },
  {
    glow: "from-fuchsia-500/20",
    wash: "bg-fuchsia-500/10",
  },
  {
    glow: "from-cyan-500/20",
    wash: "bg-cyan-500/10",
  },
];

export const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "340px",
};

export const MAP_CENTER = {
  lat: 28.6139,
  lng: 77.209,
};

export const MAP_OPTIONS = {
  disableDefaultUI: true,
  fullscreenControl: true,
  zoomControl: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [{ visibility: "simplified" }, { color: "#64748b" }],
    },
    {
      featureType: "landscape",
      stylers: [{ color: "#eef2f7" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#cbd5e1" }, { lightness: 10 }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#94a3b8" }],
    },
    {
      featureType: "water",
      stylers: [{ color: "#bfdbfe" }],
    },
  ],
};

export const MAP_STATUS_STYLES = {
  active: {
    fill: "#16a34a",
    ring: "#bbf7d0",
  },
  idle: {
    fill: "#64748b",
    ring: "#e2e8f0",
  },
  charging: {
    fill: "#d97706",
    ring: "#fef3c7",
  },
  error: {
    fill: "#dc2626",
    ring: "#fecaca",
  },
};

export const MAP_STATUS_PRIORITY = ["error", "charging", "active", "idle"];

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
