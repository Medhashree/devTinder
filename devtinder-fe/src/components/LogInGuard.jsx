import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUsers, removeUsers } from "../utils/userSlice";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { flushSync } from 'react-dom';

const LoginGuard = ({ children }) => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const location = useLocation();

  const fetchUser = async () => {
    // if (userData) {
    //   setLoading(false);
    //   return;
    // }
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUsers(res.data));
      setLoading(false);
    } catch (err) {
      if (err.status === 401) {
        setUnauthorized(true);
        flushSync(() => {
            dispatch(removeUsers()); // Make sure Redux updates before navigating
          });
      }
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const excludedPaths = ["/", "/login"];
    if (!excludedPaths.includes(location.pathname)) {
      fetchUser();
    }
  }, [location.pathname]);
  {
    loading && <span className="loading loading-spinner text-secondary"></span>;
  }
  //The replace prop tells React Router to replace the current entry in the browser's history stack instead of adding a new one.
  // The URL /dashboard gets replaced by /login in the browser history.
  // So if the user clicks the Back button after being redirected to /login, they won't go back to /dashboard. Instead, they'll go back to whatever was before that.
  if (unauthorized) return <Navigate to="/login" replace />;
  return children;
};

export default LoginGuard;
