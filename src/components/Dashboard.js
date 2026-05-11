import { useDispatch, useSelector } from "react-redux"
import { FILTERS, STAT_CONFIG } from "../utils/Constant";
import RobotCard from "./RobotCard"
import { useMemo, useState } from "react";
import Header from "./Header";
import { addRobot, setFilter,setSearch } from "../store/robotSlice";
import useRobots from "../hooks/UseRobots";
import CreateRobotModal from "./CreateRobotModal";
import useDeleteRobot from "../hooks/useDeleteRobot";


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
    error: robots.filter(r => r.status === "error").length,

  }), [robots]);

  const filteredRobots = useMemo(() => robots.filter(robot => {
    const matchesFilter = activeFilter === "all" || robot.status === activeFilter;
    const matchesSearch = robot.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [robots, activeFilter, search]);

  const handleRobotCreated = (newRobot) => {
    dispatch(addRobot(newRobot));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-8">
        <div className="flex justify-between items-start gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500">Robot Operations</p>
            <h2 className="text-3xl font-bold text-slate-900">
              Fleet Overview
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-150"
          >
            Create Robot
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {STAT_CONFIG.map(stat => (
            <div
              key={stat.key}
              onClick={() => dispatch(setFilter(stat.key))}
              className="
                bg-white border border-gray-200
                rounded-lg p-5
                cursor-pointer
                hover:border-blue-500 hover:shadow-md
                transition-all duration-200
              "
            >
              <p className={`text-3xl font-bold mb-1 ${stat.color}`}>
                {counts[stat.key]}
              </p>
              <p className="text-gray-500 text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 items-center mb-6 flex-wrap bg-white border border-gray-200 rounded-lg p-4">

          <input
            type="text"
            placeholder="Search robots..."
            value={search}
            onChange={e => dispatch(setSearch(e.target.value))}
            className="
              bg-gray-50 border border-gray-300
              text-slate-900 text-sm
              px-4 py-2.5 rounded-lg
              outline-none w-56
              placeholder:text-gray-400
              focus:border-blue-500
              transition-colors duration-150
            "
          />

          <div className="flex gap-2">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => dispatch(setFilter(filter))}
                className={`
                  px-4 py-2 rounded-lg text-xs font-mono
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

        {filteredRobots.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-500 text-sm">
              No robots match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
