import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Question } from "../models/question.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const submitQuestion = asyncHandler(async (req, res) => {
  try {
    const { link, title, revise, difficulty, tags  } = req.body;

    if (!link || !title) {
      throw new ApiError(400, "link/title not provided");
    }

    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "authentication required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

 
    let validatedTags = [];
    if (tags && Array.isArray(tags)) {
      validatedTags = tags.filter(
        (tag) => typeof tag === "string" && tag.trim() !== ""
      );
    }

    const newQuestion = new Question({
      link,
      title,
      revise: revise || false,
      submittedBy: userId,
      difficulty,
      tags: validatedTags,
    });

    await newQuestion.save();

    const now = req.body.now ? new Date(req.body.now) : new Date();
    const lastSubmitted = user.lastSubmitted || null;
    let curr = user.currStreak;
    let max = user.maxStreak;

    if (lastSubmitted) {
      const diff = Math.floor((now - new Date(lastSubmitted)) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        curr = curr + 1;
      } else if (diff > 1) {
        curr = 1;
      }
      // curr=curr+1; //using for testing
    } else {
      curr = 0;
    }

    if (curr > max) {
      max = curr;
    }

    user.currStreak = curr;
    user.maxStreak = max;
    user.lastSubmitted = now;

   const updatedUser= await user.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, updatedUser, "question submitted & streak updated successfully")
      );
  } catch (error) {
    console.error("ERR while submitting question:", error);
    return res
      .status(500)
      .json(new ApiError(500, "something went wrong while submitting question"));
  }
});



export { submitQuestion };
