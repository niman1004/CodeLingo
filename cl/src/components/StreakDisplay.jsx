import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Flame } from "lucide-react";
import { useGetRevisionTags } from "../auth/questions";
import { useNavigate } from "react-router-dom";

function StreakDisplay() {
  const userData = useSelector((state) => state.auth.userData);
  const [currStreak, setCurrStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [revTags, setRevTags] = useState([]);

  const { getRevisionTags } = useGetRevisionTags();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrStreak(userData?.currStreak || 0);
    setMaxStreak(userData?.maxStreak || 0);
  }, [userData]);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await getRevisionTags();
      if (res.success) {
        setRevTags(res.data);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="w-full flex flex-col items-start bg-[#1f1f1f] font-Onest rounded-2xl px-6 py-5 shadow-lg ">
      {/* Header */}
      <h2 className="text-white text-[22px] font-bold mb-3">Your Streak</h2>

      {/* Flame + Streak Info */}
      <div className="flex items-center space-x-5">
        {/* Flame Icon */}
        <div className="text-[#ff9b22]">
          <Flame size={56} strokeWidth={2.5} />
        </div>

        {/* Revision Tags */}
        {revTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {revTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/questions?tag=${tag}`)}
                className="px-3 py-1 rounded-full text-sm
                   bg-[#2a2a2a] text-[#ff9b22]
                   hover:bg-[#ff9b22] hover:text-black
                   transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Text Info */}
        <div className="text-white">
          <div className="text-[30px] font-extrabold leading-tight">
            {currStreak > 1 ? currStreak + " Days" : currStreak + " Day"}
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
