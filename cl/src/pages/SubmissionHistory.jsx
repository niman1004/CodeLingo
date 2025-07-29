import React, { useEffect, useState } from "react";
import Questionbox from "../components/Questionbox";
import { useGetSubmittedQuestions } from "../auth/questions";
import { useSelector } from "react-redux";
import Container from "../components/container/Container";

function SubmissionHistory() {
  const userData = useSelector((state) => state.auth.userData);
  const getSubmittedQuestions = useGetSubmittedQuestions();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const fetchingQuestions = async () => {
    try {
      const response = await getSubmittedQuestions();
      if (response.success) {
        setQuestions(response.data.reverse() || []);
      } else {
        console.error(response.message);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingQuestions();
  }, []);

 
  if (loading) {
    return (
      <div className="w-full text-center text-white font-Onest py-10 animate-pulse">
        Loading questions...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full text-center text-white font-Onest py-10 animate-pulse">
        No questions found.
      </div>
    );
  }
  

  const uniqueMonths = [
    ...new Set(questions.map(q=>q.createdAt?.slice(0 , 7)))
  ].filter(Boolean)
    .sort((a, b) => b.localeCompare(a));

   
  const filteredQuestions = questions.filter((q) => {
    if (filter === "revision") return q.revise === true;
    if(filter==="month" && selectedMonth){
      const qMonth= q.createdAt?.slice(0 , 7)
      return qMonth===selectedMonth
    }
    return true; // for 'all'
  });

  return (
    <Container>
      <div className="flex gap-4 items-center justify-center mt-4 text-white font-Onest">
        <button
          className={`px-4 py-1 rounded ${
            filter === "all" ? "bg-[#b9ff66] text-black" : "bg-gray-700"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-1 rounded ${
            filter === "revision" ? "bg-[#b9ff66] text-black" : "bg-gray-700"
          }`}
          onClick={() => setFilter("revision")}
        >
          Revisions
        </button>
        <select
          className="bg-gray-800 text-white px-2 py-2 rounded"
          value={selectedMonth || ""}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setFilter("month");
          }}
        >
          <option value="">Select Month</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {new Date(`${month}-01`).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4 p-4 pt-5 items-center">
        {filteredQuestions.map((q) => (
          <Questionbox key={q._id} {...q} />
        ))}
      </div>
    </Container>
  );
}

export default SubmissionHistory;
