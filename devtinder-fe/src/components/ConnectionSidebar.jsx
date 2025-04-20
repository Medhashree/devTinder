import { X, Check } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";

const dummyRequests = [
  {
    id: 1,
    name: "Sneha Dey",
    about: "Loves tech, coffee, and music.",
    image:
      "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg", // Replace with actual image
  },
  {
    id: 2,
    name: "Rohit Sharma",
    about: "Frontend developer with React skills.",
    image: "https://via.placeholder.com/40",
  },
];

const ConnectionSidebar = () => {
  const [requestsReceived, setRequestsReceived] = useState([]);

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      setRequestsReceived(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="w-80 h-screen fixed left-0 top-0 bg-base-200 shadow-md overflow-y-auto px-4 pt-20 pb-20">
      {requestsReceived.length > 0 ? (
        <h2 className="text-xl font-semibold mb-4">Requests</h2>
      ) : (
        <h2 className="text-xl font-semibold mb-4">No Pending Requests</h2>
      )}

      {requestsReceived.length > 0 &&
        requestsReceived.map((request) => (
          <div
            key={request._id}
            className="bg-base-100 rounded-lg p-3 mb-3 flex items-start gap-3 cursor-pointer hover:bg-base-300 transition"
          >
            <img
              src={request.fromUserId.profilePic}
              alt={request.fromUserId.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">
                  {request.fromUserId.firstName +
                    " " +
                    request.fromUserId.lastName}
                </h3>
                <div className="flex gap-2">
                  <button className="btn btn-xs btn-circle btn-ghost text-error hover:bg-error hover:text-white">
                    <X size={14} />
                  </button>
                  <button className="btn btn-xs btn-circle btn-ghost text-success hover:bg-success hover:text-white">
                    <Check size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {request.fromUserId.about.length > 25
                  ? request.fromUserId.about.slice(0, 25) + "..."
                  : request.fromUserId.about}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConnectionSidebar;
