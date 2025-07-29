import React, { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Heatmap.css";
import { useSelector } from "react-redux";
import { useGetHeatmapData } from "../auth/questions";
import { useEffect } from "react";

function Heatmap() {
  const userData = useSelector((state) => state.auth.userData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [heatmapData, setHeatmapData] = useState([]);

  const recieveHeatmapData = useGetHeatmapData(userData);

  const startD = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endD = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );

  const handlePrev = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 2,
      1
    );
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      1
    );
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    const fetchHMdata = async () => {
      const res = await recieveHeatmapData();
      if (res.success) {
        setHeatmapData(res.data);
      } else {
        console.error(res.message);
      }
    };

    fetchHMdata();
  }, [userData]);

  return (
    <div className="bg-[#1f1f1f] mt-3 mr-4 p-6 rounded-xl">
      <div className="flex justify-between items-center ">
        <button
          onClick={handlePrev}
          className="px-3 py-1 font-Onest bg-[#b9ff66] hover:bg-gray-300 rounded"
        >
          Prev
        </button>
        <h2 className=" font-bold text-2xl font-Onest text-white">
          {formatMonthYear(startD)} – {formatMonthYear(endD)}
        </h2>
        <button
          onClick={handleNext}
          className="px-3 py-1 font-Onest bg-[#ff9b22] hover:bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      <div className="m-0 p-0 flex justify-center items-center">
        <CalendarHeatmap
          startDate={startD}
          endDate={endD}
          values={heatmapData}
          horizontal={true}
          gutterSize={3}
          showWeekdayLabels={true}
          classForValue={(value) => {
            if (!value || value.count === 0) {
              return "color-empty";
            }
            if (value.count < 2) return "color-gitlab-1";
            if (value.count < 5) return "color-gitlab-2";
            if (value.count < 10) return "color-gitlab-3";
            return "color-gitlab-4";
          }}
          titleForValue={(value) => {
            if (!value || !value.date) return "No submissions";
            return `${value.date}: ${value.count} submissions`;
          }}
        />
      </div>
    </div>
  );
}

export default Heatmap;
