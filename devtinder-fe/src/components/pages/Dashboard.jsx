import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "../UserCard";

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
    <div className="mt-20">
      {feed.length > 0 && <div className="flex justify-center">
        <UserCard userData = {feed[0]} />
      </div>}
    </div>
  );
};

export default Dashboard;
