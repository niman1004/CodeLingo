import React from "react";
import { useLogout } from "../auth/auth.js";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

function Profile() {
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const userData= useSelector((state)=>state.auth.userData)
  
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      console.log(result)
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
   
       <div className="text-white font-Onest  bg-[#1f1f1f] rounded-xl  px-6 py-6 m-4">
      <div className="font-bold text-3xl">Hello, {userData?.username} 👋 </div>
      <div className="font-bold text-xl mt-3">Daily Goal : solve {userData?.dailyGoal} {userData.dailyGoal > 1? 'questions' : 'question'} everyday</div>
      <div className="mt-2 ">Email: {userData?.email}</div>
      <button
        onClick={handleLogout}
        className="bg-[#ff9b22] text-black border-[#ff9b22]  px-6 py-2 border duration-200 rounded-full font-bold font-Onest"
      >
        Logout from your profile
      </button>
    </div>

    
   
  );
}

export default Profile;
