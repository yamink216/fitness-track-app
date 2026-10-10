import React, { useEffect, useState } from "react";
import { getWeightSummary, addWeightLog, getWeightLogs } from "../services/weightService";
import { TrendingUp, TrendingDown, Activity, BarChart2 } from "lucide-react";

function MiniSparkline({ logs }) {
  if (!logs || logs.length < 2) return null;
  const weights = logs.slice(-12).map(l => l.weight);
  const min = Math.min(...weights) - 1;
  const max = Math.max(...weights) + 1;
  const range = max - min || 1;
  const W = 220, H = 60;

  const pts = weights.map((w, i) => {
    const x = (i / (weights.length - 1)) * W;
    const y = H - ((w - min) / range) * H;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ddc97" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3ddc97" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0,${H} L` + pts.split(" ").join(" L") + ` L${W},${H} Z`}
        fill="url(#weightGrad)" />
      <polyline
        points={pts}
        fill="none"
        stroke="#3ddc97"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {weights.map((w, i) => {
        const x = (i / (weights.length - 1)) * W;
        const y = H - ((w - min) / range) * H;
        return i === weights.length - 1 ? (
          <circle key={i} cx={x} cy={y} r={4} fill="#3ddc97" />
        ) : null;
      })}
    </svg>
  );
}

export default function Progress() {
  const [summary, setSummary] = useState({ currentWeight: 0, startingWeight: 0, targetWeight: 0, difference: 0, logs: [] });
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, logData] = await Promise.all([getWeightSummary(), getWeightLogs()]);
      setSummary({ ...summaryData, logs: logData.logs || [] });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load weight progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await addWeightLog({ weight, date, notes });
      setWeight("");
      setNotes("");
      setSuccess("Weight entry logged successfully!");
      setTimeout(() => setSuccess(""), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log weight");
    } finally {
      setSaving(false);
    }
  };

  const diff = Number(summary.difference || 0);
  const isLoss = diff < 0;
  const isGain = diff > 0;
  const bmiCategory = summary.bmi < 18.5 ? "Underweight" : summary.bmi < 25 ? "Normal" : summary.bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = summary.bmi < 18.5 ? "#57b7ff" : summary.bmi < 25 ? "#3ddc97" : summary.bmi < 30 ? "#ff8a3d" : "#ff5f6d";

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3ddc97, #57b7ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(61,220,151,0.3)"
            }}>
              <TrendingUp size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Body Metrics
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Weight & Progress
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Track body measurements and monitor your transformation trends.
          </p>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="alert-success" style={{ marginBottom: 16 }}>{success}</div>}

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading progress data…</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
            <div className="stat-card green">
              <div className="stat-icon-box green">
                <Activity size={20} />
              </div>
              <div className="stat-label">Current Weight</div>
              <div className="stat-value">{summary.currentWeight || 0}<span className="unit"> kg</span></div>
              <div className="stat-change up">Latest reading</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon-box blue">
                <TrendingDown size={20} />
              </div>
              <div className="stat-label">Starting Weight</div>
              <div className="stat-value">{summary.startingWeight || 0}<span className="unit"> kg</span></div>
              <div className="stat-change">Baseline</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon-box orange">
                {isLoss ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
              </div>
              <div className="stat-label">Total Change</div>
              <div className="stat-value" style={{ color: isLoss ? "#3ddc97" : isGain ? "#ff8a3d" : "var(--text-primary)" }}>
                {isLoss ? "" : "+"}{Number(diff).toFixed(1)}<span className="unit"> kg</span>
              </div>
              <div className={`stat-change ${isLoss ? "up" : "warn"}`}>
                {isLoss ? "Lost" : isGain ? "Gained" : "No change"}
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon-box purple">
                <BarChart2 size={20} />
              </div>
              <div className="stat-label">BMI</div>
              <div className="stat-value" style={{ color: bmiColor }}>{summary.bmi || "—"}</div>
              <div className="stat-change" style={{ color: bmiColor }}>{summary.bmi ? bmiCategory : "Log weight to calc"}</div>
            </div>
          </div>

          {/* Chart + Form + History */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
            {/* Left: Log form + Chart */}
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              {/* Sparkline card */}
              {summary.logs.length >= 2 && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 20, padding: 22 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Weight Trend</div>
                  <MiniSparkline logs={summary.logs} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--text-muted)" }}>
                    <span>Earlier</span>
                    <span>Latest: {summary.currentWeight} kg</span>
                  </div>
                </div>
              )}

              {/* Log form */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 20, padding: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 18 }}>Log Weight</div>
                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Weight (kg)</label>
                    <input
                      className="form-control"
                      type="number"
                      step="0.1"
                      min="20"
                      max="500"
                      placeholder="e.g. 75.5"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Notes (optional)</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="How are you feeling today?"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary full-width" disabled={saving}>
                    {saving ? "Saving…" : "Log Weight Entry"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Weight history */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 20, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 18 }}>Weight History</div>

              {summary.logs.length === 0 ? (
                <div className="empty-state">
                  <TrendingUp size={40} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
                  <h3>No entries yet</h3>
                  <p>Log your first weight to start tracking your transformation.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {summary.logs.slice(0, 15).map((log, i) => {
                    const prev = summary.logs[i + 1];
                    const change = prev ? log.weight - prev.weight : null;
                    return (
                      <div key={log._id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px", background: i === 0 ? "rgba(61,220,151,0.06)" : "var(--bg-subtle)",
                        borderRadius: 12,
                        border: i === 0 ? "1px solid rgba(61,220,151,0.15)" : "1px solid transparent"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: i === 0 ? "#3ddc97" : "var(--text-muted)"
                          }} />
                          <div>
                            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                              {new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            {log.notes && (
                              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{log.notes}</div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {change !== null && (
                            <span style={{
                              fontSize: 11, fontWeight: 700,
                              color: change < 0 ? "#3ddc97" : change > 0 ? "#ff8a3d" : "var(--text-muted)"
                            }}>
                              {change > 0 ? "+" : ""}{change.toFixed(1)}
                            </span>
                          )}
                          <span style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? "#3ddc97" : "var(--text-primary)" }}>
                            {log.weight} kg
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {summary.logs.length > 15 && (
                    <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", paddingTop: 6 }}>
                      Showing latest 15 of {summary.logs.length} entries
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
