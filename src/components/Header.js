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
      flex items-center justify-between gap-3
      px-3 sm:px-6 lg:px-8 h-16
      bg-zinc-950 border-b border-zinc-800 shadow-sm
      sticky top-0 z-50
    ">

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-400/40 bg-zinc-950 shadow-lg shadow-orange-950/40 sm:h-10 sm:w-10">
          <img
            src="/automata-favicon.svg"
            alt="AUTOMATA"
            className="h-8 w-8 rounded-md sm:h-9 sm:w-9"
          />
        </div>
        <div className="min-w-0">
          <h1 className="truncate bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-lg font-black leading-5 tracking-normal text-transparent sm:text-xl">
            AUTOMATA
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-normal text-zinc-400">
            Command Center
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
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
              px-3 py-2 rounded-lg sm:px-4
              hover:text-white hover:border-orange-500 hover:bg-orange-600
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
              hover:text-white hover:border-orange-500 hover:bg-orange-600
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
