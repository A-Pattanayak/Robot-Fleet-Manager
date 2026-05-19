import StatusBadge from "../StatusBadge";

const RobotDetailHero = ({ robot, onDelete }) => {
  return (
    <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-sm font-semibold text-orange-300">
            AUTOMATA Unit Detail
          </p>
          <p className="mb-1 break-words text-xs font-medium text-zinc-500">{robot.id}</p>
          <h1 className="mb-1 break-words text-2xl font-bold text-white sm:text-3xl">{robot.name}</h1>
          <p className="break-words text-sm text-zinc-400">
            Location: {robot.location.label}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge status={robot.status} />
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-lg border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200 transition-colors duration-150 hover:bg-orange-500/20 hover:text-white sm:w-auto"
          >
            Delete Robot
          </button>
        </div>
      </div>
    </section>
  );
};

export default RobotDetailHero;
