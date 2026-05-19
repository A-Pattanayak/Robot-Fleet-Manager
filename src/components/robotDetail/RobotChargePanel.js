import { getBatteryConfig } from "../../utils/BatteryConfig";
import { getChargeMessage } from "../../utils/robotUtils";

const RobotChargePanel = ({ battery }) => {
  const batteryConfig = getBatteryConfig(battery);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-sm sm:p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">Charge Status</h3>

      <p className={`mb-3 text-4xl font-bold sm:text-5xl ${batteryConfig.text}`}>
        {battery}%
      </p>

      <div className="mb-3 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${batteryConfig.bg}`}
          style={{ width: `${battery}%` }}
        />
      </div>

      <p className="text-sm text-zinc-400">{getChargeMessage(battery)}</p>
    </div>
  );
};

export default RobotChargePanel;
