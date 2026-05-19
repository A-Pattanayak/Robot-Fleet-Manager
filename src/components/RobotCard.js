import { memo } from "react";
import StatusBadge from "./StatusBadge";
import { getBatteryConfig } from "../utils/BatteryConfig";
import { useNavigate } from "react-router-dom";
import { BATTERY_LIMITS, ROBOT_CARD_STATUS_LINE } from "../utils/Constant";
import { getCardTheme } from "../utils/robotUtils";

const CardBackground = ({ theme, statusLine }) => (
  <>
    <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} via-zinc-900 to-zinc-950`} />
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
    <div className={`absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/10 ${theme.wash}`} />
    <div className={`absolute -bottom-12 left-10 h-28 w-28 rounded-full border border-white/10 ${theme.wash}`} />
    <div className={`absolute inset-y-0 left-0 w-1 ${statusLine}`} />
  </>
);

const BatteryBar = ({ battery, config }) => (
  <>
    <div className="mb-1.5 flex items-center justify-between">
      <span className="text-sm text-zinc-400">Charge</span>
      <span className={`text-xs font-bold ${config.text}`}>{battery}%</span>
    </div>

    <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-800">
      <div
        className={`h-full rounded-full transition-all duration-300 ${config.bg}`}
        style={{ width: `${battery}%` }}
      />
    </div>
  </>
);

const RobotCard = ({ robot, themeIndex = 0 }) => {
  const navigate = useNavigate();
  const batteryConfig = getBatteryConfig(robot.battery);
  const hasLowBattery = robot.battery <= BATTERY_LIMITS.lowWarning;
  const statusLine = ROBOT_CARD_STATUS_LINE[robot.status] || ROBOT_CARD_STATUS_LINE.idle;
  const theme = getCardTheme(themeIndex);
  const alertCount = robot.errorLog.length;

  return (
    <div
      onClick={() => navigate(`/robot/${robot.id}`)}
      className="
        relative overflow-hidden
        bg-zinc-900 border border-zinc-800
        rounded-lg cursor-pointer
        shadow-sm
        hover:border-orange-500 hover:bg-zinc-800 hover:shadow-md
        transition-all duration-200
      "
    >
      <CardBackground theme={theme} statusLine={statusLine} />

      <div className="relative p-3 sm:p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium text-zinc-500">
              {robot.id}
            </p>

            <h3 className="truncate text-base font-semibold text-white sm:text-lg">
              {robot.name}
            </h3>
          </div>

          <div className="shrink-0">
            <StatusBadge status={robot.status} />
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-sm leading-6 text-zinc-300">
          {robot.task}
        </p>

        <BatteryBar battery={robot.battery} config={batteryConfig} />

        {hasLowBattery && (
          <div className="mb-3 rounded-md border border-amber-500/30 bg-zinc-950/50 px-3 py-2 text-xs font-medium text-amber-200">
            Low charge. Stop work and move this robot to charging.
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="min-w-0 break-words text-xs text-zinc-400 sm:truncate">
            Location: {robot.location.label}
          </span>

          {alertCount > 0 && (
            <span className="w-fit shrink-0 rounded-full border border-red-500/20 bg-zinc-950/50 px-2 py-0.5 text-xs font-medium text-red-300">
              {alertCount} alert{alertCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(RobotCard);
