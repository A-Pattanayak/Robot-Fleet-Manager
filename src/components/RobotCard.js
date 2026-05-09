import StatusBadge from "./StatusBadge";
import BatteryConfig from "../utils/BatteryConfig";
import { useNavigate } from "react-router-dom";

const BatteryStatus=(battery)=>{

    if(battery>60) return BatteryConfig.high
    if(battery>30) return BatteryConfig.medium
    return BatteryConfig.low
}

const RobotCard = ({ robot }) => {
  
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/robot/${robot.id}`)}
      className="
        bg-[#1a1a2e] border border-[#2a2a3e]
        rounded-xl p-5 cursor-pointer
        hover:border-indigo-500 hover:shadow-lg
        hover:shadow-indigo-500/10
        transition-all duration-200
      "
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[#555] text-[11px] mb-0.5 font-mono">
            {robot.id}
          </p>

          <h3 className="text-white font-semibold text-base">
            {robot.name}
          </h3>
        </div>

        <StatusBadge status={robot.status} />
      </div>


      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
        {robot.task}
      </p>


      <div className="flex justify-between items-center mb-1.5">
        <span className="text-gray-600 text-xs">Battery</span>
        <span className={`text-xs font-bold ${BatteryStatus.text(robot.battery)}`}>
          {robot.battery}%
        </span>
      </div>


      <div className="h-1.5 bg-[#2a2a3e] rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-300 ${BatteryStatus(robot.battery)}`}
          style={{ width: `${robot.battery}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-xs">
          📍 {robot.location.label}
        </span>

        {robot.errorLog.length > 0 && (
          <span className="text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full">
            ⚠ {robot.errorLog.length} error{robot.errorLog.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default RobotCard;