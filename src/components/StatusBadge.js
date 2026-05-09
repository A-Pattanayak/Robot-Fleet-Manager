import statusConfig from "../utils/StatusConfig";

const StatusBadge=({status})=>{

  const config= statusConfig[status] | statusConfig.idle

   return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full
        text-xs font-semibold capitalize
        ${config.bg} ${config.text}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge


