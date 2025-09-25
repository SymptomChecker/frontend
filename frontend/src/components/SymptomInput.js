import React from "react";
import "./SymptomInput.css";

function SymptomInput({ symptoms, setSymptoms, onCheck }) {
  return (
    <div className="symptom-input-container">
      <textarea
        className="symptom-textarea"
        placeholder="e.g., I have a bad cough, sore throat, and I'm very tired."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <button className="check-btn" onClick={onCheck}>
        Check Symptoms
      </button>
    </div>
  );
}

export default SymptomInput;
