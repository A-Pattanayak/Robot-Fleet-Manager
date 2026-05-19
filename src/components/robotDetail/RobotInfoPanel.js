import { getRobotInfoRows } from "../../utils/robotUtils";

const RobotInfoPanel = ({ robot }) => {
  const robotInfoRows = getRobotInfoRows(robot);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-white">Robot Info</h3>

      {robotInfoRows.map((row) => (
        <div
          key={row.key}
          className="flex justify-between gap-4 border-b border-zinc-800 py-2.5 last:border-0"
        >
          <span className="text-sm text-zinc-400">{row.key}</span>
          <span className="text-right text-sm font-medium text-zinc-100">
            {row.val}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RobotInfoPanel;
