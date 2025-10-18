import React, { useState, useEffect } from "react";
import "./App.css";
import SymptomInput from "./components/SymptomInput";
import ResultsDisplay from "./components/ResultsDisplay";
import Disclaimer from "./components/Disclaimer";

export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Start session on first render
  useEffect(() => {
    const startSession = async () => {
      const res = await fetch("http://localhost:5001/api/start-session", { method: "POST" });
      const data = await res.json();
      setSessionId(data.sessionId);
    };
    startSession();
  }, []);

  // Animate conversation messages step by step (append only new messages)
  useEffect(() => {
    if (conversation.length === 0) return;

    let index = displayedMessages.length;
    if (index >= conversation.length) return;

    const interval = setInterval(() => {
      if (index >= conversation.length) {
        clearInterval(interval);
        return;
      }

      const msg = conversation[index];
      if (msg && msg.role && msg.text) {
        setDisplayedMessages((prev) => [...prev, msg]);
      }
      index++;
    }, 400);

    return () => clearInterval(interval);
  }, [conversation, displayedMessages.length]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !sessionId) return;

    // Add user message immediately
    setConversation(prev => [...prev, { role: "user", text: userInput }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/next-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userMessage: userInput }),
      });

      const data = await res.json();

      if (data.assistantMessage) {
        setConversation(prev => [...prev, { role: "assistant", text: data.assistantMessage }]);
      }

      // If conversation is done, prepare results
      if (data.done && data.possible_conditions?.length) {
        const finalResults = data.possible_conditions.map(cond => ({
          condition: cond,
          description: "Derived from dataset conversation",
          confidence: 60 + Math.floor(Math.random() * 30)
        }));
        setResults(finalResults);
      }

    } catch (err) {
      console.error("Error fetching assistant response:", err);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Medichat Symptom Checker</h1>
      <p className="app-subtitle">
        Describe your symptoms naturally. The assistant will respond step-by-step.
      </p>

      {/* Conversation Box */}
      {displayedMessages.length > 0 && (
        <div className="conversation-box">
          {displayedMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.role === "assistant" ? "ai-message" : "user-message"}`}
            >
              {msg.role === "assistant" && <span className="ai-icon">🤖</span>}
              {msg.role === "user" && <span className="user-icon">🧑</span>}
              {msg.text}
            </div>
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="processing">
          <span className="ai-icon">🤖</span> Thinking...
        </div>
      )}

      {/* User Input */}
      <SymptomInput
        symptoms={userInput}
        setSymptoms={setUserInput}
        onCheck={handleSendMessage}
      />

      {/* Results Section */}
      {!loading && results.length > 0 && (
        <div className="results-container-wrapper">
          <div className="results-label">Results:</div>
          <ResultsDisplay results={results} />
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
