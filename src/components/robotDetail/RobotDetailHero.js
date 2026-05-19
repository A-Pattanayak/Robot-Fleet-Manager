import StatusBadge from "../StatusBadge";

const RobotDetailHero = ({ robot, onDelete }) => {
  return (
    <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold text-red-300">
            AUTOMATA Unit Detail
          </p>
          <p className="mb-1 text-xs font-medium text-zinc-500">{robot.id}</p>
          <h1 className="mb-1 text-3xl font-bold text-white">{robot.name}</h1>
          <p className="text-sm text-zinc-400">
            Location: {robot.location.label}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={robot.status} />
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition-colors duration-150 hover:bg-red-500/20 hover:text-white"
          >
            Delete Robot
          </button>
        </div>
      </div>
    </section>
  );
};

export default RobotDetailHero;
