import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import {
  Zap, Mail, Lock, User, AlertCircle, ArrowRight,
  Dumbbell, TrendingUp, Trophy
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(formData);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left — Form */}
      <div className="auth-left">
        <div className="auth-left-content fade-in">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Zap size={22} style={{ color: "#08131d" }} />
            </div>
            <span className="auth-brand-name">Fit<span>Track</span> Pro</span>
          </div>

          <h1 className="auth-heading">
            Start your<br />
            <span>fitness journey.</span>
          </h1>
          <p className="auth-subheading">
            Create your athlete profile in seconds and unlock intelligent performance tracking.
          </p>

          {error && (
            <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="reg-name">Full Name</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <User size={16} />
                </span>
                <input
                  id="reg-name"
                  className="auth-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email Address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  id="reg-email"
                  className="auth-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="athlete@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  id="reg-password"
                  className="auth-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password (6+ chars)"
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {loading ? "Creating Account…" : (
                <>
                  Create Free Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="auth-right">
        <div className="auth-right-content">
          <span className="auth-right-kicker">Built For Athletes &amp; Lifters</span>
          <div style={{
            width: 54, height: 54, borderRadius: 16,
            background: "rgba(87,183,255,0.15)", border: "1px solid rgba(87,183,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20
          }}>
            <Dumbbell size={28} style={{ color: "#57b7ff" }} />
          </div>
          <h2>Your body.<br />Your data.<br />Your gains.</h2>
          <p>
            Everything you need to build discipline, track progress metrics, and reach peak conditioning.
          </p>
          <div className="auth-feature-list">
            <div className="auth-feature">
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(61,220,151,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Dumbbell size={18} style={{ color: "#3ddc97" }} />
              </div>
              <div className="auth-feature-text">
                <strong>Intelligent Logging</strong>
                <span>Log workouts with sets, reps, weight &amp; RPE</span>
              </div>
            </div>
            <div className="auth-feature">
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(87,183,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <TrendingUp size={18} style={{ color: "#57b7ff" }} />
              </div>
              <div className="auth-feature-text">
                <strong>Bodyweight &amp; BMI Trends</strong>
                <span>Track visual progression and body composition</span>
              </div>
            </div>
            <div className="auth-feature">
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(159,140,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Trophy size={18} style={{ color: "#9f8cff" }} />
              </div>
              <div className="auth-feature-text">
                <strong>Badges &amp; Challenges</strong>
                <span>Compete in community challenges and unlock tiers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}