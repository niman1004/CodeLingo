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
      const response= await fetch(`${conf.API_URL}/user/current` , {
        method:"GET",
        credentials:"include"
      });

      if(response.ok){
        const data= await response.json();
        dispatch(login({userData: data.data.user}))
        return;
      }

      //trying to refresh token if above failed
      const refreshed= await refreshAccessToken();

      if(refreshed){
        const retryResponse= await fetch(`${conf.API_URL}/user/current` , {
          method: "GET",
          credentials:"include"
        });

        if(retryResponse.ok){
          const data= await retryResponse.json();
          dispatch(login({userData:data.data.user}));
          return;
        }
      }
      dispatch(logout());
     } catch (error) {
      console.error('error checking auth status' , error);
      dispatch(logout());
    }
      
     }

     checkAuthStatus();
    } , [dispatch]);

  return <RouterProvider router={router} />;
};

export default AppInnit;
