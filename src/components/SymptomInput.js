// src/components/SymptomInput.js
import React, { useState } from 'react';
import './SymptomInput.css'; // For component-specific styles

function SymptomInput({ onSubmit, isLoading }) {
  const [currentSymptoms, setCurrentSymptoms] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentSymptoms.trim() && !isLoading) {
      onSubmit(currentSymptoms);
    }
  };

  return (
    <form className="symptom-input-form" onSubmit={handleSubmit}>
      <label htmlFor="symptoms-textarea">
        What symptoms are you experiencing?
      </label>
      <textarea
        id="symptoms-textarea"
        value={currentSymptoms}
        onChange={(e) => setCurrentSymptoms(e.target.value)}
        placeholder="e.g., I have a bad headache, a persistent cough, and a fever of 101°F. My throat also feels sore."
        rows="6"
        disabled={isLoading}
      ></textarea>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Checking Symptoms...' : 'Check Symptoms'}
      </button>
      {isLoading && <div className="spinner"></div>} {/* Basic loading spinner */}
    </form>
  );
}

export default SymptomInput;