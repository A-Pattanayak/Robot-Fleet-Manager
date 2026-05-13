const LoginShimmerUI = ({ message }) => (
  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-3 w-3 animate-pulse rounded-full bg-red-600" />
        <p className="text-sm font-semibold text-zinc-100">{message}</p>
      </div>
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded-md bg-zinc-800" />
        <div className="h-10 animate-pulse rounded-md bg-zinc-800" />
        <div className="h-11 animate-pulse rounded-md bg-red-500/20" />
      </div>
    </div>
  </div>
);

export default LoginShimmerUI;
