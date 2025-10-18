import React, { useEffect, useState } from "react";
import "./ResultsDisplay.css";

export default function ResultsDisplay({ results }) {
  const [guidelines, setGuidelines] = useState({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchGuidelines = async () => {
      const newGuidelines = {};

      for (const res of results) {
        try {
          const response = await fetch("http://localhost:5001/api/guideline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptom: res.condition }),
          });

          const data = await response.json();
          newGuidelines[res.condition] =
            data.guideline || "No guideline available.";
        } catch (err) {
          console.error("Failed to fetch guideline:", err);
          newGuidelines[res.condition] = "Error fetching guideline.";
        }
      }

      setGuidelines(newGuidelines);
    };

    if (results && results.length > 0) fetchGuidelines();
  }, [results]);

  const handleConsultClick = () => {
    const confirmCall = window.confirm(
      "🚨 This will call Finland’s emergency number (112). Do you want to continue?"
    );

    if (confirmCall) {
      // Show toast before calling
      setShowToast(true);

      // Automatically hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000);

      // Initiate call (mobile & desktop compatible)
      window.location.href = "tel:112";
    }
  };

  if (!results || results.length === 0) return null;

  return (
    <div className="results-container">
      {results.map((res, index) => (
        <div key={index} className="result-card">
          <h2>
            {index + 1}. {res.condition}
          </h2>
          <p>{res.description}</p>

          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${res.confidence}%` }}
            ></div>
          </div>
          <span className="confidence-text">
            Confidence Score: {res.confidence}%
          </span>

          {/* 🇫🇮 Finland guideline section */}
          {guidelines[res.condition] && (
            <div className="guideline-box">
              <strong>🇫🇮 Finnish Guideline:</strong>
              <p>{guidelines[res.condition]}</p>
            </div>
          )}

          {/* 📞 Consult button */}
          <button className="consult-btn" onClick={handleConsultClick}>
            Consult a Doctor
          </button>
        </div>
      ))}

      {/* ✅ Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          📞 Dialing emergency services (112)...
        </div>
      )}
    </div>
  );
}
