import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Bell, Shield, Sliders, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const { user } = useAuth();
  const [notifPreferences, setNotifPreferences] = useState({
    workoutReminders: true,
    hydrationAlerts: true,
    achievementUnlocks: true,
    weeklySummaries: true
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setNotifPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-badge">
            <Sliders size={14} style={{ marginRight: 6 }} /> Preferences
          </div>
          <h1>Account & Settings</h1>
          <p>Customize your training experience, notification preferences, and security settings.</p>
        </div>
      </div>

      {saved && (
        <div className="alert-success" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={18} style={{ marginRight: 8 }} /> Settings saved successfully.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {/* Account Profile Card */}
        <div className="card">
          <div className="card-header-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="stat-icon-box blue"><User size={18} /></div>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Profile Overview</h3>
            </div>
            <Link to="/profile" className="btn btn-secondary btn-sm">Edit Profile</Link>
          </div>

          <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
            <div className="summary-row">
              <span className="summary-label">Name</span>
              <span className="summary-val">{user?.name || "Athlete"}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Email</span>
              <span className="summary-val">{user?.email || "athlete@fittrack.io"}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Primary Goal</span>
              <span className="summary-val badge-meta">{user?.fitnessGoal || "Improve Fitness"}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Bodyweight</span>
              <span className="summary-val">{user?.weight ? `${user.weight} kg` : "Not set"}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Height</span>
              <span className="summary-val">{user?.height ? `${user.height} cm` : "Not set"}</span>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="card">
          <div className="card-header-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="stat-icon-box orange"><Bell size={18} /></div>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Notifications</h3>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {[
              { key: "workoutReminders", label: "Workout Reminders", desc: "Get notified to stay consistent with your schedule." },
              { key: "hydrationAlerts", label: "Hydration Reminders", desc: "Timely alerts to meet your daily water goal." },
              { key: "achievementUnlocks", label: "Milestones & Achievements", desc: "Celebrate unlocks and badge completions." },
              { key: "weeklySummaries", label: "Weekly Progress Report", desc: "Summary of calories, volume, and active minutes." }
            ].map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.desc}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifPreferences[item.key]}
                    onChange={() => handleToggle(item.key)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security Card */}
        <div className="card">
          <div className="card-header-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="stat-icon-box green"><Shield size={18} /></div>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Security & Privacy</h3>
            </div>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "16px 0" }}>
            Your fitness data is private, encrypted, and isolated to your account.
          </p>

          <Link to="/profile" className="btn btn-secondary full-width">
            Change Password in Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
