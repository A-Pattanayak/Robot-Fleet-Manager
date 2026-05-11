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
      bg-white border-b border-gray-200
      sticky top-0 z-50
    ">

      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <h1 className="text-slate-900 font-bold text-lg">
          Fleet Manager
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-500 text-sm">
            {user.email}
          </span>
        )}
        <button
          onClick={HandleSignOut}
          className="
            text-gray-600 text-sm
            border border-gray-300
            px-4 py-2 rounded-lg
            hover:text-blue-700 hover:border-blue-500
            transition-all duration-150
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Header;
