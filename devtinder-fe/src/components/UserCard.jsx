import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ userData, setToastInfo}) => {
  const { _id, firstName, lastName, age, gender, about, profilePic, skills } =
    userData;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const skillColors = [
    "bg-orange-500",
    "bg-indigo-400",
    "bg-violet-500",
    "bg-blue-600",
    "bg-lime-800",
  ];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const visibleSkills = skills.length > 4 ? skills.slice(0, 3) : skills;

  const handleInterest = async() => {
    try{
      const res = await axios.post(`${BASE_URL}/request/send/interested/${_id}`, {}, {withCredentials: true});
      setToastInfo({ type: 'interest', name: firstName })
      dispatch(removeFeed());
    }catch(err){
      console.error(err);
    }
  };

  const handleIgnore = async() => {
    try{
      const res = await axios.post(`${BASE_URL}/request/send/ignored/${_id}`, {}, {withCredentials: true});
      setToastInfo({ type: 'ignore', name: firstName })
      dispatch(removeFeed());
    }catch(err){
      console.error(err);
    }
  };

  return (
    <>
      <div className="card bg-base-300 w-96 shadow-xl transform transition-transform duration-300 hover:scale-105 text-white">
        <figure className="relative w-full h-[350px]">
          <img
            src={profilePic}
            className="w-full h-full object-cover rounded"
            alt="profilePic"
          />
          {location.pathname === '/profile' && <button
            className="absolute top-2 right-2 bg-black p-2 rounded-full shadow hover:scale-110 transition-transform duration-200"
            onClick={() => navigate("/settings")}
          >
            <Pencil size={18} />
          </button>}
        </figure>
        <div className="card-body space-y-3 text-center">
          <h2 className="text-xl font-bold text-white">
            {firstName} {lastName && <span>{lastName} </span>}
          </h2>

          {(age || gender) && (
            <p className="text-md text-teal-200">
              {age && <span>{age} years old</span>}
              {gender && <span className="ml-2">{gender}</span>}
            </p>
          )}

          {about && <p className="text-sm text-gray-400">{about}</p>}

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {visibleSkills.map((skill, index) => (
                <span
                  key={index}
                  className={`${
                    skillColors[index % skillColors.length]
                  } text-white px-3 py-1 rounded-full text-sm`}
                >
                  {skill}
                </span>
              ))}

              {skills.length > 4 && (
                <p
                  onClick={handleShowModal}
                  className="text-sm text-blue-400 underline cursor-pointer hover:text-blue-300"
                >
                  See all skills
                </p>
              )}
            </div>
          )}

          {location.pathname !== "/profile" && (
            <div className="card-actions flex justify-between pt-4">
              <button className="btn btn-outline btn-error hover:bg-red-400 hover:text-white" onClick={handleIgnore}>
                Ignore
              </button>
              <button className="btn bg-purple-700 text-white hover:bg-purple-900" onClick={handleInterest}>
                Interested
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-base-200 p-6 rounded-lg w-80 max-h-[80vh] overflow-auto">
            {/* Close Button */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4 text-white text-center">
              All Skills
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className={`${
                    skillColors[index % skillColors.length]
                  } text-white px-3 py-1 rounded-full text-sm`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
