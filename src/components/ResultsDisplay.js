// src/components/ResultsDisplay.js
import React from 'react';
import './ResultsDisplay.css'; // For component-specific styles

function ResultsDisplay({ results }) {
  if (!results || results.length === 0) {
    return null; // Don't render if no results
  }

  return (
    <div className="results-container">
      <h2>Potential Conditions:</h2>
      {results.map((condition, index) => (
        <div key={index} className="condition-card">
          <h3>{index + 1}. {condition.name}</h3>
          {condition.confidence && (
            <div className="confidence-bar-container">
              <div
                className="confidence-bar"
                style={{ width: `${condition.confidence}%` }}
              ></div>
              <span className="confidence-text">{condition.confidence}% Confidence</span>
            </div>
          )}
          {condition.description && <p className="condition-description">{condition.description}</p>}
          {condition.matchedSymptoms && condition.matchedSymptoms.length > 0 && (
            <p><strong>Your symptoms matching this:</strong> {condition.matchedSymptoms.join(', ')}</p>
          )}
          {condition.commonSymptoms && condition.commonSymptoms.length > 0 && (
            <p><strong>Other common symptoms:</strong> {condition.commonSymptoms.join(', ')}</p>
          )}
          {condition.advice && <p className="condition-advice"><strong>Advice:</strong> {condition.advice}</p>}
          <button className="consult-doctor-btn" onClick={() => alert(`Seeking medical advice for ${condition.name}`)}>
            Consult a Doctor
          </button>
        </div>
      ))}
    </div>
  );
}

export default ResultsDisplay;