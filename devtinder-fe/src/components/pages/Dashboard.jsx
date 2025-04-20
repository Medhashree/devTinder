import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "../UserCard";
import ConnectionSidebar from "../ConnectionSidebar";

const Dashboard = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed.items);

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
  }, []);

  return (
    <div className=" flex mt-20">
      <div className="mb-20">
      <ConnectionSidebar />
      </div>
      <main className="ml-72 p-6 w-full"> {/* Adjust for sidebar width */}
      {feed.length > 0 && <div className="flex justify-center">
        <UserCard userData = {feed[0]} />
      </div>}
      </main>
    </div>
  );
};

export default Dashboard;
