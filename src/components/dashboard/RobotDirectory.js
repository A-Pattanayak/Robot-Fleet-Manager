import RobotCard from "../RobotCard";

const DirectoryState = ({ title, message, isDashed = false }) => {
  const borderStyle = isDashed ? "border-dashed border-zinc-700" : "border-zinc-800";

  return (
    <div className={`rounded-lg border ${borderStyle} bg-zinc-900 px-4 py-14 text-center`}>
      <p className="font-medium text-white">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{message}</p>
    </div>
  );
};

const RobotDirectory = ({ filteredRobots, isLoading }) => {
  if (isLoading) {
    return (
      <DirectoryState
        title="Loading robots..."
        message="Fetching live AUTOMATA telemetry."
      />
    );
  }

  if (filteredRobots.length === 0) {
    return (
      <DirectoryState
        title="No robots found"
        message="Try another search term or filter."
        isDashed
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {filteredRobots.map((robot, index) => (
        <RobotCard key={robot.id} robot={robot} themeIndex={index} />
      ))}
    </div>
  );
};

export default RobotDirectory;
