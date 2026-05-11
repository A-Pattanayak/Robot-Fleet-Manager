import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateRobotStatus } from "../store/robotSlice";
import { BASE_URL } from "../utils/api";

const useUpdateRobotStatus = () => {
  const dispatch = useDispatch();

  const updateStatus = useCallback(async (robotId, newStatus) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/robots/${robotId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const updatedRobot = await response.json();

      dispatch(
        updateRobotStatus({
          id: updatedRobot.id,
          status: updatedRobot.status,
        })
      );

    } catch (error) {
      console.error("Failed to update robot status:", error);
    }
  }, [dispatch]);

  return updateStatus;
};

export default useUpdateRobotStatus;
