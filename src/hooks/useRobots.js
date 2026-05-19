import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRobot, setRobotLoading } from "../store/robotSlice";
import { BASE_URL, getAuthHeaders } from "../utils/api";
import { normalizeRobotStatus, simulateRobotTelemetry } from "../utils/robotUtils";

const toPositiveNumber = (value, fallback) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const ROBOT_SYNC_INTERVAL_MS = toPositiveNumber(
  process.env.REACT_APP_ROBOT_SYNC_INTERVAL_MS,
  60000
);

const FRONTEND_TELEMETRY_INTERVAL_MS = toPositiveNumber(
  process.env.REACT_APP_FRONTEND_TELEMETRY_INTERVAL_MS,
  5000
);

const useRobots = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.currentUser);
  const robots = useSelector((store) => store.robots.robots);
  const robotsRef = useRef([]);

  useEffect(() => {
    robotsRef.current = robots;
  }, [robots]);

  useEffect(() => {
    if (!user?.uid) {
      dispatch(setRobot([]));
      return;
    }

    let isCurrentRequest = true;
    let hasLoadedRobots = false;
    let isFetchingRobots = false;

    dispatch(setRobot([]));
    dispatch(setRobotLoading(true));

    const fetchRobots = async () => {
      if (isFetchingRobots) return;

      isFetchingRobots = true;

      try {
        const authHeaders = await getAuthHeaders(user.uid);
        const response = await fetch(`${BASE_URL}/api/robots`, {
          headers: authHeaders,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch robots");
        }

        const robots = await response.json();

        if (isCurrentRequest) {
          dispatch(setRobot(robots.map(normalizeRobotStatus)));
          hasLoadedRobots = true;
        }
      } catch (error) {
        if (isCurrentRequest) {
          if (!hasLoadedRobots) {
            dispatch(setRobot([]));
          } else {
            dispatch(setRobotLoading(false));
          }

          console.log("Cannot fetch robots", error);
        }
      } finally {
        isFetchingRobots = false;
      }
    };

    fetchRobots();

    const syncRobots = setInterval(fetchRobots, ROBOT_SYNC_INTERVAL_MS);

    return () => {
      isCurrentRequest = false;
      clearInterval(syncRobots);
    };
  }, [dispatch, user?.uid]);

  useEffect(() => {
    if (!user?.uid) return undefined;

    const simulateFrontendTelemetry = () => {
      const currentRobots = robotsRef.current;

      if (currentRobots.length === 0) return;

      dispatch(setRobot(currentRobots.map(simulateRobotTelemetry)));
    };

    const telemetryTimer = setInterval(
      simulateFrontendTelemetry,
      FRONTEND_TELEMETRY_INTERVAL_MS
    );

    return () => clearInterval(telemetryTimer);
  }, [dispatch, user?.uid]);
};

export default useRobots;
