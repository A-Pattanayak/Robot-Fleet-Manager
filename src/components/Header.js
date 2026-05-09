import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../store/userSlice";

const Header=()=>{

    const navigate= useNavigate();
    const dispatch=useDispatch();
    const user=useSelector((store)=>store.user);

    const HandleSignOut=()=>{
        dispatch(removeUser());
        navigate('/');
        
    }

 return (
    <nav className="
      flex justify-between items-center
      px-8 h-16
      bg-[#1a1a2e] border-b border-[#2a2a3e]
      sticky top-0 z-50
    ">

      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <h1 className="text-white font-mono text-sm tracking-widest">
          RoBoFiNd
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-500 text-xs font-mono">
            {user.email}
          </span>
        )}
        <button
          onClick={HandleSignOut}
          className="
            text-gray-400 text-xs
            border border-[#2a2a3e]
            px-3 py-1.5 rounded-lg
            hover:text-white hover:border-gray-500
            transition-all duration-150
            font-mono
          "
        >
          logout
        </button>
      </div>
    </nav>
  );
};
export default Header;