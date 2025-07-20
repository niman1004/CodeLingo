import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: "Practice Log", slug: "/submission-history", active: authStatus },
    { name: "Your Profile", slug: "/profile", active: authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/sign-up", active: !authStatus },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#1f1f1f] py-4 shadow-md">
      <div className="flex justify-between items-center px-6">
        <Link to="/">
          <h1 className="text-3xl font-bold font-Onest text-white transition duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#b9ff66] hover:to-[#ff9b22] cursor-pointer">
            CodeLingo
          </h1>
        </Link>

        <ul className="flex items-center gap-4">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className={`inline-block px-6 py-2 border duration-200 rounded-full font-bold font-Onest ${
                    location.pathname === item.slug
                      ? "bg-[#ff9b22] text-black border-[#ff9b22]"
                      : "border-[#b9ff66] text-white hover:bg-[#b9ff66] hover:text-black"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}




export default Header;
