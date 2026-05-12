export const FILTERS = ["all", "active", "working", "idle", "charging", "error"];

export const STATUS_CONFIG = {
  active: {
    label: "Active",
    key: "active",
    textColor: "text-green-700",
    statColor: "text-green-700",
    badgeBg: "bg-green-50",
    badgeText: "text-green-700",
    badgeDot: "bg-green-400",
    buttonStyle: "border-green-200 text-green-700 bg-green-50 hover:bg-green-100",
  },

  working: {
    label: "Working",
    key: "working",
    textColor: "text-blue-700",
    statColor: "text-blue-700",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeDot: "bg-blue-400",
    buttonStyle: "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100",
  },

  idle: {
    label: "Idle",
    key: "idle",
    textColor: "text-gray-600",
    statColor: "text-gray-600",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-600",
    badgeDot: "bg-gray-400",
    buttonStyle: "border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100",
  },

  charging: {
    label: "Charging",
    key: "charging",
    textColor: "text-cyan-700",
    statColor: "text-cyan-700",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-700",
    badgeDot: "bg-cyan-400",
    buttonStyle: "border-cyan-200 text-cyan-700 bg-cyan-50 hover:bg-cyan-100",
  },

  error: {
    label: "Error",
    key: "error",
    textColor: "text-red-700",
    statColor: "text-red-700",
    badgeBg: "bg-red-50",
    badgeText: "text-red-700",
    badgeDot: "bg-red-400",
    buttonStyle: "border-red-200 text-red-700 bg-red-50 hover:bg-red-100",
  },
};

export const STAT_CONFIG = [
  {
    label: "Total",
    key: "all",
    color: "text-slate-900",
  },
  ...Object.values(STATUS_CONFIG).map((status) => ({
    label: status.label,
    key: status.key,
    color: status.statColor,
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
