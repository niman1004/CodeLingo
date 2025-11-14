import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
function AuthLayout({ children, authentication = true }) {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      //you dont have to log in to see the page but you are logged in
      //eg login page and sign up page
      navigate("/Home");
    }
    setLoader(false);
  }, [authStatus, authentication, navigate]);

  if (loader) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  }
  else{
    return (
        <>
        {children}
        </>
    )
  }
}

export default AuthLayout;
