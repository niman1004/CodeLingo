import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Question } from "../models/question.model.js";
import mongoose from "mongoose";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const { username, email, password } = req.body;
  console.log("REQ.BODY:::", req.body);
  console.log("email::", email);

  //validate the input (email isnt empty etc)
  if ([username, email, password].some((feild) => feild?.trim() === "")) {
    throw new ApiError(400, "all feilds are required");
  }

  //user already exists? email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email/username exists");
  }

  //create user object - create entry in db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });
  //remove password and refresh token feild from response
  //check for user creation
  const UserCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!UserCreated) {
    throw new ApiError(500, "something went wrong while registering user");
  }

  //return response

  return res
    .status(201)
    .json(new ApiResponse(200, UserCreated, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get email password
  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(400, "username is required");
  }
  //send email password to db and check if email exists
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  //if it does check if password is currect
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password isnt correct");
  }
  //if yes provide user with token 
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true, //set to true in production,
    sameSite: "none",
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged in successfully!"
      )
    )
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      //to get the updated info with undef refreshtoken
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: false, //set to true in production
    sameSite: "strict"
  }

  return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))
})

const refreshAcessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken
    if (!incomingRefreshToken) {
      throw new ApiError(401, "from refreshAcess token API-unauthorized request")
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new ApiError(401, "from refreshAcess token API-invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "from refreshAcess token API-refreshtoken expired or used")
    }

    const options = {
      httpOnly: true,
      secure: false, //set to true in production
      sameSite: "strict"
    }

    const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(200,
          { accessToken, refreshToken: newrefreshToken },
          "refresh token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "refresh token invalid"
    )
  }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  //fetch user
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password")
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false })
  return res.status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateDailyGoal = asyncHandler(async (req, res) => {
  const { dailyGoal } = req.body

  const user = await User.findById(req.user?._id)
  if (!dailyGoal) {
    throw new ApiError(400, "daily goal is required")
  }
  user.dailyGoal = dailyGoal
  await user.save({ validateBeforeSave: false })

  return res.status(200)
    .json(new ApiResponse(200, {}, "daily goal has been updated"))
})

const getQuestionsSolved = asyncHandler(async (req, res) => {
  console.log(req)
 const userId = req.user._id;
console.log("req._id:", req._id, typeof req._id);
  const questionsList = await Question.find({ submittedBy: new mongoose.Types.ObjectId(req.user._id) });

  return res
    .status(200)
    .json(new ApiResponse(200, questionsList, "questions log received"));
})

const getHeatmapData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

 const data = await Question.aggregate([
  { $match: { submittedBy: userId } },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
      },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,              
      date: "$_id",        
      count: 1             
    }
  },
  { $sort: { date: 1 } }
]);


  return res.status(200).json(new ApiResponse(200, data, "heatmap data"));



}

);

const getRandomTags= asyncHandler( async(req , res)=>{
  const userId= req.user._id;
  const tags= await Question.aggregate([
    {$match : {submittedBy: userId}},
    {$unwind: "$tags"},
    { $group : {_id:"$tags" , count:{$sum : 1}}},
    {$sample : {size : 2}}
  ]);

  
    const tagnames= tags.map(t=>t._id);
    return res.status(200).json(new ApiResponse(200 , tagnames , "random question tags for revision"))
 
});

export { registerUser, loginUser, logoutUser, refreshAcessToken, changeCurrentPassword, getCurrentUser, updateDailyGoal , getQuestionsSolved , getHeatmapData , getRandomTags };
