import auth from "./Firebase";

const trimTrailingSlash = (url = "") => url.replace(/\/+$/, "");

const getDefaultApiUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return window.location.origin;
  }

  return "http://127.0.0.1:8000";
};

export const BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_API_URL || getDefaultApiUrl()
);

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
