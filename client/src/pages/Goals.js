import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGoal, createGoal, updateGoal, deleteGoal } from "../services/goalService";
import { getWorkoutStats } from "../services/workoutService";
import {
  Target, Dumbbell, Scale, Flame, Calendar, Clock,
  Edit2, Trash2, Plus, CheckCircle2, AlertCircle,
  TrendingDown, Sparkles, X, ChevronRight
} from "lucide-react";

const INITIAL_FORM = {
  goalType: "Weight Loss",
  currentWeight: "",
  targetWeight: "",
  dailyCalories: "2000",
  weeklyWorkoutTarget: "4",
  targetDate: "",
  notes: "",
};

const GOAL_TYPES = [
  { value: "Weight Loss",     icon: TrendingDown, desc: "Burn fat & get lean", color: "#ff5f6d" },
  { value: "Muscle Gain",     icon: Dumbbell,     desc: "Build strength & size", color: "#ff8a3d" },
  { value: "Maintain Weight", icon: Scale,        desc: "Stay consistent", color: "#57b7ff" },
  { value: "Improve Fitness", icon: Sparkles,     desc: "Cardio & endurance", color: "#3ddc97" },
];

const modalStyles = {
  backdrop: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: 20,
  },
  dialog: {
    background: "var(--bg-card)", border: "1px solid var(--border-card)",
    borderRadius: 24, padding: 32, width: "100%", maxWidth: 540,
    maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
  },
};

