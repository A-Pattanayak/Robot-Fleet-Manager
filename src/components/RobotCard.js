import { memo } from "react";
import StatusBadge from "./StatusBadge";
import BatteryConfig from "../utils/BatteryConfig";
import { useNavigate } from "react-router-dom";

const BatteryStatus = (battery) => {
  if (battery > 60) return BatteryConfig.high;
  if (battery > 30) return BatteryConfig.medium;
  return BatteryConfig.low;
};

const RobotCard = ({ robot, onDelete }) => {
  const navigate = useNavigate();
  const batteryConfig = BatteryStatus(robot.battery);
  const isLowBattery = robot.battery <= 20;

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(robot.id);
  };

  return (
    <div
      onClick={() => navigate(`/robot/${robot.id}`)}
      className="
        bg-white border border-gray-200
        rounded-lg p-5 cursor-pointer
        hover:border-blue-500 hover:shadow-md
        transition-all duration-200
      "
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-gray-400 text-xs mb-1">
            {robot.id}
          </p>

          <h3 className="text-slate-900 font-semibold text-lg">
            {robot.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={robot.status} />
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-red-700 bg-red-50 border border-red-100 px-2 py-1 rounded-md hover:bg-red-100 transition-colors duration-150"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {robot.task}
      </p>

      <div className="flex justify-between items-center mb-1.5">
        <span className="text-gray-500 text-sm">Charge</span>
        <span className={`text-xs font-bold ${batteryConfig.text}`}>
          {robot.battery}%
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-300 ${batteryConfig.bg}`}
          style={{ width: `${robot.battery}%` }}
        />
      </div>

      {isLowBattery && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Low charge. Stop work and move this robot to charging.
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-xs">
          Location: {robot.location.label}
        </span>

        {robot.errorLog.length > 0 && (
          <span className="text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
            {robot.errorLog.length} alert{robot.errorLog.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(RobotCard);
