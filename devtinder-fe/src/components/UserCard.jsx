const UserCard = ({ userData }) => {
  const { firstName, lastName, age, gender, about, profilePic, skills } = userData;
  return (
    <div className="card bg-base-300 w-96 shadow-xl transform transition-transform duration-300 hover:scale-105">
      <figure>
        <img src={profilePic} className="w-[447px] h-[390px]" alt="profilePic" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {gender && (
          <p>
            {gender} , {age && <span>{age}</span>}
          </p>
        )}
        <p>{about}</p>
        {skills.length > 0 &&
          skills.map((skill, index) => <div key={index}> {skill} </div>)}
        <div className="card-actions flex justify-between">
          <button className="btn bg-red-400">Ignore</button>
          <button className="btn bg-purple-700">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
