import React, { useEffect, useState } from "react";
import { getAchievements } from "../services/achievementService";
import {
  Trophy, Star, Zap, Target, Flame, Dumbbell,
  Lock, CheckCircle, TrendingUp
} from "lucide-react";

const ACHIEVEMENT_ICONS = {
  workout: Dumbbell,
  streak: Flame,
  calories: Zap,
  weight: TrendingUp,
  goal: Target,
  default: Trophy,
};

const RARITY_CONFIG = {
  common: { label: "Common", color: "#71819a", bg: "rgba(113,129,154,0.12)" },
  rare: { label: "Rare", color: "#57b7ff", bg: "rgba(87,183,255,0.12)" },
  epic: { label: "Epic", color: "#9f8cff", bg: "rgba(159,140,255,0.12)" },
  legendary: { label: "Legendary", color: "#ff8a3d", bg: "rgba(255,138,61,0.14)" },
};

function AchievementCard({ achievement }) {
  const pct = Math.min(100, Math.round(((achievement.progress || 0) / Math.max(1, achievement.requirement)) * 100));
  const unlocked = pct >= 100;
  const rarity = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common;
  const Icon = ACHIEVEMENT_ICONS[achievement.type?.toLowerCase()] || ACHIEVEMENT_ICONS.default;

  return (
    <div
      className="achievement-card"
      style={{
        background: unlocked
          ? "linear-gradient(135deg, rgba(61,220,151,0.08), rgba(87,183,255,0.06))"
          : "var(--bg-card)",
        border: `1px solid ${unlocked ? "rgba(61,220,151,0.22)" : "var(--border-card)"}`,
        borderRadius: 18,
        padding: "22px 20px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Glow for unlocked */}
      {unlocked && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, #3ddc97, #57b7ff)",
          borderRadius: "18px 18px 0 0"
        }} />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Icon box */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: unlocked
            ? "linear-gradient(135deg, #3ddc97, #57b7ff)"
            : "var(--bg-subtle)",
          boxShadow: unlocked ? "0 0 18px rgba(61,220,151,0.25)" : "none",
          position: "relative"
        }}>
          {unlocked ? (
            <Icon size={24} style={{ color: "#08131d" }} />
          ) : (
            <Lock size={22} style={{ color: "var(--text-muted)" }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{achievement.title}</div>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              padding: "3px 8px", borderRadius: 999,
              background: rarity.bg, color: rarity.color
            }}>{rarity.label.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.4 }}>
            {achievement.description}
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: "var(--bg-subtle)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
            <div style={{
              width: `${pct}%`, height: "100%", borderRadius: 999,
              background: unlocked
                ? "linear-gradient(90deg, #3ddc97, #57b7ff)"
                : "linear-gradient(90deg, var(--accent-orange), #ffb84d)",
              transition: "width 0.6s ease"
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
            <span>{achievement.progress || 0} / {achievement.requirement}</span>
            {unlocked ? (
              <span style={{ color: "#3ddc97", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle size={12} /> Unlocked
              </span>
            ) : (
              <span>{pct}% complete</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAchievements();
        setAchievements(data.achievements || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load achievements");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const unlocked = achievements.filter(a =>
    (a.progress || 0) >= a.requirement
  );
  const filtered = filter === "unlocked" ? unlocked
    : filter === "locked" ? achievements.filter(a => (a.progress || 0) < a.requirement)
    : achievements;

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #ff8a3d, #ffd166)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(255,138,61,0.3)"
            }}>
              <Trophy size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Milestones
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Your Achievements
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Celebrate every milestone and stay motivated through your fitness journey.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 14, padding: "14px 20px" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#3ddc97" }}>{unlocked.length}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Unlocked</div>
          </div>
          <div style={{ textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 14, padding: "14px 20px" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)" }}>{achievements.length}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Total</div>
          </div>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

      {/* Filter tabs */}
      {!loading && achievements.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["all", "unlocked", "locked"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 18px", borderRadius: 999, border: "1px solid",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                background: filter === f ? "linear-gradient(135deg, #3ddc97, #57b7ff)" : "transparent",
                borderColor: filter === f ? "transparent" : "var(--border-card)",
                color: filter === f ? "#08131d" : "var(--text-secondary)",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "unlocked" && ` (${unlocked.length})`}
              {f === "all" && ` (${achievements.length})`}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading achievements…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Star size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
          <h3>No achievements yet</h3>
          <p>Complete workouts and hit milestones to unlock badges.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {filtered.map((achievement) => (
            <AchievementCard key={achievement._id} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  );
}
