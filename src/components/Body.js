import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import RobotDetail from "./RobotDetail";
import { RouterProvider } from "react-router-dom";
import Login from "./Login";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../utils/Firebase";
import { addUser, removeUser } from "../store/userSlice";
import { setRobot } from "../store/robotSlice";
import useRobots from "../hooks/useRobots";

const AuthLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm font-semibold text-zinc-300">
    Loading AUTOMATA...
  </div>
);

const ProtectedLayout = () => {
  const { currentUser, isAuthLoading } = useSelector((store) => store.user);
  useRobots();

  if (isAuthLoading) return <AuthLoader />;

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { currentUser, isAuthLoading } = useSelector((store) => store.user);

  if (isAuthLoading) return <AuthLoader />;

  return currentUser ? <Navigate to="/" replace /> : children;
};

export const appRouter = createBrowserRouter(
  [
    {
      element: <PublicRoute><Login /></PublicRoute>,
      path: "/login",
    },
    {
      element: <ProtectedLayout />,
      children: [
        {
          element: <Dashboard />,
          path: "/",
        },
        {
          element: <RobotDetail />,
          path: "/robot/:id",
        },
      ],
    },
  ]
);

const Body = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setRobot([]));

      if (user) {
        const { uid, email, displayName, photoURL } = user;

        dispatch(
          addUser({
            uid,
            email,
            displayName,
            photoURL,
          })
        );
        return;
      }

      dispatch(removeUser());
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
};

export default Body;
