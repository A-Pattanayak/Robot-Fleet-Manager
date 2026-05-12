import auth from "./Firebase";

export const BASE_URL = "http://127.0.0.1:8000";

export const getAuthHeaders = async (expectedUid) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in before using the robot API.");
  }

  if (expectedUid && user.uid !== expectedUid) {
    throw new Error("Authenticated user changed. Please retry the request.");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};
