import devTinderIcon from "../assets/devtinder-icon.png";
import devTinderLogo from "../assets/devtinder-logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUsers } from "../utils/userSlice";
import { Link } from "react-router-dom";
import { removeFeed } from "../utils/feedSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try{
      const res = await axios.post(BASE_URL + '/logout', {}, {withCredentials: true});
      navigate("/login");
      // dispatch(removeUsers());  //This triggers a re-render or unmounting of the current component.
      // Before navigate("/login") has a chance to execute, the component is gone, so navigation is lost.
      // This is why navigate("/login") works when placed before dispatch.

      //But again is navigate is placed before
      // When you call navigate("/login"), the router immediately rerenders the app based on the new route. 
      // If your /login route doesn’t depend on the current component being fully unmounted, or if the store is reset elsewhere (like on app load), 
      // it might skip processing the next line if the component gets destroyed before dispatch(removeUsers()) completes.
      
      setTimeout(() => {
        dispatch(removeUsers()); // slightly delayed so it runs even if component unmounts
        dispatch(removeFeed());
      }, 0);

    }catch(err){
      console.error(err);
    }
  }

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <img src={devTinderIcon} alt="DevTinder Icon" className="h-12" onClick={() => navigate("/feed")} />
          <img src={devTinderLogo} alt="DevTinder Logo" className="h-10" onClick={() => navigate("/feed")} />
        </a>
      </div>
      {!user && <div>
        <button
          className="btn btn-outline btn-secondary"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </div>}
      {user && (
        <div className="flex gap-2">
          <div className="mt-2">Welcome, {user.firstName}</div>
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user.profilePic}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to='/profile' className="justify-between">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to='/connections' className="justify-between">
                  My Connections
                </Link>
              </li>
              <li>
                <Link to='/settings'>Settings</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
