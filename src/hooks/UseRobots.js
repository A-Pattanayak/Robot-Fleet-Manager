import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRobot } from "../store/robotSlice";
import { BASE_URL } from "../utils/api";

const useRobots = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/robots`);
        const json = await response.json();

        dispatch(setRobot(json));
      } catch (error) {
        console.log("Cannot fetch robots", error);
      }
    };

    fetchRobots();
  }, [dispatch]);
};

export default useRobots;
