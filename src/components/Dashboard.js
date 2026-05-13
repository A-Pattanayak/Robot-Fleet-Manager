import { useDispatch, useSelector } from "react-redux"
import RobotCard from "./RobotCard"
import { useMemo, useState } from "react";
import Header from "./Header";
import { addRobot, setFilter,setSearch } from "../store/robotSlice";
import useRobots from "../hooks/UseRobots";
import CreateRobotModal from "./CreateRobotModal";
import useDeleteRobot from "../hooks/useDeleteRobot";
import LiveMap from "./Map";
import useFleetMetrics from "../hooks/useFleetMetrics";
import FleetStatsBar from "./FleetStatsBar";
import FleetSnapshot from "./FleetSnapshot";


const Dashboard = () => {
  
  useRobots();
  const dispatch= useDispatch();
  const deleteRobot = useDeleteRobot();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const robots = useSelector((store)=>store.robots.robots)
  const activeFilter= useSelector((store)=>store.robots.filter)
  const search= useSelector((store)=>store.robots.search)
  const isLoading = useSelector((store)=>store.robots.isLoading)
  const { counts, lowBatteryCount, locationCount, alertCount } = useFleetMetrics(robots);

  const filteredRobots = useMemo(() => robots.filter(robot => {
    const robotStatus = robot.status === "working" ? "active" : robot.status;
    const matchesFilter = activeFilter === "all" || robotStatus === activeFilter;
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      robot.name.toLowerCase().includes(searchTerm) ||
      robot.id.toLowerCase().includes(searchTerm) ||
      robot.location.label.toLowerCase().includes(searchTerm) ||
      robotStatus.toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  }), [robots, activeFilter, search]);

  const handleRobotCreated = (newRobot) => {
    dispatch(addRobot(newRobot));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <section className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-0.5 text-[11px] font-semibold uppercase text-red-400">
                Live Robot Operations
              </p>
              <h2 className="text-xl font-bold tracking-normal text-white sm:text-2xl">
                RoboSena Command Center
              </h2>
              <p className="mt-1 text-xs leading-5 text-zinc-400 sm:text-sm">
                Monitor robot health, cities, alerts, and missions from one clean workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-red-700 sm:w-auto"
            >
              Add Robot
            </button>
          </div>
        </section>

        <FleetStatsBar
          activeFilter={activeFilter}
          counts={counts}
          onFilterChange={(filter) => dispatch(setFilter(filter))}
        />

        <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search by name, ID, status, or city..."
                value={search}
                onChange={e => dispatch(setSearch(e.target.value))}
                className="
                  w-full rounded-md border border-zinc-700 bg-zinc-950
                  px-3 py-2.5 text-sm text-zinc-100
                  outline-none transition-colors duration-150
                  placeholder:text-zinc-500 focus:border-red-500
                  sm:w-96
                "
              />

              <p className="text-sm text-zinc-400">
                Showing <span className="font-semibold text-white">{filteredRobots.length}</span> of <span className="font-semibold text-white">{robots.length}</span>
                {activeFilter !== "all" && (
                  <span className="ml-1 capitalize text-red-300">in {activeFilter}</span>
                )}
              </p>
            </div>

            {(search || activeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  dispatch(setSearch(""));
                  dispatch(setFilter("all"));
                }}
                className="self-start text-sm font-medium text-red-300 transition-colors duration-150 hover:text-red-200 lg:self-auto"
              >
                Clear search
              </button>
            )}
          </div>
        </section>

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
                  RoboSena Directory
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Select a robot card to open details.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-14 text-center">
                <p className="font-medium text-white">
                  Loading robots...
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Fetching live RoboSena telemetry.
                </p>
              </div>
            ) : filteredRobots.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900 px-4 py-14 text-center">
                <p className="font-medium text-white">
                  No robots found
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Try another search term or filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {filteredRobots.map(robot => (
                  <RobotCard
                    key={robot.id}
                    robot={robot}
                    onDelete={deleteRobot}
                  />
                ))}
              </div>
            )}
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
  )
}
export default Dashboard
