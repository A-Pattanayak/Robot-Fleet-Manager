import Header from "../Header";

const RobotDetailState = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="mb-1 font-medium text-white">{title}</p>
          <p className="text-sm text-zinc-500">{message}</p>

          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors duration-150 hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default RobotDetailState;
