const FleetSnapshot = ({ counts, lowBatteryCount, locationCount, alertCount }) => {
  const items = [
    { label: "Cities", value: locationCount, valueClass: "text-white" },
    { label: "Active", value: counts.active, valueClass: "text-emerald-300" },
    { label: "Low battery", value: lowBatteryCount, valueClass: "text-amber-300" },
    { label: "Open alerts", value: alertCount, valueClass: "text-red-300" },
  ];

  return (
    <aside className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm">
      <div className="border-b border-zinc-700 bg-zinc-800 px-4 py-2">
        <p className="text-sm font-semibold text-white">AUTOMATA Snapshot</p>
        <p className="mt-1 text-xs text-zinc-300">Current operating state</p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2">
            <span className="block text-xs text-zinc-400">{item.label}</span>
            <span className={`text-base font-bold ${item.valueClass}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FleetSnapshot;
