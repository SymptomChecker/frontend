import React from "react";
import "./ResultsDisplay.css";

function ResultsDisplay({ results }) {
  if (!results.length) return null;

  return (
    <div className="results-container">
      {results.map((res, index) => (
        <div key={index} className="result-card">
          <h2>{index + 1}. {res.condition}</h2>
          <p>{res.description}</p>
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${res.confidence}%` }}
            ></div>
          </div>
          <span className="confidence-text">Confidence Score: {res.confidence}%</span>
          <button className="consult-btn">Consult a Doctor</button>
        </div>
      ))}
    </div>
  );
}

export default ResultsDisplay;
