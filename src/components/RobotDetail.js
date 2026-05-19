import { BATTERY_LIMITS } from "../utils/Constant";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useUpdateRobotStatus from "../hooks/useUpdateRobotStatus";
import useDeleteRobot from "../hooks/useDeleteRobot";
import Header from "./Header";
import RobotChargePanel from "./robotDetail/RobotChargePanel";
import RobotDetailHero from "./robotDetail/RobotDetailHero";
import RobotDetailState from "./robotDetail/RobotDetailState";
import RobotInfoPanel from "./robotDetail/RobotInfoPanel";
import RobotStatusActions from "./robotDetail/RobotStatusActions";

const RobotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateRobotStatusHandler = useUpdateRobotStatus();
  const deleteRobot = useDeleteRobot();

  const robots = useSelector((state) => state.robots.robots);
  const isLoading = useSelector((state) => state.robots.isLoading);
  const robot = robots.find((r) => r.id === id);

  if (isLoading) {
    return (
      <RobotDetailState
        title="Loading robot details..."
        message="Fetching live AUTOMATA telemetry."
      />
    );
  }

  if (!robot) {
    return (
      <RobotDetailState
        title="Robot not found."
        message="This robot may have been deleted or is unavailable."
        actionLabel="Back to Main Page"
        onAction={() => navigate("/")}
      />
    );
  }

  const handleStatusChange = (newStatus) => {
    updateRobotStatusHandler(robot.id, newStatus);
  };

  const handleDeleteRobot = async () => {
    const shouldDelete = window.confirm(
      `Do you want to delete ${robot.name}? This action cannot be undone.`
    );

    if (!shouldDelete) return;

    const wasDeleted = await deleteRobot(robot.id);

    if (wasDeleted) {
      navigate("/");
    }
  };

  const isCriticalBattery = robot.battery <= BATTERY_LIMITS.critical;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            Back to AUTOMATA
          </button>
        </div>

        <RobotDetailHero robot={robot} onDelete={handleDeleteRobot} />

        <RobotStatusActions
          currentStatus={robot.status}
          isCriticalBattery={isCriticalBattery}
          onStatusChange={handleStatusChange}
        />

        <section className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RobotInfoPanel robot={robot} />
          <RobotChargePanel battery={robot.battery} />
        </section>
      </main>
    </div>
  );
};

export default RobotDetail;
