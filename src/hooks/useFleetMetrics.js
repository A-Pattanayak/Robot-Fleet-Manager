import { useMemo } from "react";
import { normalizeRobotStatus } from "../utils/robotUtils";

const useFleetMetrics = (robots) => {
  return useMemo(() => {
    const counts = {
      all: robots.length,
      active: 0,
      idle: 0,
      charging: 0,
      error: 0,
    };

    const locations = new Set();
    let lowBatteryCount = 0;
    let alertCount = 0;

    robots.forEach((robot) => {
      const status = normalizeRobotStatus(robot).status;

      if (counts[status] !== undefined) {
        counts[status] += 1;
      }

      if (robot.battery <= 30) {
        lowBatteryCount += 1;
      }

      if (robot.location?.label) {
        locations.add(robot.location.label);
      }

      alertCount += robot.errorLog?.length || 0;
    });

    return {
      counts,
      lowBatteryCount,
      locationCount: locations.size,
      alertCount,
    };
  }, [robots]);
};

export default useFleetMetrics;
