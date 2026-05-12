import BatteryConfig from "../utils/BatteryConfig";
import { STATUS_OPTIONS } from "../utils/Constant";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StatusBadge from "./StatusBadge";
import useUpdateRobotStatus from "../hooks/UseUpdateRobot";
import useRobots from "../hooks/UseRobots";



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
  const robot = robots.find((r) => r.id === id);

  if (!robot) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-700 mb-4">Robot not found.</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-700 text-sm hover:text-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateRobotStatusHandler(robot.id, newStatus);
  };

  const batteryConfig = getBatteryConfig(robot.battery);
  const isCriticalBattery = robot.battery <= 15;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-700 text-sm hover:text-blue-800 transition-colors duration-150"
        >
          &lt;- Back to Fleet
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-gray-400 text-xs mb-1">{robot.id}</p>
            <h1 className="text-slate-900 text-3xl font-bold mb-1">
              {robot.name}
            </h1>
            <p className="text-gray-500 text-sm">
              Location: {robot.location.label}
            </p>
          </div>

          <StatusBadge status={robot.status} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h3 className="text-slate-900 text-lg font-semibold mb-4">
          Update Status
        </h3>

        <div className="flex gap-3 flex-wrap">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={isCriticalBattery && ["active", "working"].includes(option.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                border transition-all duration-150
                ${option.style}
                ${robot.status === option.value ? "ring-1 ring-current" : ""}
                ${isCriticalBattery && ["active", "working"].includes(option.value) ? "opacity-40 cursor-not-allowed" : ""}
              `}
            >
              {option.value === "idle" ? "Stop / Idle" : option.label}
            </button>
          ))}
        </div>

        {isCriticalBattery && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            Battery is critically low. Stop the robot or move it to charging before assigning work.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-slate-900 text-lg font-semibold mb-5">
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
              className="flex justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-500 text-sm">{row.key}</span>
              <span className="text-slate-900 text-sm font-medium text-right">
                {row.val}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-slate-900 text-lg font-semibold mb-5">
            Charge Status
          </h3>

          <p className={`text-5xl font-bold mb-3 ${batteryConfig.text}`}>
            {robot.battery}%
          </p>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${batteryConfig.bg}`}
              style={{ width: `${robot.battery}%` }}
            />
          </div>

          <p className="text-gray-500 text-sm">
            {robot.battery > 60
              ? "Good charge level"
              : robot.battery > 30
              ? "Consider charging soon"
              : "Critical charge level"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-slate-900 text-lg font-semibold mb-5">
          Alerts
        </h3>

        {robot.errorLog.length === 0 ? (
          <p className="text-green-700 text-sm">No alerts recorded</p>
        ) : (
          <div className="flex flex-col gap-2">
            {robot.errorLog.map((err, index) => (
              <div
                key={index}
                className="
                  bg-red-50 border border-red-100
                  rounded-lg px-4 py-3
                  text-red-700 text-sm
                "
              >
                {err}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RobotDetail;
