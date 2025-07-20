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
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, authentication, navigate]);

  if(loader){
    return (<ClipLoader color='#3498db' size={50}/>)
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
