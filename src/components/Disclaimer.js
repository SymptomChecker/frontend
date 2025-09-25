// src/components/Disclaimer.js
import React from 'react';
import './Disclaimer.css'; // For component-specific styles

function Disclaimer() {
  return (
    <div className="disclaimer-container">
      <p>
        <strong>Disclaimer:</strong> This tool is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider for any questions you may have regarding a medical condition.
      </p>
    </div>
  );
}

export default Disclaimer;