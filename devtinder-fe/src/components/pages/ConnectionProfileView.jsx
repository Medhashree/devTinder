import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addConnections } from "../../utils/connectionSlice";

const ConnectionProfileView = () => {
  const { requestId, userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userConnections, setUserConnections] = useState([]);
  const skillColors = [
    "bg-orange-500",
    "bg-indigo-400",
    "bg-violet-500",
    "bg-blue-600",
    "bg-lime-800",
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/request/profile/${userId}`, {
        withCredentials: true,
      });
      setUserData(res?.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const getUserConnections = async () => {
    try{
      const res = await axios.get(`${BASE_URL}/request/profile/connections/${userId}`, {withCredentials: true});
      setUserConnections(res?.data?.data);
    }catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    getUserData();
    getUserConnections();
  }, []);

  const handleAccept = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(addConnections([res?.data?.data]));
      navigate("/feed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/rejected/${requestId}`,
        {},
        { withCredentials: true }
      );
      navigate("/feed");
    } catch (err) {
      console.error(err);
    }
  };
  if (!userData) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row p-6 gap-10 mt-25 mb-20">
      {/* Left: Profile Info */}
      <div className="w-full md:w-1/3 bg-base-100 p-5 rounded-xl shadow-md text-center">
        <img
          src={userData.profilePic}
          alt={userData.firstName}
          className="w-80 h-80 object-cover rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">
          {userData.firstName}{" "}
          {userData.lastName && <span>{userData.lastName}</span>}
        </h2>
        {userData.age && (
          <p className="text-sm text-gray-600">Age: {userData.age}</p>
        )}
        {userData.gender && (
          <p className="text-sm text-gray-600 mb-4">
            Gender: {userData.gender}
          </p>
        )}
        <p className="text-sm text-white">{userData.about}</p>

        <div className="card-actions flex justify-center pt-4 mt-3">
          <button
            className="btn btn-outline btn-error hover:bg-red-400 hover:text-white"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="btn bg-purple-700 text-white hover:bg-purple-900"
            onClick={handleAccept}
          >
            Accept
          </button>
        </div>
      </div>

      {/* Right: Skills and Connections */}
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        {/* Skills Section */}
        <div className="bg-base-100 p-5 rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-3">
            {userData.skills?.map((skill, index) => (
              <span
                key={index}
                className={`${
                  skillColors[index % skillColors.length]
                } text-white px-4 py-1 rounded-full text-sm`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Connections Section */}
        <div className="bg-base-100 p-5 rounded-xl shadow-md mt-10">
          <h3 className="text-xl font-bold mb-4">Works most with...</h3>
            {userConnections.length === 0 && <p>Looks like they’re just getting started — no connections yet.</p>}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {userConnections.length > 0 && userConnections?.map((conn) => (
              <div key={conn._id} className="text-center">
                <img
                  src={conn.profilePic}
                  alt={conn.firstName}
                  className="w-16 h-16 object-cover rounded-full mx-auto mb-1"
                />
                <p className="text-sm font-medium">{conn.firstName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionProfileView;
