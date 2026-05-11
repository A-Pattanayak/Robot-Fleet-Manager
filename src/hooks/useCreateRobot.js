import { BASE_URL } from "../utils/api";

const useCreateRobot = () => {
  const createRobot = async (robotData) => {
    const response = await fetch(`${BASE_URL}/api/robots`, {
      method: "POST",
      headers: {
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
