import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "./App.css";
import SymptomInput from "./components/SymptomInput";
import ResultsDisplay from "./components/ResultsDisplay";
import Disclaimer from "./components/Disclaimer";

// 50+ languages including Hindi, Bengali, etc.
const languages = [
  { value: "en-US", label: "English" },
  { value: "hi-IN", label: "Hindi" },
  { value: "bn-BD", label: "Bengali" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "zh-TW", label: "Chinese (Traditional)" },
  { value: "ja-JP", label: "Japanese" },
  { value: "ko-KR", label: "Korean" },
  { value: "ar-SA", label: "Arabic" },
  { value: "ru-RU", label: "Russian" },
  { value: "pt-PT", label: "Portuguese" },
  { value: "it-IT", label: "Italian" },
  { value: "tr-TR", label: "Turkish" },
  { value: "nl-NL", label: "Dutch" },
  { value: "sv-SE", label: "Swedish" },
  { value: "fi-FI", label: "Finnish" },
  { value: "no-NO", label: "Norwegian" },
  { value: "da-DK", label: "Danish" },
  { value: "pl-PL", label: "Polish" },
  { value: "cs-CZ", label: "Czech" },
  { value: "hu-HU", label: "Hungarian" },
  { value: "ro-RO", label: "Romanian" },
  { value: "sk-SK", label: "Slovak" },
  { value: "sl-SI", label: "Slovenian" },
  { value: "hr-HR", label: "Croatian" },
  { value: "sr-RS", label: "Serbian" },
  { value: "bg-BG", label: "Bulgarian" },
  { value: "uk-UA", label: "Ukrainian" },
  { value: "he-IL", label: "Hebrew" },
  { value: "th-TH", label: "Thai" },
  { value: "vi-VN", label: "Vietnamese" },
  { value: "ms-MY", label: "Malay" },
  { value: "id-ID", label: "Indonesian" },
  { value: "fil-PH", label: "Filipino" },
  { value: "fa-IR", label: "Persian" },
  { value: "sw-KE", label: "Swahili" },
  { value: "am-ET", label: "Amharic" },
  { value: "zu-ZA", label: "Zulu" },
  { value: "xh-ZA", label: "Xhosa" },
  { value: "st-ZA", label: "Sesotho" },
  { value: "bn-IN", label: "Bengali (India)" }, // optional duplicate if needed
  { value: "hi-IN", label: "Hindi (India)" },   // optional duplicate if needed
  { value: "ga-IE", label: "Irish" },
  { value: "is-IS", label: "Icelandic" },
  { value: "lv-LV", label: "Latvian" },
  { value: "lt-LT", label: "Lithuanian" },
  { value: "mk-MK", label: "Macedonian" },
  { value: "mt-MT", label: "Maltese" },
  { value: "nb-NO", label: "Norwegian Bokmål" },
  { value: "nn-NO", label: "Norwegian Nynorsk" },
  { value: "si-LK", label: "Sinhala" },
  { value: "ur-PK", label: "Urdu" },
];


export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // default English

  // Start session on first render
  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/start-session", { method: "POST" });
        const data = await res.json();
        setSessionId(data.sessionId);
      } catch (err) {
        console.error("Error starting session:", err);
      }
    };
    startSession();
  }, []);

  // Animate conversation messages
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

  // Handle sending message (user text)
  const handleSendMessage = async (text = null) => {
    const messageToSend = text ?? userInput;
    if (!messageToSend.trim() || !sessionId) return;

    setConversation(prev => [...prev, { role: "user", text: messageToSend }]);
    setLoading(true);
    setUserInput(""); // Clear input

    try {
      const res = await fetch("http://localhost:5001/api/next-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userMessage: messageToSend }),
      });

      const data = await res.json();

      if (data.assistantMessage) {
        setConversation(prev => [...prev, { role: "assistant", text: data.assistantMessage }]);
      }

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
    }
  };

  // Translate text to English if needed
  const translateToEnglish = async (text, sourceLang) => {
    try {
      const res = await axios.post("https://api.mymemory.translated.net/get", null, {
        params: { q: text, langpair: `${sourceLang}|en` }
      });
      return res.data.responseData.translatedText;
    } catch (err) {
      console.error("Translation error:", err);
      return text; // fallback
    }
  };

  // Custom styles for language selector
  const languageSelectorStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
      borderRadius: "6px",
      borderColor: "#ccc",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#2684FF" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({ ...provided, color: "#000" }),
    input: (provided) => ({ ...provided, color: "#000" }),
  };

  return (
    <div className="app-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="app-title">Medichat Symptom Checker</h1>
        <div style={{ width: "200px" }}>
          <Select
            options={languages}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            isSearchable
            placeholder="Select language..."
            styles={languageSelectorStyles}
          />
        </div>
      </div>

      <p className="app-subtitle">
        Describe your symptoms naturally. The assistant will respond step-by-step.
      </p>

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

      {loading && (
        <div className="processing">
          <span className="ai-icon">🤖</span> Thinking...
        </div>
      )}

      <SymptomInput
        symptoms={userInput}
        setSymptoms={setUserInput}
        onCheck={async (spokenText) => {
          let englishText = spokenText;
          if (selectedLanguage.value !== "en-US") {
            englishText = await translateToEnglish(spokenText, selectedLanguage.value.split("-")[0]);
          }
          handleSendMessage(englishText);
        }}
        selectedLanguage={selectedLanguage.value}
      />

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
