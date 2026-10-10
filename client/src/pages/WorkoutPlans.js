import React, { useEffect, useState } from "react";
import { getWorkoutPlans, createWorkoutPlan, deleteWorkoutPlan, activateWorkoutPlan } from "../services/workoutPlanService";
import {
  Calendar, CheckCircle2, Trash2, Play, Plus, AlertCircle
} from "lucide-react";

const defaultPlan = {
  name: "",
  description: "",
  goal: "Improve Fitness",
  difficulty: "Beginner",
  days: [
    { dayName: "Monday", exercises: [] },
    { dayName: "Wednesday", exercises: [] },
    { dayName: "Friday", exercises: [] },
  ],
  active: false,
};

const DIFFICULTY_COLORS = {
  Beginner:     { color: "#3ddc97", bg: "rgba(61,220,151,0.12)" },
  Intermediate: { color: "#57b7ff", bg: "rgba(87,183,255,0.12)" },
  Advanced:     { color: "#ff8a3d", bg: "rgba(255,138,61,0.14)" },
};

export default function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(defaultPlan);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await getWorkoutPlans();
      setPlans(data.plans || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workout plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createWorkoutPlan(form);
      setForm(defaultPlan);
      setSuccess("Workout plan created successfully!");
      loadPlans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create workout plan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout plan?")) return;
    try {
      await deleteWorkoutPlan(id);
      setSuccess("Workout plan deleted.");
      loadPlans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete workout plan");
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateWorkoutPlan(id);
      setSuccess("Active plan updated successfully!");
      loadPlans();
    } catch (err) {
      setError(err.response?.data?.message || "Could not activate the plan");
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #ff8a3d, #ff5f6d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(255,138,61,0.3)"
            }}>
              <Calendar size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Training Regimen
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Workout Programs
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Design structured multi-day schedules for progressive overload and consistency.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <CheckCircle2 size={16} /> {success}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 24, alignItems: "start" }}>
        {/* Create Plan Form */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(61,220,151,0.12)", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Plus size={18} style={{ color: "#3ddc97" }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Create New Plan</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Configure your weekly routine</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Plan Name</label>
              <input
                className="form-control"
                placeholder="e.g. 3-Day Hypertrophy Split"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Target outcomes, schedule intensity, rest periods…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Goal</label>
                <select className="form-control" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                  <option value="Improve Fitness">Improve Fitness</option>
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select className="form-control" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Weekly Schedule Days
              </label>
              <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
                {form.days.map((day) => (
                  <div
                    key={day.dayName}
                    style={{
                      background: "var(--bg-subtle)", borderRadius: 12, padding: "10px 14px",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{day.dayName}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                      {day.exercises.length > 0 ? `${day.exercises.length} exercises` : "Active Training"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary full-width" type="submit" disabled={saving} style={{ marginTop: 12 }}>
              {saving ? "Creating Plan…" : "Create Program"}
            </button>
          </form>
        </div>

        {/* Existing Plans */}
        <div>
          {loading ? (
            <div className="loading-overlay">
              <div className="spinner" />
              <div className="loading-text">Loading workout plans…</div>
            </div>
          ) : plans.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
              <h3>No workout plans yet</h3>
              <p>Create your first structured training plan to get started.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {plans.map((plan) => {
                const diff = DIFFICULTY_COLORS[plan.difficulty] || DIFFICULTY_COLORS.Beginner;
                return (
                  <div
                    key={plan._id}
                    className="card"
                    style={{
                      border: plan.active ? "1px solid rgba(61,220,151,0.4)" : "1px solid var(--border-card)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {plan.active && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 3,
                        background: "linear-gradient(90deg, #3ddc97, #57b7ff)"
                      }} />
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                            {plan.name}
                          </h3>
                          {plan.active ? (
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                              background: "rgba(61,220,151,0.12)", color: "#3ddc97",
                              border: "1px solid rgba(61,220,151,0.3)", display: "flex", alignItems: "center", gap: 4
                            }}>
                              <CheckCircle2 size={10} /> Active
                            </span>
                          ) : (
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                              background: "var(--bg-subtle)", color: "var(--text-muted)"
                            }}>
                              Draft
                            </span>
                          )}
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>
                          {plan.description || "No description provided."}
                        </p>
                      </div>

                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
                        background: diff.bg, color: diff.color, flexShrink: 0
                      }}>
                        {plan.difficulty?.toUpperCase()}
                      </span>
                    </div>

                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8, margin: "14px 0"
                    }}>
                      <div style={{ background: "var(--bg-subtle)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>{plan.goal}</div>
                        <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>GOAL</div>
                      </div>
                      <div style={{ background: "var(--bg-subtle)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: diff.color }}>{plan.difficulty}</div>
                        <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>LEVEL</div>
                      </div>
                      <div style={{ background: "var(--bg-subtle)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#57b7ff" }}>{plan.days?.length || 0} Days</div>
                        <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>SCHEDULE</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                      {!plan.active && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleActivate(plan._id)}
                          style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <Play size={13} /> Activate
                        </button>
                      )}
                      {!plan.isSystem && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(plan._id)}
                          style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
