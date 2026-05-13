import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../store/userSlice";
import { setRobot } from "../store/robotSlice";
import { signOut } from "firebase/auth";
import auth from "../utils/Firebase";

const Header=()=>{

    const navigate= useNavigate();
    const dispatch=useDispatch();
    const user=useSelector((store)=>store.user.currentUser);

    const HandleSignOut=async()=>{
        await signOut(auth);
        dispatch(setRobot([]));
        dispatch(removeUser());
        navigate('/login');
    }

 return (
    <nav className="
      flex justify-between items-center
      px-4 sm:px-6 lg:px-8 h-16
      bg-zinc-950 border-b border-zinc-800 shadow-sm
      sticky top-0 z-50
    ">

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
          RS
        </div>
        <div>
          <h1 className="text-lg font-bold leading-5 text-white">
            RoboSena
          </h1>
          <p className="text-xs font-medium text-zinc-300">
            Command Center
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden text-sm text-zinc-300 sm:inline">
            {user.email}
          </span>
        )}
        {user ? (
          <button
            onClick={HandleSignOut}
            className="
              text-zinc-100 text-sm font-medium
              border border-zinc-700
              px-4 py-2 rounded-lg
              hover:text-white hover:border-red-500 hover:bg-red-600
              transition-all duration-150
            "
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="
              text-zinc-100 text-sm font-medium
              border border-zinc-700
              px-4 py-2 rounded-lg
              hover:text-white hover:border-red-500 hover:bg-red-600
              transition-all duration-150
            "
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
export default Header;
