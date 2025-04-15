import backgroundImage from "../../assets/background-image.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { addUsers } from "../../utils/userSlice";
import validator from "validator";

const Login = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const dispatch = useDispatch();

  const handleLogIn = async () => {
    try {
      setIsLogin(true);
      setShowToast(false);

      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUsers(res.data));

      navigate("/feed");
    } catch (err) {
      console.error(err);
      setShowToast(true);
      setToastMsg(err.response.data);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
      setIsLogin(false);
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0">
        {showToast && (
          <div className="toast toast-top toast-end mt-20">
            <div className="alert alert-error">
              <span className="text-white">{toastMsg}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="relative z-10 card bg-base-300 w-96 shadow-md">
        <div className="card-body">
          <h2 className="card-title justify-center text-orange-600 text-2xl">
            Login
          </h2>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => navigate("/")}
          >
            ✕
          </button>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email ID</legend>
            <input
              type="email"
              required
              value={emailId}
              className="input input-secondary w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              required
              value={password}
              className="input input-secondary w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
          <div className="card-actions justify-center">
            {!isLogin && (
              <button
                className="btn bg-purple-700 m-2 text-white"
                disabled={emailId === "" || password === ""}
                onClick={handleLogIn}
              >
                Login
              </button>
            )}
            {isLogin && (
              <span className="loading loading-spinner text-secondary"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
