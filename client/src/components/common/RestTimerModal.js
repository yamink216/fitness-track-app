import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, X, Clock } from "lucide-react";

export default function RestTimerModal({ isOpen, onClose, initialSeconds = 60 }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setTotalSeconds(initialSeconds);
    if (isOpen) setIsActive(true);
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      // Play a gentle beep if audio is available
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  if (!isOpen) return null;

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 100;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const setPreset = (s) => {
    setTotalSeconds(s);
    setSecondsLeft(s);
    setIsActive(true);
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="timer-modal-card">
        <div className="timer-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={20} style={{ color: "var(--accent-primary)" }} />
            <span style={{ fontWeight: 800, fontSize: 18 }}>Rest Timer</span>
          </div>
          <button className="icon-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="timer-display-circle">
          <svg className="timer-svg" viewBox="0 0 100 100">
            <circle className="timer-svg-bg" cx="50" cy="50" r="44" />
            <circle
              className="timer-svg-progress"
              cx="50"
              cy="50"
              r="44"
              style={{
                strokeDasharray: 276.46,
                strokeDashoffset: 276.46 - (276.46 * progress) / 100,
              }}
            />
          </svg>
          <div className="timer-time-text">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="timer-status-text">
            {secondsLeft === 0 ? "Ready for next set!" : isActive ? "Resting…" : "Paused"}
          </div>
        </div>

        <div className="timer-presets">
          {[30, 45, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              className={`preset-btn ${totalSeconds === sec ? "active" : ""}`}
              onClick={() => setPreset(sec)}
            >
              {sec}s
            </button>
          ))}
        </div>

        <div className="timer-controls">
          <button className="btn btn-secondary" onClick={() => { setSecondsLeft(totalSeconds); setIsActive(false); }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button
            className={`btn ${isActive ? "btn-warning" : "btn-primary"}`}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? "Pause" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
