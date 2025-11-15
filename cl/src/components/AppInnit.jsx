import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { refreshAccessToken } from "../auth/auth.js";
import conf from "../conf/conf.js";
import { logout, login } from "../store/authSlice";

const AppInnit = ({ router }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        let token = accessToken || localStorage.getItem("accessToken");

        if (token) {
          const response = await fetch(`${conf.API_URL}/user/current`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch(login({ userData: data.data, accessToken: token }));
            localStorage.setItem("accessToken", token); // sync localStorage with Redux
            return;
          }
        }

        // If no token or fetch failed → try to refresh token
        const newAccessToken = await refreshAccessToken();
        console.log("ACCESS TOKEN NOT FOUND, REFRESH TOKEN RUN")
        if (newAccessToken) {
          const response = await fetch(`${conf.API_URL}/user/current`, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("CURR USER DATA:::", data);
            dispatch(
              login({ userData: data.data.user, accessToken: newAccessToken })
            );
            localStorage.setItem("accessToken", newAccessToken); // sync localStorage with Redux
            return;
          }
        }

        // Logout if everything fails
        dispatch(logout());
         localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData")
      } catch (error) {
        console.error("Error checking auth status:", error);
        dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData")
      }
    };
     checkAuthStatus(); 
  }, [dispatch, accessToken]);

  return <RouterProvider router={router} />;
};

export default AppInnit;
