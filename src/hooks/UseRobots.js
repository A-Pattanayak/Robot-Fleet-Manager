import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRobot } from "../store/robotSlice";
import { BASE_URL, getAuthHeaders } from "../utils/api";

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
          dispatch(setRobot(robots));
        }
      } catch (error) {
        if (isCurrentRequest) {
          dispatch(setRobot([]));
          console.log("Cannot fetch robots", error);
        }
      }
    };

    fetchRobots();

    return () => {
      isCurrentRequest = false;
    };
  }, [dispatch, user?.uid]);
};

export default useRobots;
