import { useDispatch, useSelector } from "react-redux"
import { FILTERS, STAT_CONFIG } from "../utils/Constant";
import RobotCard from "./RobotCard"
import { useMemo, useState } from "react";
import Header from "./Header";
import { addRobot, setFilter,setSearch } from "../store/robotSlice";
import useRobots from "../hooks/UseRobots";
import CreateRobotModal from "./CreateRobotModal";
import useDeleteRobot from "../hooks/useDeleteRobot";
import LiveMap from "./Map";


const Dashboard = () => {
  
  useRobots();
  const dispatch= useDispatch();
  const deleteRobot = useDeleteRobot();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const robots = useSelector((store)=>store.robots.robots)
  const activeFilter= useSelector((store)=>store.robots.filter)
  const search= useSelector((store)=>store.robots.search)
  
  const counts = useMemo(() => ({
    all: robots.length,
    active: robots.filter(r => r.status === "active").length,
    working: robots.filter(r => r.status === "working").length,
    idle: robots.filter(r => r.status === "idle").length,
    charging: robots.filter(r => r.status === "charging").length,
    error: robots.filter(r => r.status === "error").length,

  }), [robots]);

  const filteredRobots = useMemo(() => robots.filter(robot => {
    const matchesFilter = activeFilter === "all" || robot.status === activeFilter;
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      robot.name.toLowerCase().includes(searchTerm) ||
      robot.id.toLowerCase().includes(searchTerm) ||
      robot.location.label.toLowerCase().includes(searchTerm) ||
      robot.status.toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  }), [robots, activeFilter, search]);

  const lowBatteryCount = useMemo(
    () => robots.filter((robot) => robot.battery <= 30).length,
    [robots]
  );

  const locationCount = useMemo(
    () => new Set(robots.map((robot) => robot.location.label)).size,
    [robots]
  );

  const alertCount = useMemo(
    () => robots.reduce((total, robot) => total + robot.errorLog.length, 0),
    [robots]
  );

  const handleRobotCreated = (newRobot) => {
    dispatch(addRobot(newRobot));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-700 mb-1">
              Robot Operations
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-normal">
              Fleet Command Center
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-6">
              Monitor robot health, location, and tasks from one calm workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-150 shadow-sm"
          >
            Create Robot
          </button>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
          {STAT_CONFIG.map(stat => (
            <button
              type="button"
              key={stat.key}
              onClick={() => dispatch(setFilter(stat.key))}
              className={`
                text-left bg-white border rounded-lg p-4
                hover:border-blue-500 hover:shadow-sm
                transition-all duration-200
                ${activeFilter === stat.key ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200"}
              `}
            >
              <p className={`text-2xl font-bold mb-1 ${stat.color}`}>
                {counts[stat.key]}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                {stat.label}
              </p>
            </button>
          ))}
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-4 mb-5">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                type="text"
                placeholder="Search by name, ID, status, or location..."
                value={search}
                onChange={e => dispatch(setSearch(e.target.value))}
                className="
                  bg-slate-50 border border-gray-300
                  text-slate-900 text-sm
                  px-4 py-3 rounded-lg
                  outline-none w-full sm:w-96
                  placeholder:text-gray-400
                  focus:border-blue-500
                  transition-colors duration-150
                "
              />

              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-900">{filteredRobots.length}</span> of <span className="font-semibold text-slate-900">{robots.length}</span>
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
              {FILTERS.map(filter => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => dispatch(setFilter(filter))}
                  className={`
                    shrink-0 px-4 py-2 rounded-lg text-xs font-mono
                    border transition-all duration-150 capitalize
                    ${activeFilter === filter
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:text-blue-700 hover:border-blue-500"
                    }
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] gap-5 items-start">
          <div className="space-y-5 lg:sticky lg:top-20">
            <LiveMap robots={filteredRobots} />

            <aside className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-900">
                  Fleet Snapshot
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Current operating state
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <span className="block text-xs text-slate-500">Locations</span>
                  <span className="text-sm font-semibold text-slate-900">{locationCount}</span>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <span className="block text-xs text-slate-500">Working</span>
                  <span className="text-sm font-semibold text-blue-700">{counts.working}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Low battery</span>
                  <span className="text-sm font-semibold text-amber-700">{lowBatteryCount}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Open alerts</span>
                  <span className="text-sm font-semibold text-red-700">{alertCount}</span>
                </div>
              </div>
            </aside>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Robot Directory
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Select a robot card to open details.
                </p>
              </div>

              {(search || activeFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setSearch(""));
                    dispatch(setFilter("all"));
                  }}
                  className="text-sm text-blue-700 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>

            {filteredRobots.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg text-center py-14 px-4">
                <p className="text-slate-900 font-medium">
                  No robots found
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Try another search term or filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
