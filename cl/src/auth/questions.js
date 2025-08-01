import { useDispatch } from "react-redux";
import conf from "../conf/conf.js";
import { login } from "../store/authSlice.js";

const useSubmitQuestion = () => {
  const dispatch = useDispatch();

  const submitQuestion = async ({ link, title, tags, revise , difficulty , notes }) => {
    try {
      const response = await fetch(`${conf.API_URL}/user/submit-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link, title, tags, revise, difficulty , notes}),
        credentials: "include"
      })
      console.log("QUESTION SUBMITTING TO BACKEND")
      console. log('NEW Q::' , response)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "something is wrong in submit question")
      }
      dispatch(login({ userData: data.data }));
      return { success: true, message: data.message };

    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  return submitQuestion
}

const useGetHeatmapData = () => {
  const getHeatmapData = async () => {
    try {
      const response = await fetch(`${conf.API_URL}/user/heatmap-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong fetching heatmap data");
      }

      return { success: true, message: data.message, data: data.data };

    } catch (error) {
      return { success: false, message: error.message, data: [] };
    }
  };

  return getHeatmapData;
};

const useGetSubmittedQuestions = () => {
  const getSubmittedQuestions = async () => {
    try {
      const response = await fetch(`${conf.API_URL}/user/questions-solved`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"

      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "something went wrong while fetching submission history")

      }
      console.log(data)
      return { success: true, message: data.message, data: data.data }
    } catch (error) {
      return { success: false, message: error.message, data: [] }
    }
  }

  return getSubmittedQuestions
}

export { useSubmitQuestion, useGetHeatmapData, useGetSubmittedQuestions }