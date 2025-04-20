import { useSelector } from "react-redux";
import UserCard from "../UserCard";

const Profile = () => {
  const userData = useSelector((store) => store.user);

  return (
    <div>
      { userData && (
        <div className="flex justify-center">
          <UserCard userData={userData} />
        </div>
      )}
    </div>
  );
};

export default Profile;
