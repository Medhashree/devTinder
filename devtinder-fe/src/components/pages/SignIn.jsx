import backgroundImage from "../../assets/background-image.png";

const SignIn = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Lighter overlay (with lower opacity to make the image lighter) */}
      <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
      {/* Adjust opacity for lighter effect */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <button className="font-bold text-white border-2 border-purple-300 px-6 py-2 rounded-full mx-4 hover:bg-purple-500 hover:border-purple-200 transition hover:cursor-pointer">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SignIn;
