import conf from "../conf/conf.js";
import { login , logout } from "../store/authSlice.js";
import { useDispatch } from "react-redux";

const useLogin = () => {
  const dispatch = useDispatch();

  const loginUser = async ({ username, password }) => {
    try {
      const response = await fetch(`${conf.API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include cookies in the request
      });
      console.log("REQ SENT TO BACKEND");

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "login failed");
      }
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      dispatch(
        login({
          userData: data.data.user,
          accessToken: data.data.accessToken,
        })
      );

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return loginUser;
};

const signUp = async ({ username, email, password }) => {
  try {
    const response = await fetch(`${conf.API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "SignUp failed");
    }

    console.log("User created successfully");
    return data;

  } catch (error) {
    console.error("Sign Up Error:", error.message);
    throw error; 
  }
};

const useLogout = () => {
  const dispatch = useDispatch();

  const logoutUser = async () => {
    try {
      const response = await fetch(`${conf.API_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      
      const data = await response.json();
      

      if (response.ok) {
        console.log("Logout successful:", data.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log("LOGOUT- ACCESS AND REFRESH TOKEN REMOVED")
        dispatch(logout());
      } else {
        console.error("Logout failed:", data.message);
      }

      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error("Network error during logout:", error);
      return { success: false, message: error.message };
    }
  };

  return logoutUser;
};

const refreshAccessToken = async () => {
  try{
    const response = await fetch(`${conf.API_URL}/user/refresh-token` , {
      method:"POST",
      credentials:"include",
      headers: {
              Authorization: `Bearer ${refreshToken}`,
            }
    })
    const data= await response.json();
    if(!response.ok){
      throw new Error(data.message || "failed to refresh access token");
    }
    localStorage.setItem("accessToken" , data.data.accessToken)
    return data.data.accessToken
  }catch(error){
    console.error("refresh token error::" , error.message);
    return null;
  }
  
}

 const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${conf.API_URL}/user/current`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("UPDATING STORE WITH NEW STREAK DATA I.E " , data.data)
      dispatch(login({ userData: data.data, accessToken }));
      
    }
  };

  return getCurrentUser;
};



export { useLogin, signUp , useLogout , refreshAccessToken , useGetCurrentUser };
