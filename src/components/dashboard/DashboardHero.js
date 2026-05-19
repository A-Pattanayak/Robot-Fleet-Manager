const DashboardHero = ({ onAddRobot }) => {
  return (
    <section className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-0.5 text-[11px] font-semibold uppercase text-red-400">
            Live Robot Operations
          </p>
          <h2 className="bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-2xl font-black tracking-normal text-transparent sm:text-3xl">
            AUTOMATA Command Center
          </h2>
          <p className="mt-1 text-xs leading-5 text-zinc-400 sm:text-sm">
            Monitor robot health, cities, alerts, and missions from one clean workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddRobot}
          className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-red-700 sm:w-auto"
        >
          Add Robot
        </button>
      </div>
    </section>
  );
};

export default DashboardHero;
