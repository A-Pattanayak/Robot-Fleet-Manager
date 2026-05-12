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

    const fetchRobots = async () => {
      try {
        const authHeaders = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/api/robots`, {
          headers: authHeaders,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch robots");
        }

        const robots = await response.json();
        dispatch(setRobot(robots));
      } catch (error) {
        console.log("Cannot fetch robots", error);
      }
    };

    fetchRobots();
  }, [dispatch, user?.uid]);
};

export default useRobots;
