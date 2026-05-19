const DashboardSearchBar = ({
  activeFilter,
  filteredCount,
  onClear,
  onSearchChange,
  search,
  totalCount,
}) => {
  const hasActiveSearch = search || activeFilter !== "all";

  return (
    <section className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="group relative w-full sm:w-96">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-300 transition-colors duration-150 group-focus-within:text-orange-200"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID, status, or city..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-md border border-orange-500/45 bg-zinc-950 px-10 py-2.5 text-sm font-medium text-zinc-100 shadow-[0_0_0_1px_rgba(249,115,22,0.16),0_0_24px_rgba(249,115,22,0.18)] outline-none transition-all duration-150 placeholder:text-zinc-400 hover:border-orange-400 hover:shadow-[0_0_0_1px_rgba(251,146,60,0.2),0_0_30px_rgba(249,115,22,0.24)] focus:border-orange-400 focus:bg-zinc-900 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.22),0_0_34px_rgba(249,115,22,0.28)]"
            />
            <span className="pointer-events-none absolute inset-y-2 right-3 w-px bg-gradient-to-b from-transparent via-orange-400/50 to-transparent" />
          </div>

          <p className="text-sm text-zinc-400">
            Showing <span className="font-semibold text-white">{filteredCount}</span> of{" "}
            <span className="font-semibold text-white">{totalCount}</span>
            {activeFilter !== "all" && (
              <span className="ml-1 capitalize text-orange-300">in {activeFilter}</span>
            )}
          </p>
        </div>

        {hasActiveSearch && (
          <button
            type="button"
            onClick={onClear}
            className="self-start text-sm font-medium text-orange-300 transition-colors duration-150 hover:text-orange-200 lg:self-auto"
          >
            Clear search
          </button>
        )}
      </div>
    </section>
  );
};

export default DashboardSearchBar;
