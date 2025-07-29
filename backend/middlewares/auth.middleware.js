import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const cookieToken = req.cookies?.accessToken;
    const headerToken = req.header("Authorization")?.replace("Bearer ", "");
    
    console.log("Cookie token:", cookieToken);
    console.log("Authorization header token:", headerToken);

    const token = cookieToken || headerToken;

    if (!token || token === "undefined") {
      console.log("No token provided.");
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decodedToken);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      console.log("No user found for decoded token.");
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("JWT verification failed:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
