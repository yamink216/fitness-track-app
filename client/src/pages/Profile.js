import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUserProfile, updateProfile, changePassword } from "../services/authService";
import {
  User, Mail, Ruler, Scale, Target,
  CheckCircle2, AlertCircle, KeyRound, Activity
} from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [profileSaving, setProfileSaving]   = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMsg, setProfileMsg]         = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg]       = useState({ type: "", text: "" });

  const [profileForm, setProfileForm] = useState({
    name: "", email: "", age: "", gender: "Male",
    height: "", weight: "", fitnessGoal: "Weight Loss",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentUserProfile();
        const u = res.user || res;
        updateUser(u);
        setProfileForm({
          name: u.name || "", email: u.email || "",
          age: u.age ?? "", gender: u.gender || "Male",
          height: u.height ?? "", weight: u.weight ?? "",
          fitnessGoal: u.fitnessGoal || "Weight Loss",
        });
      } catch {}
    })();
    // eslint-disable-next-line
  }, []);

  const handleProfileChange  = (e) => setProfileForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswordForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const flashProfile  = (type, text) => { setProfileMsg({ type, text }); setTimeout(() => setProfileMsg({ type: "", text: "" }), 5000); };
  const flashPassword = (type, text) => { setPasswordMsg({ type, text }); setTimeout(() => setPasswordMsg({ type: "", text: "" }), 5000); };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ type: "", text: "" });
    try {
      const res = await updateProfile({
        name: profileForm.name, age: profileForm.age, gender: profileForm.gender,
        height: profileForm.height, weight: profileForm.weight, fitnessGoal: profileForm.fitnessGoal,
      });
      const u = res.user || res;
      updateUser(u);
      flashProfile("success", "Profile updated successfully!");
    } catch (err) {
      flashProfile("error", err.response?.data?.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return flashPassword("error", "New passwords do not match.");
    }
    if (passwordForm.newPassword.length < 6) {
      return flashPassword("error", "Password must be at least 6 characters.");
    }
    setPasswordSaving(true);
    setPasswordMsg({ type: "", text: "" });
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      flashPassword("success", "Password updated successfully!");
    } catch (err) {
      flashPassword("error", err.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const BMI = (() => {
    if (!profileForm.height || !profileForm.weight) return null;
    const h = Number(profileForm.height) / 100;
    const bmi = (Number(profileForm.weight) / (h * h)).toFixed(1);
    let label = "Normal";
    let color = "#3ddc97";
    if (bmi < 18.5) { label = "Underweight"; color = "#57b7ff"; }
    else if (bmi >= 25 && bmi < 30) { label = "Overweight"; color = "#ff8a3d"; }
    else if (bmi >= 30) { label = "Obese"; color = "#ff5f6d"; }
    return { value: bmi, label, color };
  })();

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #57b7ff, #9f8cff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(87,183,255,0.3)"
            }}>
              <User size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Account Settings
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Athlete Profile
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Manage your personal metrics, body measurements, and security credentials.
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(20,32,48,0.9), rgba(12,20,32,0.9))",
        border: "1px solid var(--border-card)",
        borderRadius: 24,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        marginBottom: 24,
        flexWrap: "wrap",
        boxShadow: "0 20px 48px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg, #3ddc97, #57b7ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, fontWeight: 900, color: "#08131d",
          boxShadow: "0 0 24px rgba(61,220,151,0.3)"
        }}>
          {getInitials(profileForm.name || user?.name)}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)" }}>
            {profileForm.name || user?.name || "Athlete"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={13} /> {profileForm.email || user?.email}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {profileForm.fitnessGoal && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                background: "rgba(61,220,151,0.12)", color: "#3ddc97",
                display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(61,220,151,0.25)"
              }}>
                <Target size={12} /> {profileForm.fitnessGoal}
              </span>
            )}
            {profileForm.weight && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                background: "rgba(255,138,61,0.12)", color: "#ff8a3d",
                display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(255,138,61,0.25)"
              }}>
                <Scale size={12} /> {profileForm.weight} kg
              </span>
            )}
            {profileForm.height && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                background: "rgba(87,183,255,0.12)", color: "#57b7ff",
                display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid rgba(87,183,255,0.25)"
              }}>
                <Ruler size={12} /> {profileForm.height} cm
              </span>
            )}
            {BMI && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                background: `${BMI.color}18`, color: BMI.color,
                display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${BMI.color}40`
              }}>
                <Activity size={12} /> BMI {BMI.value} ({BMI.label})
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Personal Details Form */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(61,220,151,0.12)", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <User size={18} style={{ color: "#3ddc97" }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Personal Details</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Update your biometric profile</div>
            </div>
          </div>

          {profileMsg.text && (
            <div className={profileMsg.type === "success" ? "alert-success" : "alert-error"} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              {profileMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" className="form-control" type="text" name="name"
                value={profileForm.name} onChange={handleProfileChange}
                placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" className="form-control profile-disabled-field" type="email"
                value={profileForm.email} readOnly disabled style={{ opacity: 0.6 }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input id="age" className="form-control" type="number" name="age"
                  value={profileForm.age} onChange={handleProfileChange}
                  placeholder="e.g. 28" min="10" max="100" />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" className="form-control" name="gender"
                  value={profileForm.gender} onChange={handleProfileChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input id="height" className="form-control" type="number" name="height"
                  value={profileForm.height} onChange={handleProfileChange}
                  placeholder="e.g. 175" min="100" max="250" />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input id="weight" className="form-control" type="number" step="0.1" name="weight"
                  value={profileForm.weight} onChange={handleProfileChange}
                  placeholder="e.g. 75.5" min="30" max="300" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="fitnessGoal">Primary Fitness Goal</label>
              <select id="fitnessGoal" className="form-control" name="fitnessGoal"
                value={profileForm.fitnessGoal} onChange={handleProfileChange}>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Improve Fitness">Improve Fitness</option>
                <option value="Flexibility">Flexibility &amp; Mobility</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary full-width" disabled={profileSaving} style={{ marginTop: 8 }}>
              {profileSaving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Right column */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* BMI Card */}
          {BMI && (
            <div className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${BMI.color}, transparent)`, position: "absolute", top: 0, left: 0, right: 0 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${BMI.color}18`, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Activity size={18} style={{ color: BMI.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Body Mass Index</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Calculated health metric</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 18,
                  background: `${BMI.color}18`, border: `1px solid ${BMI.color}40`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: BMI.color, lineHeight: 1 }}>{BMI.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, marginTop: 2 }}>BMI</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: BMI.color }}>{BMI.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    Based on {profileForm.height} cm and {profileForm.weight} kg
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {[
                  { range: "< 18.5", label: "Under", color: "#57b7ff" },
                  { range: "18.5–24.9", label: "Normal", color: "#3ddc97" },
                  { range: "25–29.9", label: "Over", color: "#ff8a3d" },
                  { range: "≥ 30", label: "Obese", color: "#ff5f6d" },
                ].map(item => (
                  <div key={item.label} style={{
                    background: "var(--bg-subtle)", borderRadius: 8, padding: "8px 6px",
                    textAlign: "center", border: item.label === BMI.label ? `1px solid ${item.color}` : "1px solid transparent"
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{item.range}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Change Password */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(87,183,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <KeyRound size={18} style={{ color: "#57b7ff" }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Change Password</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Update security credentials</div>
              </div>
            </div>

            {passwordMsg.text && (
              <div className={passwordMsg.type === "success" ? "alert-success" : "alert-error"} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                {passwordMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input id="currentPassword" className="form-control" type="password"
                  name="currentPassword" value={passwordForm.currentPassword}
                  onChange={handlePasswordChange} placeholder="Enter current password" required />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input id="newPassword" className="form-control" type="password"
                  name="newPassword" value={passwordForm.newPassword}
                  onChange={handlePasswordChange} placeholder="Minimum 6 characters"
                  required minLength={6} />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input id="confirmPassword" className="form-control" type="password"
                  name="confirmPassword" value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange} placeholder="Repeat new password"
                  required minLength={6} />
              </div>

              <button type="submit" className="btn btn-secondary full-width" disabled={passwordSaving} style={{ marginTop: 8 }}>
                {passwordSaving ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}