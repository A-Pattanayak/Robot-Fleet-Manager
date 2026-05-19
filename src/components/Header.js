import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../store/userSlice";
import { setRobot } from "../store/robotSlice";
import { signOut } from "firebase/auth";
import auth from "../utils/Firebase";

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user.currentUser);

    const handleSignOut = async () => {
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
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/40 bg-gradient-to-br from-red-500 via-red-700 to-zinc-950 text-sm font-black text-white shadow-lg shadow-red-950/40">
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-zinc-950 bg-emerald-400" />
          A
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-xl font-black leading-5 tracking-normal text-transparent">
            AUTOMATA
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-normal text-zinc-400">
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
            onClick={handleSignOut}
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
