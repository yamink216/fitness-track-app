import React, { useEffect, useState } from "react";
import { getTodayWaterProgress, addWater, getWaterLogs } from "../services/waterService";
import { Droplets, Plus, CheckCircle } from "lucide-react";

const QUICK_AMOUNTS = [
  { label: "Small Glass", amount: 200 },
  { label: "Full Glass", amount: 250 },
  { label: "Large Glass", amount: 350 },
  { label: "Bottle (500ml)", amount: 500 },
  { label: "Large Bottle", amount: 750 },
  { label: "1L Bottle", amount: 1000 },
];

function WaterGlass({ progress }) {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {/* Cup shape */}
      <div style={{
        width: 110, height: 160, position: "relative",
        background: "rgba(87,183,255,0.06)",
        border: "2px solid rgba(87,183,255,0.25)",
        borderRadius: "8px 8px 20px 20px",
        overflow: "hidden",
        boxShadow: "0 0 28px rgba(87,183,255,0.12)"
      }}>
        {/* Water fill */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: `${Math.min(100, progress)}%`,
          background: "linear-gradient(180deg, rgba(87,183,255,0.5), rgba(61,220,151,0.4))",
          transition: "height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRadius: "0 0 18px 18px"
        }}>
          {/* Wave */}
          <div style={{
            position: "absolute", top: -8, left: -10, right: -10, height: 16,
            background: "rgba(87,183,255,0.4)",
            borderRadius: "50%",
            animation: "waveAnim 2.5s ease-in-out infinite",
          }} />
        </div>
        {/* Percentage text */}
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 900, color: "var(--text-primary)",
          zIndex: 2
        }}>
          {Math.round(progress)}%
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>DAILY GOAL</div>
    </div>
  );
}

export default function Hydration() {
  const [water, setWater] = useState({ totalMl: 0, targetMl: 2500, progress: 0, logs: [] });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [today, allLogs] = await Promise.all([getTodayWaterProgress(), getWaterLogs()]);
      setWater({ ...today, logs: allLogs.logs || [] });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load hydration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleQuickAdd = async (amount) => {
    try {
      setAdding(amount);
      await addWater({ amount, unit: "ml" });
      setSuccess(`+${amount}ml logged! 💧`);
      setTimeout(() => setSuccess(""), 2500);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log water");
    } finally {
      setAdding(null);
    }
  };

  const handleCustomAdd = async (e) => {
    e.preventDefault();
    if (!customAmount || Number(customAmount) <= 0) return;
    await handleQuickAdd(Number(customAmount));
    setCustomAmount("");
  };

  const remaining = Math.max(0, (water.targetMl || 2500) - (water.totalMl || 0));
  const goalMet = water.progress >= 100;

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #57b7ff, #3ddc97)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(87,183,255,0.3)"
            }}>
              <Droplets size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Hydration
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Water Intake
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Stay hydrated throughout the day for peak performance.
          </p>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="alert-success" style={{ marginBottom: 16 }}>{success}</div>}

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading hydration data…</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20 }}>
          {/* Left: Visuals */}
          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            {/* Main stats card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(87,183,255,0.1), rgba(61,220,151,0.06))",
              border: "1px solid rgba(87,183,255,0.22)",
              borderRadius: 20, padding: "28px 24px",
              textAlign: "center"
            }}>
              <style>{`
                @keyframes waveAnim {
                  0%, 100% { transform: translateX(0) scaleX(1); }
                  50% { transform: translateX(6px) scaleX(1.04); }
                }
              `}</style>
              <WaterGlass progress={water.progress || 0} />

              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
                  {((water.totalMl || 0) / 1000).toFixed(1)}<span style={{ fontSize: 18, color: "var(--text-muted)", fontWeight: 600 }}> L</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
                  of {((water.targetMl || 2500) / 1000).toFixed(1)}L daily goal
                </div>
              </div>

              {goalMet ? (
                <div style={{
                  marginTop: 16, padding: "10px 18px",
                  background: "rgba(61,220,151,0.12)", border: "1px solid rgba(61,220,151,0.25)",
                  borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  color: "#3ddc97", fontSize: 13, fontWeight: 700
                }}>
                  <CheckCircle size={14} /> Daily goal achieved!
                </div>
              ) : (
                <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-secondary)" }}>
                  <span style={{ color: "#57b7ff", fontWeight: 700 }}>{remaining}ml</span> more to reach your goal
                </div>
              )}
            </div>

            {/* Stats mini */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 12
            }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 16, padding: "16px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#57b7ff" }}>{water.logs?.length || 0}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 4 }}>ENTRIES TODAY</div>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 16, padding: "16px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#3ddc97" }}>{Math.round(water.progress || 0)}%</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 4 }}>COMPLETE</div>
              </div>
            </div>

            {/* Custom amount */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10 }}>Custom Amount</div>
              <form onSubmit={handleCustomAdd} style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount (ml)"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  min="1"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: "0 16px", flexShrink: 0 }}>
                  <Plus size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Quick add + history */}
          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            {/* Quick add buttons */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 20, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Quick Add</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {QUICK_AMOUNTS.map(({ label, amount }) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAdd(amount)}
                    disabled={adding !== null}
                    style={{
                      background: adding === amount
                        ? "linear-gradient(135deg, #3ddc97, #57b7ff)"
                        : "var(--bg-subtle)",
                      border: "1px solid var(--border-card)",
                      borderRadius: 14, padding: "14px 8px",
                      cursor: "pointer", transition: "all 0.15s",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 6,
                      color: adding === amount ? "#08131d" : "var(--text-primary)"
                    }}
                  >
                    <Droplets size={20} style={{ color: adding === amount ? "#08131d" : "#57b7ff" }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>+{amount}ml</span>
                    <span style={{ fontSize: 10, color: adding === amount ? "#08131d99" : "var(--text-muted)" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Today's log */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 20, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>Today's Log</div>
              {water.logs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)" }}>
                  <Droplets size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                  <div style={{ fontSize: 14 }}>No water logged yet today</div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {water.logs.slice(0, 8).map((log, i) => (
                    <div key={log._id || i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 14px", borderRadius: 12,
                      background: "var(--bg-subtle)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: "linear-gradient(135deg, #57b7ff, #3ddc97)"
                        }} />
                        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                          {new Date(log.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#57b7ff" }}>
                        +{log.amount} {log.unit}
                      </span>
                    </div>
                  ))}
                  {water.logs.length > 8 && (
                    <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", paddingTop: 6 }}>
                      +{water.logs.length - 8} more entries
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
