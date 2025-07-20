import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Flame } from "lucide-react";

function StreakDisplay() {
  const userData = useSelector((state) => state.auth.userData);
  const [currStreak, setCurrStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    setCurrStreak(userData?.currStreak || 0);
    setMaxStreak(userData?.maxStreak || 0);
  }, [userData]);

  return (
    <div className="w-full flex flex-col items-start bg-[#1f1f1f] font-Onest rounded-2xl px-6 py-5 shadow-lg mt-3">
      {/* Header */}
      <h2 className="text-white text-[22px] font-bold mb-3">Your Streak</h2>

      {/* Flame + Streak Info */}
      <div className="flex items-center space-x-5">
        {/* Flame Icon */}
        <div className="text-[#ff9b22]">
          <Flame size={56} strokeWidth={2.5} />
        </div>

        {/* Text Info */}
        <div className="text-white">
          <div className="text-[30px] font-extrabold leading-tight">
          {currStreak > 1? currStreak + ' Days' : currStreak + ' Day'}
          </div>
          <div className="text-base text-gray-400 mt-1">
            Best streak: {maxStreak} days
          </div>
          <div className="text-base mt-1">
            {currStreak === 0 ? "Start solving now" : "Keep the streak alive!"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakDisplay;
