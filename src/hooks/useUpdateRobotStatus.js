import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRobotStatus } from "../store/robotSlice";
import { BASE_URL, getAuthHeaders } from "../utils/api";
import { normalizeRobotStatus } from "../utils/robotUtils";

const useUpdateRobotStatus = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.currentUser);

  const updateStatus = useCallback(async (robotId, newStatus) => {
    if (!user?.uid) return;

    try {
      const authHeaders = await getAuthHeaders(user.uid);
      const response = await fetch(`${BASE_URL}/api/robots/${robotId}`, {
        method: "PATCH",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update robot status");
      }

      const updatedRobot = await response.json();
      const normalizedRobot = normalizeRobotStatus(updatedRobot);

      dispatch(
        updateRobotStatus({
          id: normalizedRobot.id,
          status: normalizedRobot.status,
        })
      );
    } catch (error) {
      console.error("Failed to update robot status:", error);
    }
  }, [dispatch, user?.uid]);

  return updateStatus;
};

export default useUpdateRobotStatus;
