import React from "react";
import "./Shimmer.css";

const TaskShimmer: React.FC = () => {
  return (
    <div className="shimmer-full-page">
      {Array(4)
        .fill("")
        .map((_, index) => (
          <div key={index} className="shimmer-box">
            <div className="shimmer-header" />
            <div className="shimmer-line shimmer-task-title" />
            <div className="shimmer-line shimmer-task-details" />
            <div className="shimmer-line shimmer-task-deadline" />
          </div>
        ))}
    </div>
  );
};

export default TaskShimmer;
