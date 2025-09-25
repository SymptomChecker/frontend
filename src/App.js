// src/App.js
import React, { useState } from 'react';
import SymptomInput from './components/SymptomInput';
import ResultsDisplay from './components/ResultsDisplay';
import Disclaimer from './components/Disclaimer';
import './App.css'; // We'll add some basic styles here later

function App() {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [results, setResults] = useState(null); // Will store the array of potential conditions
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitSymptoms = async (symptomText) => {
    setSymptomsInput(symptomText);
    setIsLoading(true);
    setError(null); // Clear previous errors
    setResults(null); // Clear previous results

    try {
      // --- This is where you'd call your backend API ---
      const response = await fetch('/api/check-symptoms', { // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptomText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.conditions); // Assuming your backend returns { conditions: [...] }
    } catch (err) {
      console.error("Error fetching symptom results:", err);
      setError("Failed to get results. Please try again.");
      setResults([]); // Set to empty array to show no results on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>AI Symptom Checker</h1>
      <p className="app-tagline">Describe your symptoms naturally, and we'll suggest potential conditions.</p>

      <SymptomInput
        onSubmit={handleSubmitSymptoms}
        isLoading={isLoading}
      />

      {isLoading && <p className="loading-message">Processing your symptoms with AI...</p>}
      {error && <p className="error-message">{error}</p>}

      {results && results.length > 0 && (
        <ResultsDisplay results={results} />
      )}
      {results && results.length === 0 && !isLoading && !error && (
        <p className="no-results-message">No potential conditions found based on your description. Please try being more specific or consult a doctor.</p>
      )}

      <Disclaimer />
    </div>
  );
}

export default App;