import React, { useState } from "react";
import "./App.css";
import SymptomInput from "./components/SymptomInput";
import ResultsDisplay from "./components/ResultsDisplay";
import Disclaimer from "./components/Disclaimer";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckSymptoms = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/check-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });
      

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Medichat Symptom Checker</h1>
      <p className="app-subtitle">
        Describe your symptoms naturally, and we'll suggest potential conditions.
      </p>

      <SymptomInput
        symptoms={symptoms}
        setSymptoms={setSymptoms}
        onCheck={handleCheckSymptoms}
      />

      {loading ? (
        <div className="processing">
          <span className="ai-icon">🤖</span> Processing with NLP...
        </div>
      ) : (
        <ResultsDisplay results={results} />
      )}

      <Disclaimer />
    </div>
  );
}

export default App;
