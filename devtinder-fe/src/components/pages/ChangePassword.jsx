import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { addUsers } from "../../utils/userSlice";
import validator from "validator";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [isChangePwd, setIsChangePwd] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleChangePwd = async () => {
    try {
      setIsChangePwd(true);
      setShowSuccessToast(false);
      setShowErrorToast(false);

      const res = await axios.patch(
        BASE_URL + "/profile/changePassword",
        { currentPassword: currentPwd, newPassword: newPwd, confirmPassword: confirmPwd },
        { withCredentials: true }
      );
      console.log(res);
      setShowSuccessToast(true);
      setToastMsg(res?.data?.message);
      setIsChangePwd(false);

      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setShowErrorToast(true);
      setToastMsg(err?.response?.data?.message);
      setTimeout(() => {
        setShowErrorToast(false);
      }, 5000);
      setIsChangePwd(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0">
        {showErrorToast && (
          <div className="toast toast-top toast-end mt-20">
            <div className="alert alert-error">
              <span className="text-white">{toastMsg}</span>
            </div>
          </div>
        )}
        {showSuccessToast && (
          <div className="toast toast-top toast-end mt-20">
            <div className="alert alert-success">
              <span className="text-white font-bold">{toastMsg}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="relative z-10 card bg-base-300 w-96 shadow-md">
        <div className="card-body">
          <h2 className="card-title justify-center text-orange-400 text-2xl">
            Change Password
          </h2>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => navigate("/settings")}
          >
            ✕
          </button>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Current Password<span className="text-red-500">*</span>
            </legend>
            <input
              type="text"
              required
              value={currentPwd}
              className="input input-secondary w-full"
              onChange={(e) => setCurrentPwd(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              New Password<span className="text-red-500">*</span>
            </legend>
            <input
              type="text"
              required
              value={newPwd}
              className="input input-secondary w-full"
              onChange={(e) => setNewPwd(e.target.value)}
            />
            <p className="text-sm text-gray-400">(minLength: 8, 1 lowercase, 1 uppercase, 1
                special character)</p>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Confirm Password<span className="text-red-500">*</span>
            </legend>
            <input
              type="password"
              required
              value={confirmPwd}
              className="input input-secondary w-full"
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </fieldset>
          <div className="card-actions justify-center">
            {!isChangePwd && (
              <button
                className="btn bg-purple-700 m-2 text-white"
                disabled={
                  currentPwd === "" || newPwd === "" || confirmPwd === ""
                }
                onClick={handleChangePwd}
              >
                Update Password
              </button>
            )}
            {isChangePwd && (
              <span className="loading loading-spinner text-secondary"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
