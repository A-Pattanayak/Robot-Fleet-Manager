import { STATUS_OPTIONS } from "../../utils/Constant";

const RobotStatusActions = ({ currentStatus, isCriticalBattery, onStatusChange }) => {
  return (
    <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-white">Update Status</h3>

      <div className="flex flex-wrap gap-3">
        {STATUS_OPTIONS.map((option) => {
          const isActive = currentStatus === option.value;
          const isDisabled = isCriticalBattery && option.value === "active";

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusChange(option.value)}
              disabled={isDisabled}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-150 ${option.style} ${isActive ? "ring-1 ring-current" : ""} ${isDisabled ? "cursor-not-allowed opacity-40" : ""}`}
            >
              {option.value === "idle" ? "Stop / Idle" : option.label}
            </button>
          );
        })}
      </div>

      {isCriticalBattery && (
        <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-200">
          Battery is critically low. Stop the robot or move it to charging before assigning work.
        </p>
      )}
    </section>
  );
};

export default RobotStatusActions;
