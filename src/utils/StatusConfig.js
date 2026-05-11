import { STATUS_CONFIG } from "./Constant";

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full
        text-xs font-semibold capitalize
        ${config.badgeBg} ${config.badgeText}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.badgeDot}`} />
      {config.label}
    </span>
  );
};
export default StatusBadge