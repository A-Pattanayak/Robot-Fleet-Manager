import BatteryConfig from "../utils/BatteryConfig";
import { STATUS_OPTIONS } from "../utils/Constant";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StatusBadge from "./StatusBadge";
import useUpdateRobotStatus from "../hooks/UseUpdateRobot";
import useRobots from "../hooks/UseRobots";
import Header from "./Header";



const formatUptime = (seconds) => {
  if (seconds === 0) return "Not running";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
};

const getBatteryConfig = (battery) => {
  if (battery > 60) return BatteryConfig.high;
  if (battery > 30) return BatteryConfig.medium;
  return BatteryConfig.low;
};

const RobotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateRobotStatusHandler = useUpdateRobotStatus();
  useRobots();

  const robots = useSelector((state) => state.robots.robots);
  const isLoading = useSelector((state) => state.robots.isLoading);
  const robot = robots.find((r) => r.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
            <p className="font-medium text-white">Loading robot details...</p>
            <p className="mt-1 text-sm text-zinc-500">
              Fetching live RoboSena telemetry.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!robot) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header />
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
            <p className="mb-4 text-red-300">Robot not found.</p>
            <button
              onClick={() => navigate("/")}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
            >
              Back to Main Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateRobotStatusHandler(robot.id, newStatus);
  };

  const batteryConfig = getBatteryConfig(robot.battery);
  const isCriticalBattery = robot.battery <= 15;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            Back to RoboSena
          </button>
        </div>

        <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-red-300">RoboSena Unit Detail</p>
              <p className="mb-1 text-xs font-medium text-zinc-500">{robot.id}</p>
              <h1 className="mb-1 text-3xl font-bold text-white">
                {robot.name}
              </h1>
              <p className="text-sm text-zinc-400">
                Location: {robot.location.label}
              </p>
            </div>

            <StatusBadge status={robot.status} />
          </div>
        </section>

        <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Update Status
          </h3>

          <div className="flex flex-wrap gap-3">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={isCriticalBattery && option.value === "active"}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  border transition-all duration-150
                  ${option.style}
                  ${robot.status === option.value ? "ring-1 ring-current" : ""}
                  ${isCriticalBattery && option.value === "active" ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                {option.value === "idle" ? "Stop / Idle" : option.label}
              </button>
            ))}
          </div>

          {isCriticalBattery && (
            <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200">
              Battery is critically low. Stop the robot or move it to charging before assigning work.
            </p>
          )}
        </section>

        <section className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-white">
              Robot Info
            </h3>

            {[
              { key: "Current Task", val: robot.task },
              { key: "Status", val: robot.status },
              { key: "Registered City", val: robot.city || robot.cityId },
              { key: "Uptime", val: formatUptime(robot.uptime) },
              { key: "Last Ping", val: robot.lastPing },
              { key: "Location", val: robot.location.label },
              { key: "Coordinates", val: `${robot.location.lat}, ${robot.location.lng}` },
            ].map((row) => (
              <div
                key={row.key}
                className="flex justify-between gap-4 border-b border-zinc-800 py-2.5 last:border-0"
              >
                <span className="text-sm text-zinc-400">{row.key}</span>
                <span className="text-right text-sm font-medium text-zinc-100">
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-white">
              Charge Status
            </h3>

            <p className={`mb-3 text-5xl font-bold ${batteryConfig.text}`}>
              {robot.battery}%
            </p>

            <div className="mb-3 h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${batteryConfig.bg}`}
                style={{ width: `${robot.battery}%` }}
              />
            </div>

            <p className="text-sm text-zinc-400">
              {robot.battery > 60
                ? "Good charge level"
                : robot.battery > 30
                ? "Consider charging soon"
                : "Critical charge level"}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
          <h3 className="mb-5 text-lg font-semibold text-white">
            Alerts
          </h3>

          {robot.errorLog.length === 0 ? (
            <p className="text-sm font-medium text-emerald-300">No alerts recorded</p>
          ) : (
            <div className="flex flex-col gap-2">
              {robot.errorLog.map((err, index) => (
                <div
                  key={index}
                  className="
                    bg-red-500/10 border border-red-500/30
                    rounded-lg px-4 py-3
                    text-red-300 text-sm
                  "
                >
                  {err}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RobotDetail;
