import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import {
  Zap, Mail, Lock, AlertCircle, ArrowRight,
  BarChart3, Target, Flame
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(formData);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
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
            Welcome<br />
            <span>back, Athlete.</span>
          </h1>
          <p className="auth-subheading">
            Sign in to continue your training regimen and track your progress.
          </p>

          {error && (
            <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  className="auth-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {loading ? "Signing In…" : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="auth-right">
        <div className="auth-right-content">
          <span className="auth-right-kicker">High-Performance Training Suite</span>
          <div style={{
            width: 54, height: 54, borderRadius: 16,
            background: "rgba(61,220,151,0.15)", border: "1px solid rgba(61,220,151,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20
          }}>
            <Zap size={28} style={{ color: "#3ddc97" }} />
          </div>
          <h2>Track. Train. Transform.</h2>
          <p>
            Experience data-driven training with precision analytics, custom workout splits, and automated achievement tracking.
          </p>
          <div className="auth-feature-list">
            <div className="auth-feature">
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(61,220,151,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <BarChart3 size={18} style={{ color: "#3ddc97" }} />
              </div>
              <div className="auth-feature-text">
                <strong>Smart Telemetry</strong>
                <span>Instant volume, burn, and duration metrics</span>
              </div>
            </div>
            <div className="auth-feature">
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(87,183,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Target size={18} style={{ color: "#57b7ff" }} />
              </div>
              <div className="auth-feature-text">
                <strong>Milestone Tracking</strong>
                <span>Set weight, frequency, and strength targets</span>
              </div>
            </div>
            <div className="auth-feature">
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(255,138,61,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Flame size={18} style={{ color: "#ff8a3d" }} />
              </div>
              <div className="auth-feature-text">
                <strong>Streak &amp; Badge Engine</strong>
                <span>Stay accountable with daily consistency chains</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}