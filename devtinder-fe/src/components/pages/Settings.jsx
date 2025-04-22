import { useEffect, useState } from "react";
import { Pencil, Check, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { addUsers } from "../../utils/userSlice";
import validator from "validator";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [editFields, setEditFields] = useState({});
  const [profile, setProfile] = useState({});
  const [isInvalidPhotoURL, setIsInvalidPhotoURL] = useState(false);
  const [previousPhoto, setPreviousPhoto] = useState("");

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(profile.profilePic);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successToastMsg, setSuccessToastMsg] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMsg, setErrorToastMsg] = useState("");

  const dispatch = useDispatch();

  const fixedFields = ["FirstName", "Email"];

  useEffect(() => {
    if (userData) {
      setProfile({
        FirstName: userData?.["firstName"] || "",
        LastName: userData?.["lastName"] || "",
        Email: userData?.["emailId"] || "",
        Age: userData?.["age"] || "",
        Gender: userData?.["gender"] || "",
        About: userData?.["about"] || "",
        profilePic:
          userData?.["profilePic"] ||
          "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg",
        Skills: userData?.["skills"].join(",") || "",
      });
    }
  }, [userData]);

  const toggleEdit = (field) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "LastName") {
      // Prevent spaces, numbers, special characters
      const valid = /^[A-Za-z]*$/.test(value);
      if (!valid && value !== "") return;
    }

    if (name === "Skills") {
      // Prevent spaces
      if (/\s/.test(value)) return;
    }

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoCancel = () => {
    setIsInvalidPhotoURL(false);
    if (previousPhoto === "") {
      setPhotoUrl(
        "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg"
      );
    } else {
      setPhotoUrl(previousPhoto);
    }
    setShowPhotoModal(false);
  };

  const handlePhotoUpdate = () => {
    setIsInvalidPhotoURL(false);

    if (!validator.isURL(photoUrl)) {
      setIsInvalidPhotoURL(true);
      return;
    }
    setPreviousPhoto(photoUrl);
    setProfile((prev) => ({ ...prev, profilePic: photoUrl }));
    setShowPhotoModal(false);
  };

  const handleUpdateData = async () => {
    const updatedData = {
      lastName: profile.LastName,
      age: profile.Age,
      gender: profile.Gender,
      about: profile.About,
      profilePic: profile.profilePic,
      skills: profile.Skills.split(","),
    };
    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", updatedData, {
        withCredentials: true,
      });
      dispatch(
        addUsers({
          firstName: profile.FirstName,
          emailId: profile.Email,
          ...updatedData,
        })
      );
      setShowSuccessToast(true);
      setSuccessToastMsg(res?.data?.message);
      setEditFields({});
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setShowErrorToast(true);
      setErrorToastMsg(err?.response?.data);
      setTimeout(() => {
        setShowErrorToast(false);
      }, 5000);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-base-300 rounded-xl shadow space-y-6 mb-10">
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-70 z-0">
          {showSuccessToast && (
            <div className="toast toast-top toast-end mt-20">
              <div className="alert alert-success">
                <span className="text-white font-bold">{successToastMsg}</span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-black opacity-70 z-0">
          {showErrorToast && (
            <div className="toast toast-top toast-end mt-20">
              <div className="alert alert-error">
                <span className="text-white font-bold">{errorToastMsg}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center relative">
        <img
          src={profile.profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <button className="absolute top-0 right-0 z-10 btn-link text-blue-400 hover:text-blue-500 hover:cursor-pointer" onClick={() => navigate('/change-password')}>
          Change Password
        </button>

        <button
          onClick={() => {
            setPhotoUrl(profile.profilePic); // ← set latest photo before opening modal
            setPreviousPhoto(profile.profilePic);
            setShowPhotoModal(true);
          }}
          className="absolute -right-1 -bottom-1 bg-base-300 p-1 rounded-full shadow"
        >
          <Camera size={18} />
        </button>
      </div>

      {Object.keys(profile)
        .filter((field) => field !== "profilePic")
        .map((field) => (
          <div
            key={field}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2 mb-3"
          >
            <div className="text-base font-semibold capitalize text-left min-w-[70px] mr-10">
              {field}
            </div>

            <div className="mr-20">
              {editFields[field] ? (
                <>
                  {field === "About" ? (
                    <>
                      <textarea
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        maxLength={55}
                        rows={3}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Word Limit: 55 characters
                      </p>
                    </>
                  ) : field === "LastName" ? (
                    <>
                      <input
                        type="text"
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Only alphabets allowed (no spaces, numbers or symbols)
                      </p>
                    </>
                  ) : field === "Age" ? (
                    <>
                      <input
                        type="number"
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        min={18}
                        max={80}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Allowed Age: 18 - 80
                      </p>
                    </>
                  ) : field === "Skills" ? (
                    <>
                      <input
                        type="text"
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Comma-separated, no spaces allowed
                      </p>
                    </>
                  ) : field === "Gender" ? (
                    <>
                      <select
                        name={field}
                        value={profile[field]}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={profile[field]}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />
                  )}
                </>
              ) : (
                <p className="text-lg">
                  {field === "About" && profile[field]?.length > 30
                    ? `${profile[field].slice(0, 30)}...`
                    : profile[field] || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => toggleEdit(field)}
                disabled={fixedFields.includes(field)}
                className="btn btn-sm btn-ghost"
              >
                {editFields[field] ? <Check size={18} /> : <Pencil size={18} />}
              </button>
            </div>
          </div>
        ))}

      <div className="flex justify-center">
        <button className="btn bg-purple-700 mt-5" onClick={handleUpdateData}>
          Update
        </button>
      </div>

      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg space-y-4 w-80">
            <h3 className="text-lg font-semibold text-black">Update Photo</h3>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
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
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
