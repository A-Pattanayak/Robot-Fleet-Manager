import { useSelector } from "react-redux";
import { BASE_URL, getAuthHeaders } from "../utils/api";

const useCreateRobot = () => {
  const user = useSelector((store) => store.user.currentUser);

  const createRobot = async (robotData) => {
    if (!user?.uid) {
      throw new Error("Please sign in before creating robots.");
    }

    const authHeaders = await getAuthHeaders(user.uid);
    const response = await fetch(`${BASE_URL}/api/robots`, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(robotData),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Failed to create robot");
    }

    return await response.json();
  };

  return createRobot;
};

export default useCreateRobot;
