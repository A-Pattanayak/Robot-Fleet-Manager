import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Header from "./Header";
import { addRobot, setFilter, setSearch } from "../store/robotSlice";
import CreateRobotModal from "./CreateRobotModal";
import LiveMap from "./Map";
import useFilteredRobots from "../hooks/useFilteredRobots";
import useFleetMetrics from "../hooks/useFleetMetrics";
import DashboardHero from "./dashboard/DashboardHero";
import DashboardSearchBar from "./dashboard/DashboardSearchBar";
import FleetStatsBar from "./FleetStatsBar";
import FleetSnapshot from "./FleetSnapshot";
import RobotDirectory from "./dashboard/RobotDirectory";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const robots = useSelector((store) => store.robots.robots);
  const activeFilter = useSelector((store) => store.robots.filter);
  const search = useSelector((store) => store.robots.search);
  const isLoading = useSelector((store) => store.robots.isLoading);

  const filteredRobots = useFilteredRobots(robots, activeFilter, search);
  const { counts, lowBatteryCount, locationCount, alertCount } = useFleetMetrics(robots);

  const handleRobotCreated = (newRobot) => {
    dispatch(addRobot(newRobot));
  };

  const handleClearSearch = () => {
    dispatch(setSearch(""));
    dispatch(setFilter("all"));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        <DashboardHero onAddRobot={() => setShowCreateModal(true)} />

        <FleetStatsBar
          activeFilter={activeFilter}
          counts={counts}
          onFilterChange={(filter) => dispatch(setFilter(filter))}
        />

        <DashboardSearchBar
          activeFilter={activeFilter}
          filteredCount={filteredRobots.length}
          onClear={handleClearSearch}
          onSearchChange={(value) => dispatch(setSearch(value))}
          search={search}
          totalCount={robots.length}
        />

        <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
          <div className="space-y-4 lg:sticky lg:top-20">
            <LiveMap robots={filteredRobots} />

            <div className="hidden lg:block">
              <FleetSnapshot
                counts={counts}
                lowBatteryCount={lowBatteryCount}
                locationCount={locationCount}
                alertCount={alertCount}
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  AUTOMATA Directory
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Select a robot card to open details.
                </p>
              </div>
            </div>

            <RobotDirectory
              filteredRobots={filteredRobots}
              isLoading={isLoading}
            />
          </div>
        </section>
      </main>

      {showCreateModal && (
        <CreateRobotModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleRobotCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
