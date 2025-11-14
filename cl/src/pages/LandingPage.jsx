import React from "react";
import { Link } from "react-router-dom";
import LandingPageIcon from "../assets/LandingPageIcon.svg";

function LandingPage() {
  return (
    <div className="flex flex-col justify-center px-10 md:px-20 bg-transparent">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">

        {/* LEFT: TEXT */}
        <div className="md:w-1/2">
          <h1 className="font-Onest text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b9ff66] to-[#ff9b22] leading-tight">
            Code a Little. <br /> Grow a Lot.
          </h1>

          <p className="font-Onest text-white mt-6 text-lg md:text-xl opacity-90">
            Turn coding into a daily ritual.  
            Track your progress, build habits, and level up like never before.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-10">
            <Link
              to="/login"
              className="px-6 py-4 font-Onest rounded-full bg-[#b9ff66] text-black font-semibold hover:opacity-90 transition"
            >
              Log In
            </Link>

            <Link
              to="/sign-up"
              className="px-6 py-4 font-Onest rounded-full border border-[#ff9b22] text-[#ff9b22] font-semibold hover:bg-[#ff9b2215] transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* RIGHT: ILLUSTRATION */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={LandingPageIcon}
            alt="Landing Page Illustration"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
