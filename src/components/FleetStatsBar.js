import { STAT_CONFIG } from "../utils/Constant";

const FleetStatsBar = ({ activeFilter, counts, onFilterChange }) => {
  return (
    <section className="mb-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-sm">
      <div className="flex min-w-max gap-2">
        {STAT_CONFIG.map((stat) => {
          const isActive = activeFilter === stat.key;

          return (
            <button
              type="button"
              key={stat.key}
              onClick={() => onFilterChange(stat.key)}
              className={`
                flex min-w-28 items-center gap-2 rounded-md border px-3 py-2 text-left
                transition-colors duration-150
                ${isActive
                  ? "border-orange-500 bg-orange-600"
                  : "border-zinc-700 bg-zinc-800 hover:border-orange-400"
                }
              `}
            >
              <span className={`h-2 w-2 rounded-full ${stat.dotColor}`} />
              <span className="min-w-0">
                <span className="block text-lg font-bold leading-5 text-white">
                  {counts[stat.key]}
                </span>
                <span className={`block text-xs font-medium ${isActive ? "text-orange-50" : "text-zinc-300"}`}>
                  {stat.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FleetStatsBar;
