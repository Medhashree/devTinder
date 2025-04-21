import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addConnections } from "../../utils/connectionSlice";
import { Ban, MessageSquareText  } from "lucide-react";

const Connections = () => {
  const dispatch = useDispatch();
  const [connectionsData, setConnectionsData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const skillColors = [
    "bg-orange-500",
    "bg-indigo-400",
    "bg-violet-500",
    "bg-blue-600",
    "bg-lime-800",
  ];

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setConnectionsData(res?.data?.data || []);
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  const handleShowModal = (skills) => {
    setSelectedSkills(skills);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSkills([]);
  };

  return (
    <>
      <div className="mt-20">
        {connectionsData.length > 0 ? (
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Connections
          </h2>
        ) : (
          <h2 className="text-2xl font-semibold mb-4 text-center">
            No Connections
          </h2>
        )}

        {connectionsData.length > 0 &&
          connectionsData.map((request) => {
            const visibleSkills =
              request.skills.length > 4
                ? request.skills.slice(0, 8)
                : request.skills;

            return (
              <div
                key={request._id}
                className="bg-base-300 rounded-lg p-3 mb-3 flex items-start gap-3 cursor-pointer hover:bg-base-400 transition w-300 mx-auto"
              >
                <img
                  src={request.profilePic}
                  alt={request.firstName}
                  className="w-25 h-25 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">
                      {request.firstName + " " + request.lastName}
                    </h3>
                    <div className="flex gap-2">
                      <button className="btn btn-md btn-circle btn-ghost text-error hover:bg-error hover:text-white">
                        <Ban size={20} />
                      </button>
                      <button className="btn btn-md btn-circle btn-ghost text-success hover:bg-success hover:text-white">
                        <MessageSquareText  size={20} />
                      </button>
                    </div>
                  </div>
                  {(request.age || request.gender) &&<p className="text-sm text-teal-200 mt-1 mb-3">
                    {request.age && <span>{request.age} years</span>}
                    {request.gender && <span>{request.gender}</span>}
                  </p>}
                  <p className="text-base text-gray-500 mt-1 mb-8">
                    {request.about}
                  </p>

                  {request.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
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

                      {request.skills.length > 9 && (
                        <p
                          onClick={() => handleShowModal(request.skills)}
                          className="text-sm text-blue-400 underline cursor-pointer hover:text-blue-300"
                        >
                          See all skills
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
              {selectedSkills.map((skill, index) => (
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

export default Connections;
