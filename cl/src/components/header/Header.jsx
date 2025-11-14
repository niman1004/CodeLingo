import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogOut, User } from "lucide-react";
import { useLogout } from "../../auth/auth.js"

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const logoutUser = useLogout(); 

  const navItems = [
    { name: "Practice Log", slug: "/submission-history", active: authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/sign-up", active: !authStatus },
  ];

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
    <div className="fixed top-0 left-0 w-full z-50 bg-[#1f1f1f] py-4 shadow-md overflow-x-hidden">
      <div className="flex justify-between items-center px-6">
        <Link to="/home">
          <h1 className="text-3xl font-bold font-Onest text-white transition duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#b9ff66] hover:to-[#ff9b22] cursor-pointer">
            CodeLingo
          </h1>
        </Link>

        {/* Avatar button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-[#b9ff66] text-[#1f1f1f] hover:bg-[#ff9b22] p-2 rounded-full"
        >
          <User size={28} />
        </button>
      </div>

      {/* Drawer + Overlay */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 right-0 w-72 h-full bg-[#1f1f1f] shadow-lg z-50 p-6 transition-transform duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold">
                👋 Hello, {userData?.username || "Guest"}
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="text-white mb-4 space-y-1">
              <p>Email: {userData?.email || "Not logged in"}</p>
              {userData?.dailyGoal && (
                <p>
                  Daily Goal: {userData.dailyGoal}{" "}
                  {userData.dailyGoal > 1 ? "questions" : "question"}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-4 mt-6">
              {navItems.map(
                (item) =>
                  item.active && (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.slug);
                        setDrawerOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg font-Onest font-bold ${
                        location.pathname === item.slug
                          ? "bg-[#ff9b22] text-black border border-[#ff9b22]"
                          : "border border-[#b9ff66] text-white hover:bg-[#b9ff66] hover:text-black"
                      }`}
                    >
                      {item.name}
                    </button>
                  )
              )}

              {authStatus && (
                <button
                  onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-[#ff9b22] text-black px-4 py-2 rounded-lg font-bold hover:brightness-110"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
