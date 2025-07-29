import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { useSelector, useDispatch } from "react-redux";
import { useSubmitQuestion } from "../auth/questions.js";
import { useGetCurrentUser } from "../auth/auth.js";

function Postform() {
  const userData = useSelector((state) => state.auth.userData);
  const submitQuestion = useSubmitQuestion();
  const getCurrentUser = useGetCurrentUser();

  const { register, handleSubmit, reset } = useForm();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const onSubmit = async (formData) => {
    try {
      const { title, "question-link": link, revise , difficulty } = formData;
      
      const payload = {
        link,
        title,
        revise: revise,
        tags,
        difficulty: difficulty
      };

      const result = await submitQuestion(payload);

      if (result?.success) {
        alert("Question submitted successfully!");
        setTags([]);
        reset();
      } else {
        alert(result?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Failed to submit question:", error.message);
      alert(error.message || "Submission failed");
    }
  };

  const handleTagInput = (e) => {
    if (e.key === " " && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full bg-[#1f1f1f] rounded-xl p-4 ">
      {/* Heading and Submit Button */}
      <div className="flex items-center justify-between mb-2 ml-4 mr-4">
        <div className="font-Onest text-white font-bold text-2xl">
          Progress Tracker: Log Your Hustle
        </div>
        <button
          type="submit"
          form="progress-form"
          className="bg-[#ff9b22] text-black border-[#ff9b22]  px-6 py-2 border duration-200 rounded-full font-bold font-Onest"
        >
          Submit
        </button>
      </div>

      {/* Daily Goal */}
      <div className="font-Onest text-white ml-4 mb-2">
        Daily Goal - {userData?.dailyGoal} Questions
      </div>

      {/* Form */}
      <form
        id="progress-form"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2"
      >
        <div className="space-y-3 ml-4 mr-4">
          <Input
            {...register("question-link", { required: true })}
            label="Problem Link :"
            placeholder="Enter link to problem solved"
          />
          <Input
            {...register("title", { required: true })}
            label="Title :"
            placeholder="Enter Title"
          />

          {/* Tags Input */}
          <div>
            <label className="block text-white mb-1 font-Onest">Tags :</label>
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="Type tag and press space"
            />
            {/* Display Tags */}
            <div className="flex flex-wrap mt-2 gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-[#ff9b22] text-white px-2 py-1 rounded flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-xs hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-4 text-white font-Onest">
           
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("revise")}
                className="h-4 w-4 rounded accent-[#ff9b22]"
              />
              <span>Revisit Later</span>
            </label>

            {/* Difficulty Select */}
            <div className="flex items-center space-x-2">
              <label htmlFor="difficulty">Difficulty:</label>
              <select
                id="difficulty"
                {...register("difficulty", { required: true })}
                className="bg-[#2b2b2b] text-white px-2 py-1 rounded border border-gray-600 focus:outline-none"
              >
                <option value="">Select</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Postform;
