import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteRobot } from "../store/robotSlice";
import { BASE_URL, getAuthHeaders } from "../utils/api";

const useDeleteRobot = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.currentUser);

  const removeRobot = useCallback(async (robotId) => {
    if (!user?.uid) return;

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/api/robots/${robotId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!response.ok) {
        throw new Error("Failed to delete robot");
      }

      dispatch(deleteRobot(robotId));
    } catch (error) {
      console.error("Failed to delete robot:", error);
    }
  }, [dispatch, user?.uid]);

  return removeRobot;
};

export default useDeleteRobot;
