import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { deleteRobot } from "../store/robotSlice";
import { BASE_URL } from "../utils/api";

const useDeleteRobot = () => {
  const dispatch = useDispatch();

  const removeRobot = useCallback(async (robotId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/robots/${robotId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete robot");
      }

      dispatch(deleteRobot(robotId));
    } catch (error) {
      console.error("Failed to delete robot:", error);
    }
  }, [dispatch]);

  return removeRobot;
};

export default useDeleteRobot;
