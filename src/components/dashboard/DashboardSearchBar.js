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
          <input
            type="text"
            placeholder="Search by name, ID, status, or city..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors duration-150 placeholder:text-zinc-500 focus:border-red-500 sm:w-96"
          />

          <p className="text-sm text-zinc-400">
            Showing <span className="font-semibold text-white">{filteredCount}</span> of{" "}
            <span className="font-semibold text-white">{totalCount}</span>
            {activeFilter !== "all" && (
              <span className="ml-1 capitalize text-red-300">in {activeFilter}</span>
            )}
          </p>
        </div>

        {hasActiveSearch && (
          <button
            type="button"
            onClick={onClear}
            className="self-start text-sm font-medium text-red-300 transition-colors duration-150 hover:text-red-200 lg:self-auto"
          >
            Clear search
          </button>
        )}
      </div>
    </section>
  );
};

export default DashboardSearchBar;
