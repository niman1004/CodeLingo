import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Question } from "../models/question.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const submitQuestion = asyncHandler(async (req, res) => {
  try {
    const { link, title, revise, difficulty, notes, tags, now: nowInput } = req.body;

    if (!link || !title) {
      throw new ApiError(400, "Link and title are required.");
    }

    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Authentication required.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // Validate and clean tags
    const validatedTags = Array.isArray(tags)
      ? tags.filter((tag) => typeof tag === "string" && tag.trim() !== "")
      : [];

    // Set current date
    const now = nowInput ? new Date(nowInput) : new Date();
    const lastSubmitted = user.lastSubmitted ? new Date(user.lastSubmitted) : null;

    let curr = user.currStreak || 0;
    let max = user.maxStreak || 0;

    if (!lastSubmitted) {
      curr = 1;
    } else {
      const diff = Math.floor((now - lastSubmitted) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        curr += 1;
      } else if (diff > 1) {
        curr = 1;
      }
      // diff === 0 → same day → no change
    }

    if (curr > max) max = curr;

    user.currStreak = curr;
    user.maxStreak = max;
    user.lastSubmitted = now;

    const updatedUser = await user.save(); // Save streak updates first

    const newQuestion = new Question({
      link,
      title,
      revise: revise || false,
      submittedBy: userId,
      difficulty,
      notes,
      tags: validatedTags,
    });

    await newQuestion.save(); // Save question after user update

    return res.status(201).json(
      new ApiResponse(
        201,
        updatedUser,
        "Question submitted & streak updated successfully."
      )
    );
  } catch (error) {
    console.error("Error while submitting question:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while submitting the question."));
  }
});




export { submitQuestion };
