import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRobot, setRobotLoading } from "../store/robotSlice";
import { BASE_URL, getAuthHeaders } from "../utils/api";

const ROBOT_POLL_INTERVAL_MS = 10000;

const normalizeRobotStatus = (robot) => ({
  ...robot,
  status: robot.status === "working" ? "active" : robot.status,
});

const useRobots = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.currentUser);

  useEffect(() => {
    if (!user?.uid) {
      dispatch(setRobot([]));
      return;
    }

    let isCurrentRequest = true;
    dispatch(setRobot([]));
    dispatch(setRobotLoading(true));

    const fetchRobots = async () => {
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
        }
      } catch (error) {
        if (isCurrentRequest) {
          dispatch(setRobot([]));
          console.log("Cannot fetch robots", error);
        }
      }
    };

    fetchRobots();
    const intervalId = setInterval(fetchRobots, ROBOT_POLL_INTERVAL_MS);

    return () => {
      isCurrentRequest = false;
      clearInterval(intervalId);
    };
  }, [dispatch, user?.uid]);
};

export default useRobots;
