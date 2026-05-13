import { memo } from "react";
import StatusBadge from "./StatusBadge";
import BatteryConfig from "../utils/BatteryConfig";
import { useNavigate } from "react-router-dom";

const BatteryStatus = (battery) => {
  if (battery > 60) return BatteryConfig.high;
  if (battery > 30) return BatteryConfig.medium;
  return BatteryConfig.low;
};

const bannerConfig = {
  active: {
    line: "bg-emerald-400",
  },
  idle: {
    line: "bg-zinc-400",
  },
  charging: {
    line: "bg-amber-400",
  },
  error: {
    line: "bg-red-500",
  },
};

const cardThemes = [
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

const getCardTheme = (id) => {
  const total = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return cardThemes[total % cardThemes.length];
};

const RobotCard = ({ robot, onDelete }) => {
  const navigate = useNavigate();
  const batteryConfig = BatteryStatus(robot.battery);
  const isLowBattery = robot.battery <= 20;
  const visual = bannerConfig[robot.status] || bannerConfig.idle;
  const theme = getCardTheme(robot.id);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(robot.id);
  };

  return (
    <div
      onClick={() => navigate(`/robot/${robot.id}`)}
      className="
        relative overflow-hidden
        bg-zinc-900 border border-zinc-800
        rounded-lg cursor-pointer
        shadow-sm
        hover:border-red-500 hover:bg-zinc-800 hover:shadow-md
        transition-all duration-200
      "
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} via-zinc-900 to-zinc-950`} />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className={`absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/10 ${theme.wash}`} />
      <div className={`absolute -bottom-12 left-10 h-28 w-28 rounded-full border border-white/10 ${theme.wash}`} />

      <div className={`absolute inset-y-0 left-0 w-1 ${visual.line}`} />

      <div className="relative p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium text-zinc-500">
              {robot.id}
            </p>

            <h3 className="truncate text-lg font-semibold text-white">
              {robot.name}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={robot.status} />
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md border border-red-500/30 bg-zinc-950/50 px-2 py-1 text-xs font-medium text-red-300 transition-colors duration-150 hover:bg-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-sm leading-6 text-zinc-300">
          {robot.task}
        </p>

        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm text-zinc-400">Charge</span>
          <span className={`text-xs font-bold ${batteryConfig.text}`}>
            {robot.battery}%
          </span>
        </div>

        <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${batteryConfig.bg}`}
            style={{ width: `${robot.battery}%` }}
          />
        </div>

        {isLowBattery && (
          <div className="mb-3 rounded-md border border-amber-500/30 bg-zinc-950/50 px-3 py-2 text-xs font-medium text-amber-200">
            Low charge. Stop work and move this robot to charging.
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs text-zinc-400">
            Location: {robot.location.label}
          </span>

          {robot.errorLog.length > 0 && (
            <span className="shrink-0 rounded-full border border-red-500/20 bg-zinc-950/50 px-2 py-0.5 text-xs font-medium text-red-300">
              {robot.errorLog.length} alert{robot.errorLog.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(RobotCard);