export default function Goals() {
  const { user } = useAuth();
  const [goal, setGoal]           = useState(null);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData]   = useState(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gRes, sRes] = await Promise.allSettled([getGoal(), getWorkoutStats()]);
      if (gRes.status === "fulfilled" && gRes.value?.goal) setGoal(gRes.value.goal);
      else setGoal(null);
      if (sRes.status === "fulfilled") setStats(sRes.value);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 4000); };

  const openCreate = () => {
    setIsEditing(false);
    setFormData({ ...INITIAL_FORM, currentWeight: user?.weight || "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = () => {
    if (!goal) return;
    setIsEditing(true);
    setFormData({
      goalType: goal.goalType || "Weight Loss",
      currentWeight: goal.currentWeight ?? "",
      targetWeight: goal.targetWeight ?? "",
      dailyCalories: goal.dailyCalories ?? "2000",
      weeklyWorkoutTarget: goal.weeklyWorkoutTarget ?? "4",
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split("T")[0] : "",
      notes: goal.notes || "",
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setError(""); };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        goalType: formData.goalType,
        currentWeight: Number(formData.currentWeight),
        targetWeight: Number(formData.targetWeight),
        dailyCalories: formData.dailyCalories ? Number(formData.dailyCalories) : undefined,
        weeklyWorkoutTarget: formData.weeklyWorkoutTarget ? Number(formData.weeklyWorkoutTarget) : undefined,
        targetDate: formData.targetDate || undefined,
        notes: formData.notes?.trim() || "",
      };
      const res = isEditing ? await updateGoal(payload) : await createGoal(payload);
      setGoal(res.goal);
      closeModal();
      flash(isEditing ? "Goal updated successfully" : "Goal created successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save goal.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your fitness goal?")) return;
    setSaving(true);
    try {
      await deleteGoal();
      setGoal(null);
      flash("Goal deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete goal.");
    } finally {
      setSaving(false);
    }
  };

  /* Progress maths */
  const weightPct = (() => {
    if (!goal) return 0;
    const s = goal.currentWeight, t = goal.targetWeight, c = user?.weight || s;
    if (s === t) return 100;
    if (s > t) return Math.min(100, Math.max(0, Math.round(((s - c) / (s - t)) * 100)));
    return Math.min(100, Math.max(0, Math.round(((c - s) / (t - s)) * 100)));
  })();

  const daysLeft = goal?.targetDate
    ? Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / 86400000))
    : null;

  const weeklyDone   = stats?.thisWeek?.count ?? 0;
  const weeklyTarget = goal?.weeklyWorkoutTarget ?? 4;
  const weeklyPct    = Math.min(100, Math.round((weeklyDone / weeklyTarget) * 100));

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <div className="loading-text">Loading your fitness targets…</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3ddc97, #57b7ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(61,220,151,0.3)"
            }}>
              <Target size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Target Milestone
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Fitness Targets
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Set ambitious targets, track weekly milestones, and stay accountable.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {goal ? (
            <>
              <button className="btn btn-secondary" onClick={openEdit} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Edit2 size={15} /> Edit Target
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Trash2 size={15} /> Delete
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Plus size={16} /> Set New Goal
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="alert-success" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}
      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {goal ? (
        <>
          {/* Hero Target Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(20,32,48,0.95), rgba(12,20,32,0.95))",
            border: "1px solid rgba(61,220,151,0.25)",
            borderRadius: 24,
            padding: "28px 32px",
            boxShadow: "0 20px 48px rgba(0,0,0,0.5), 0 0 32px rgba(61,220,151,0.06)",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Top accent light */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, #3ddc97, #57b7ff, #ff8a3d)"
            }} />

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 999,
                  background: "rgba(61,220,151,0.14)", color: "#3ddc97",
                  display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(61,220,151,0.3)"
                }}>
                  <Target size={14} /> {goal.goalType}
                </span>
              </div>
              {daysLeft !== null && (
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 999,
                  background: "rgba(87,183,255,0.12)", color: "#57b7ff",
                  display: "flex", alignItems: "center", gap: 6, border: "1px solid rgba(87,183,255,0.25)"
                }}>
                  <Clock size={14} /> {daysLeft} days remaining
                </span>
              )}
            </div>

            {/* Weight metrics track */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr",
              alignItems: "center", gap: 12, marginBottom: 26
            }}>
              <div style={{ background: "var(--bg-subtle)", borderRadius: 16, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
                  Start Weight
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)" }}>
                  {goal.currentWeight} <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>kg</span>
                </div>
              </div>

              <ChevronRight size={22} style={{ color: "var(--text-muted)" }} />

              <div style={{
                background: "rgba(255,138,61,0.1)", border: "1px solid rgba(255,138,61,0.3)",
                borderRadius: 16, padding: "16px 20px", textAlign: "center"
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#ff8a3d", textTransform: "uppercase", marginBottom: 4 }}>
                  Current
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#ff8a3d" }}>
                  {user?.weight || goal.currentWeight} <span style={{ fontSize: 14, color: "#ff8a3d", opacity: 0.8, fontWeight: 600 }}>kg</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {user?.weight ? `${(user.weight - goal.currentWeight).toFixed(1)} kg from start` : "Profile weight"}
                </div>
              </div>

              <ChevronRight size={22} style={{ color: "var(--text-muted)" }} />

              <div style={{
                background: "rgba(61,220,151,0.1)", border: "1px solid rgba(61,220,151,0.3)",
                borderRadius: 16, padding: "16px 20px", textAlign: "center"
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#3ddc97", textTransform: "uppercase", marginBottom: 4 }}>
                  Target Weight
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#3ddc97" }}>
                  {goal.targetWeight} <span style={{ fontSize: 14, color: "#3ddc97", opacity: 0.8, fontWeight: 600 }}>kg</span>
                </div>
              </div>
            </div>

            {/* Big Progress bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>
                  Milestone Completion
                </span>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#3ddc97" }}>
                  {weightPct}%
                </span>
              </div>
              <div style={{ height: 10, background: "var(--bg-subtle)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${weightPct}%`, borderRadius: 5,
                  background: "linear-gradient(90deg, #3ddc97, #57b7ff)",
                  transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                }} />
              </div>
            </div>

            {goal.notes && (
              <div style={{
                marginTop: 20, padding: "12px 16px", borderRadius: 12,
                background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
                fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5
              }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Notes: </span>
                {goal.notes}
              </div>
            )}
          </div>

          {/* Sub-target Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Weekly workouts */}
            <div className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #3ddc97, transparent)", position: "absolute", top: 0, left: 0, right: 0 }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(61,220,151,0.12)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Dumbbell size={20} style={{ color: "#3ddc97" }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Weekly Workouts</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>This week's frequency</div>
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "var(--text-primary)", marginBottom: 12 }}>
                {weeklyDone}
                <span style={{ fontSize: 18, color: "var(--text-muted)", fontWeight: 600 }}> / {weeklyTarget}</span>
              </div>
              <div style={{ height: 6, background: "var(--bg-subtle)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", background: "#3ddc97", width: `${weeklyPct}%`, borderRadius: 3, transition: "width 0.6s ease" }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{weeklyPct}% of weekly target</div>
            </div>

            {/* Daily calories */}
            <div className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #ff8a3d, transparent)", position: "absolute", top: 0, left: 0, right: 0 }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(255,138,61,0.12)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Flame size={20} style={{ color: "#ff8a3d" }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Daily Calories</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Energy expenditure target</div>
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#ff8a3d", marginBottom: 12 }}>
                {goal.dailyCalories?.toLocaleString() || "2,000"}
                <span style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 600 }}> kcal</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Sync with nutrition tracking for accurate daily calorie control.
              </div>
            </div>

            {/* Target date */}
            <div className="card" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #57b7ff, transparent)", position: "absolute", top: 0, left: 0, right: 0 }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(87,183,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Calendar size={20} style={{ color: "#57b7ff" }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>Target Date</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Target completion milestone</div>
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#57b7ff", marginBottom: 8 }}>
                {goal.targetDate
                  ? new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Flexible"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {daysLeft !== null ? `${daysLeft} days remaining` : "No strict deadline set"}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state" style={{ padding: "80px 20px" }}>
          <Target size={52} style={{ color: "var(--text-muted)", marginBottom: 16 }} />
          <h3>No Active Fitness Goal</h3>
          <p style={{ maxWidth: 460, margin: "0 auto 20px" }}>
            Set clear targets — weight goals, weekly workout volume, and a target date — to stay focused and track progress automatically.
          </p>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Plus size={16} /> Set Your First Goal
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={modalStyles.backdrop} onClick={closeModal}>
          <div style={modalStyles.dialog} onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10 }}>
                <Target size={20} style={{ color: "#3ddc97" }} />
                {isEditing ? "Edit Goal" : "Set New Goal"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", padding: 4
                }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Goal type selector */}
              <div className="form-group">
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Goal Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                  {GOAL_TYPES.map((gt) => {
                    const GtIcon = gt.icon;
                    const isSelected = formData.goalType === gt.value;
                    return (
                      <label
                        key={gt.value}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 14px", borderRadius: 14,
                          background: isSelected ? "rgba(61,220,151,0.1)" : "var(--bg-subtle)",
                          border: `1px solid ${isSelected ? "#3ddc97" : "var(--border-subtle)"}`,
                          cursor: "pointer", transition: "all 0.15s"
                        }}
                      >
                        <input
                          type="radio" name="goalType" value={gt.value}
                          checked={isSelected} onChange={handleChange}
                          style={{ display: "none" }}
                        />
                        <GtIcon size={20} style={{ color: isSelected ? "#3ddc97" : gt.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? "#3ddc97" : "var(--text-primary)" }}>
                            {gt.value}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{gt.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="form-row" style={{ marginTop: 16 }}>
                <div className="form-group">
                  <label htmlFor="currentWeight">Start Weight (kg) *</label>
                  <input id="currentWeight" className="form-control" type="number" step="0.1"
                    name="currentWeight" value={formData.currentWeight} onChange={handleChange}
                    placeholder="e.g. 80" required />
                </div>
                <div className="form-group">
                  <label htmlFor="targetWeight">Target Weight (kg) *</label>
                  <input id="targetWeight" className="form-control" type="number" step="0.1"
                    name="targetWeight" value={formData.targetWeight} onChange={handleChange}
                    placeholder="e.g. 72" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dailyCalories">Daily Calorie Target</label>
                  <input id="dailyCalories" className="form-control" type="number"
                    name="dailyCalories" value={formData.dailyCalories} onChange={handleChange}
                    placeholder="e.g. 2200" />
                </div>
                <div className="form-group">
                  <label htmlFor="weeklyWorkoutTarget">Weekly Workouts</label>
                  <input id="weeklyWorkoutTarget" className="form-control" type="number"
                    min="1" max="14" name="weeklyWorkoutTarget"
                    value={formData.weeklyWorkoutTarget} onChange={handleChange} placeholder="e.g. 4" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="targetDate">Target Completion Date</label>
                <input id="targetDate" className="form-control" type="date"
                  name="targetDate" value={formData.targetDate} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Motivation &amp; Strategy Notes</label>
                <textarea id="notes" className="form-control" name="notes"
                  value={formData.notes} onChange={handleChange} rows={3}
                  placeholder="Why is this goal important? What is your training plan?" style={{ resize: "vertical" }} />
              </div>

              <div className="form-actions" style={{ marginTop: 20 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : isEditing ? "Update Goal" : "Save Goal"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}