import {
  BATTERY_LIMITS,
  MAP_STATUS_PRIORITY,
  ROBOT_CARD_THEMES,
} from "./Constant";

const CRITICAL_BATTERY_MESSAGE = "Critical battery. Stop work and send robot to charging.";

export const normalizeRobotStatus = (robot) => ({
  ...robot,
  status: robot.status === "working" ? "active" : robot.status,
});

export const simulateRobotTelemetry = (robot) => {
  const nextRobot = {
    ...robot,
    errorLog: [...(robot.errorLog || [])],
    location: robot.location ? { ...robot.location } : robot.location,
  };

  let status = nextRobot.status;
  let battery = nextRobot.battery ?? 100;
  let errors = nextRobot.errorLog;

  if (status === "charging") {
    battery = Math.min(100, battery + 1);
    if (battery === 100) status = "idle";
  } else if (status === "active" || status === "working") {
    battery = Math.max(0, battery - 1);
    nextRobot.uptime = (nextRobot.uptime || 0) + 60;
  }

  if (battery <= BATTERY_LIMITS.critical && !errors.includes(CRITICAL_BATTERY_MESSAGE)) {
    errors = [...errors, CRITICAL_BATTERY_MESSAGE];
  }

  if (battery >= BATTERY_LIMITS.medium) {
    errors = errors.filter((error) => error !== CRITICAL_BATTERY_MESSAGE);
  }

  if ((status === "active" || status === "working") && battery <= 10) {
    status = "idle";
  }

  return normalizeRobotStatus({
    ...nextRobot,
    battery,
    status,
    errorLog: errors,
    lastPing: "just now",
  });
};

export const formatUptime = (seconds) => {
  if (seconds === 0) return "Not running";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  return `${hrs}h ${mins}m`;
};

export const getRobotSearchText = (robot) => (
  [
    robot.name,
    robot.id,
    robot.location?.label,
    normalizeRobotStatus(robot).status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
);

export const getCardTheme = (themeIndex = 0) => (
  ROBOT_CARD_THEMES[themeIndex % ROBOT_CARD_THEMES.length]
);

export const getChargeMessage = (battery) => {
  if (battery > BATTERY_LIMITS.high) return "Good charge level";
  if (battery > BATTERY_LIMITS.medium) return "Consider charging soon";
  return "Critical charge level";
};

export const getRobotInfoRows = (robot) => [
  { key: "Current Task", val: robot.task },
  { key: "Status", val: robot.status },
  { key: "Uptime", val: formatUptime(robot.uptime) },
  { key: "Last Ping", val: robot.lastPing },
  { key: "Location", val: robot.location.label },
  { key: "Coordinates", val: `${robot.location.lat}, ${robot.location.lng}` },
];

export const getMapViewportKey = (robots) => (
  robots
    .map((robot) => `${robot.id}:${robot.location.lat}:${robot.location.lng}`)
    .sort()
    .join("|")
);

export const getGroupStatus = (robots) => (
  MAP_STATUS_PRIORITY.find((status) => (
    robots.some((robot) => robot.status === status)
  )) || "idle"
);

export const groupRobotsByLocation = (robots) => {
  const groups = new Map();

  robots.forEach((robot) => {
    const key = `${robot.location.lat}-${robot.location.lng}`;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.robots.push(robot);
      return;
    }

    groups.set(key, {
      id: key,
      position: {
        lat: robot.location.lat,
        lng: robot.location.lng,
      },
      label: robot.location.label,
      robots: [robot],
    });
  });

  return Array.from(groups.values());
};
