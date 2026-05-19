import { useMemo } from "react";
import { getRobotSearchText, normalizeRobotStatus } from "../utils/robotUtils";

const useFilteredRobots = (robots, activeFilter, search) => {
  return useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return robots.filter((robot) => {
      const robotStatus = normalizeRobotStatus(robot).status;
      const matchesFilter = activeFilter === "all" || robotStatus === activeFilter;
      const matchesSearch = getRobotSearchText(robot).includes(searchTerm);

      return matchesFilter && matchesSearch;
    });
  }, [robots, activeFilter, search]);
};

export default useFilteredRobots;
