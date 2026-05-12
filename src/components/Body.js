import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import RobotDetail from "./RobotDetail";
import { RouterProvider } from "react-router-dom";
import Login from "./Login";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../utils/Firebase";
import { addUser, removeUser } from "../store/userSlice";
import { setRobot } from "../store/robotSlice";

const AuthLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-semibold text-white">
    Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAuthLoading } = useSelector((store) => store.user);

  if (isAuthLoading) return <AuthLoader />;

  return currentUser ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { currentUser, isAuthLoading } = useSelector((store) => store.user);

  if (isAuthLoading) return <AuthLoader />;

  return currentUser ? <Navigate to="/" replace /> : children;
};

export const appRouter=createBrowserRouter(
  [
    {
      element:<PublicRoute><Login /></PublicRoute>,
      path:'/login'
    },
    {
      element:<ProtectedRoute><Dashboard /></ProtectedRoute>,
      path:'/'
    },
    {
      element:<ProtectedRoute><RobotDetail /></ProtectedRoute>,
      path: '/robot/:id'

    }
  ]
)

const Body=()=>{
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

  return(
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  )
}

export default Body
