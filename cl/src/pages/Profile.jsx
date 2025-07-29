import React from "react";
import { useLogout } from "../auth/auth.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Profile() {
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const userData = useSelector((state) => state.auth.userData);

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      console.log(result);
      if (result.success) {
        alert("User logged out");
        navigate("/login");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.log("Logout error:", error.message);
      alert("Something went wrong during logout.");
    }
  };

  return (
    <div className="text-white font-Onest bg-[#1f1f1f] rounded-2xl px-8 py-10 m-4 shadow-xl max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-bold text-4xl mb-2">Hello, {userData?.username} 👋</h1>
        <p className="text-lg">Welcome back to your DSA tracker!</p>
      </div>

      <div className="space-y-2">
        <p className="font-bold text-xl">
          Daily Goal: Solve {userData?.dailyGoal}{" "}
          {userData.dailyGoal > 1 ? "questions" : "question"} every day
        </p>
        <p className="text-md">Email: {userData?.email}</p>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="bg-[#ff9b22] hover:brightness-110 text-black border-[#ff9b22] px-6 py-2 border duration-200 rounded-full font-bold font-Onest"
        >
          Logout from your profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
