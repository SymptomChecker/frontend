import React, { useState, useRef } from "react";
import "./SymptomInput.css";

function SymptomInput({ symptoms, setSymptoms, onCheck, selectedLanguage }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimer = useRef(null);
  const finalTranscript = useRef("");

  const playBeep = (frequency = 800, duration = 200) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.start();
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration / 1000);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage || "en-US";

    finalTranscript.current = "";
    setIsListening(true);
    playBeep(900, 180);

    if (silenceTimer.current) clearTimeout(silenceTimer.current);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      finalTranscript.current += " " + transcript;
      setSymptoms(finalTranscript.current.trim());

      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        if (recognitionRef.current) recognitionRef.current.stop();
      }, 3000);
    };

    recognition.onend = () => {
      setIsListening(false);
      playBeep(400, 180);
      const finalText = finalTranscript.current.trim();
      if (finalText.length > 0) onCheck(finalText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  };

  const handleCheckClick = () => {
    const textToSend = isListening
      ? finalTranscript.current.trim()
      : symptoms.trim();

    if (!textToSend) return;
    onCheck(textToSend);
    setSymptoms("");        // Clear textarea after sending
    finalTranscript.current = ""; // Reset voice transcript
  };

  return (
    <div className="symptom-input-container">
      <div className="textarea-wrapper">
        <textarea
          className="symptom-textarea"
          placeholder="e.g., I have a bad cough, sore throat, and I'm very tired."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleCheckClick();
            }
          }}
        />
        <div
          className={`mic-icon ${isListening ? "listening" : ""}`}
          onClick={handleVoiceInput}
          title={isListening ? "Listening..." : "Speak"}
        >
          {isListening ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{ fill: "#ff0000", animation: "pulse 1s infinite" }}
            >
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 18h2v3h-2v-3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 18h2v3h-2v-3z" />
            </svg>
          )}
        </div>
      </div>

      <button className="check-btn" onClick={handleCheckClick}>
        Check Symptoms
      </button>
    </div>
  );
}

export default SymptomInput;
