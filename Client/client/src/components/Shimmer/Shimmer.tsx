import React from "react";
import "./Shimmer.css"; // Make sure this file exists and contains the necessary styles

const Shimmer: React.FC = () => {
  return (
    <div className="shimmer-container">
      {Array(10)
        .fill("")
        .map((_, index) => (
          <div key={index} className="shimmer-card">
            <div className="shimmer-img" />
            <div className="shimmer-line shimmer-title" />
            <div className="shimmer-line shimmer-subtitle" />
          </div>
        ))}
    </div>
  );
};

export default Shimmer;
