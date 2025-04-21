import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "../UserCard";
import ConnectionSidebar from "../ConnectionSidebar";

const Dashboard = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed.items);

  const [toastInfo, setToastInfo] = useState({ type: "", name: "" });

  const getFeed = async () => {
    if (feed.length) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, [feed]);

  useEffect(() => {
    if (toastInfo.type) {
      const timer = setTimeout(() => setToastInfo({ type: '', name: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastInfo]);
  

  return (
    <div className=" flex mt-20">
      {/* Dark overlay */}
      {toastInfo.type && (
        <div className="toast toast-top toast-end mt-20">
          <div
            className={`alert ${
              toastInfo.type === "ignore" ? "alert-error" : "alert-success"
            }`}
          >
            <span className="text-white font-semibold">
              {toastInfo.name} was{" "}
              {toastInfo.type === "ignore" ? "ignored" : "shown interest in"}
            </span>
          </div>
        </div>
      )}

      <div className="mb-20">
        <ConnectionSidebar />
      </div>
      <main className="ml-72 p-6 w-full">
        {" "}
        {/* Adjust for sidebar width */}
        {feed.length === 0 && (
          <div className="text-2xl text-center">
            All done! More people might pop up soon.
          </div>
        )}
        {feed.length > 0 && (
          <div className="flex justify-center">
            <UserCard userData={feed[0]} setToastInfo={setToastInfo} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
