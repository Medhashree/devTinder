import backgroundImage from "../../assets/background-image.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useDispatch } from "react-redux";
import validator from "validator";
import { Camera } from "lucide-react";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("Hey! I am using DevTinder.");
  const [skills, setSkills] = useState([]);
  const [profilePic, setProfilePic] = useState(
    "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg"
  );
  const [previousPhoto, setPreviousPhoto] = useState("");
  const [isInvalidPhotoURL, setIsInvalidPhotoURL] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const dispatch = useDispatch();

  const handleCreateAccount = async () => {
    try {
      setIsSignUp(true);
      setShowToast(false);
      setIsInvalidEmail(false);
      setIsInvalidPassword(false);

      if (!validator.isEmail(emailId)) {
        setIsInvalidEmail(true);
        return;
      }

      if (!validator.isStrongPassword(password)) {
        setIsInvalidPassword(true);
        return;
      }

      const res = await axios.post(
        BASE_URL + "/signup",
        { emailId, password, firstName, lastName, age, gender, about, profilePic, skills },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (err) {
      console.error(err);
      setShowToast(true);
      setToastMsg(err.response.data);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
      setIsSignUp(false);
    }
  };

  const handlePhotoCancel = () => {
    if (previousPhoto === "") {
        setProfilePic(
        "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg"
      );
    } else {
        setProfilePic(previousPhoto);
    }
    setShowPhotoModal(false);
  };

  const handlePhotoUpdate = () => {
    setIsInvalidPhotoURL(false);

    if (!validator.isURL(profilePic)) {
      setIsInvalidPhotoURL(true);
      return;
    }
    setPreviousPhoto(profilePic);
    setShowPhotoModal(false);
  };

  const handleSkills = (val) => {
    const skillsArray = val.split(",").map((skill) => skill.trim());
    setSkills(skillsArray);
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
      <div className="relative z-10 card bg-base-300 w-150 h-170 overflow-y-auto shadow-md">
        <div className="card-body">
          {/* <h2 className="card-title justify-center text-orange-600 text-2xl">
            Login
          </h2> */}
          <div className="flex justify-center relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border"
            />
            <button
              onClick={() => {
                setShowPhotoModal(true);
                setIsInvalidPhotoURL(false);
              }}
              className="absolute -right-1 -bottom-1 bg-base-300 p-1 rounded-full shadow"
            >
              <Camera size={18} />
            </button>
          </div>

          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => navigate("/")}
          >
            ✕
          </button>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Email ID<span className="text-red-500">*</span>
            </legend>
            <input
              type="email"
              required
              value={emailId}
              className="input input-secondary w-full"
              onChange={(e) => setEmailId(e.target.value)}
            />
            {isInvalidEmail && (
              <div className="text-sm text-red-500 mt-1">
                Please enter a valid email ID
              </div>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Password<span className="text-red-500">*</span>
            </legend>
            <input
              type="password"
              required
              value={password}
              className="input input-secondary w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
            {isInvalidPassword && (
              <div className="text-sm text-red-500 mt-1">
                Password is not strong(minLength: 8, 1 lowercase, 1 uppercase, 1
                special character)
              </div>
            )}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              First Name<span className="text-red-500">*</span>
            </legend>
            <input
              type="text"
              required
              value={firstName}
              className="input input-secondary w-full"
              onChange={(e) => {
                const input = e.target.value;
                const isValid = /^[A-Za-z]*$/.test(input); // only letters and spaces
                if (isValid) {
                  setFirstName(input);
                }
              }}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Last Name</legend>
            <input
              type="text"
              value={lastName}
              className="input input-secondary w-full"
              onChange={(e) => {
                const input = e.target.value;
                const isValid = /^[A-Za-z]*$/.test(input); // only letters and spaces
                if (isValid) {
                  setLastName(input);
                }
              }}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Age</legend>
            <input
              type="number"
              value={age}
              className="input input-secondary w-full"
              onChange={(e) => setAge(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Gender</legend>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="select select-secondary w-full"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">About</legend>
            <textarea
              value={about}
              maxLength={55}
              rows={3}
              className="textarea textarea-secondary w-full"
              onChange={(e) => setAbout(e.target.value)}
            />
            <div className="text-sm text-gray-500 mt-1">
              {about.length}/55 characters
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Skills</legend>
            <input
              type="text"
              value={skills}
              className="input input-secondary w-full"
              onChange={(e) => handleSkills(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate each skill with a comma(,)
            </p>
          </fieldset>

          <div className="card-actions justify-center">
            {!isSignUp && (
              <button
                className="btn bg-purple-700 m-2 text-white"
                disabled={emailId === "" || password === "" || firstName === ""}
                onClick={handleCreateAccount}
              >
                Sign Up
              </button>
            )}
            {isSignUp && (
              <span className="loading loading-spinner text-secondary"></span>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg space-y-4 w-80">
            <h3 className="text-lg font-semibold text-black">Update Photo</h3>
            <input
              type="text"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              className="input input-bordered w-full"
            />
            {isInvalidPhotoURL && (
              <div className="text-sm text-red-500">
                Please enter a valid photo URL
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button className="btn btn-error" onClick={handlePhotoCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePhotoUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
