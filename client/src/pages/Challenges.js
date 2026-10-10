import React, { useEffect, useState } from "react";
import { getChallenges, joinChallenge, leaveChallenge } from "../services/challengeService";
import {
  Flame, Target, CheckCircle, Zap, TrendingUp, LogIn, LogOut
} from "lucide-react";

const DIFFICULTY_CONFIG = {
  Beginner:     { color: "#3ddc97", bg: "rgba(61,220,151,0.12)" },
  Intermediate: { color: "#57b7ff", bg: "rgba(87,183,255,0.12)" },
  Advanced:     { color: "#ff8a3d", bg: "rgba(255,138,61,0.14)" },
  Elite:        { color: "#9f8cff", bg: "rgba(159,140,255,0.14)" },
};

const TYPE_ICONS = {
  Running: TrendingUp, Strength: Flame, Cardio: Zap,
  Yoga: Target, Steps: TrendingUp, default: Target,
};

function ChallengeCard({ challenge, onJoin, onLeave }) {
  const difficulty = DIFFICULTY_CONFIG[challenge.difficulty] || DIFFICULTY_CONFIG.Beginner;
  const Icon = TYPE_ICONS[challenge.type] || TYPE_ICONS.default;
  const isJoined = Boolean(challenge.isJoined);
  const participantCount = challenge.participantCount ?? (Array.isArray(challenge.participants) ? challenge.participants.length : challenge.participants || 0);
  const daysLeft = challenge.endDate
    ? Math.max(0, Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${isJoined ? "rgba(61,220,151,0.22)" : "var(--border-card)"}`,
      borderRadius: 20,
      overflow: "hidden",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}>
      {/* Top accent strip */}
      <div style={{
        height: 4,
        background: isJoined
          ? "linear-gradient(90deg, #3ddc97, #57b7ff)"
          : `linear-gradient(90deg, ${difficulty.color}, transparent)`,
      }} />

      <div style={{ padding: "20px 22px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, ${difficulty.color}22, ${difficulty.color}11)`,
              border: `1px solid ${difficulty.color}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <Icon size={20} style={{ color: difficulty.color }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
                {challenge.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                {challenge.type}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              padding: "3px 8px", borderRadius: 999,
              background: difficulty.bg, color: difficulty.color
            }}>
              {challenge.difficulty?.toUpperCase()}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              padding: "3px 8px", borderRadius: 999,
              background: challenge.status === "active" ? "rgba(61,220,151,0.12)" : "rgba(113,129,154,0.12)",
              color: challenge.status === "active" ? "#3ddc97" : "var(--text-muted)",
            }}>
              {(challenge.status || "active").toUpperCase()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>
          {challenge.description}
        </p>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 16,
          padding: "12px 0", borderTop: "1px solid var(--border-subtle)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
              {challenge.target || "—"}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>TARGET</div>
          </div>
          <div style={{ textAlign: "center", borderLeft: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
              {participantCount}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>JOINED</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: daysLeft !== null && daysLeft < 3 ? "#ff5f6d" : "var(--text-primary)" }}>
              {daysLeft !== null ? `${daysLeft}d` : "∞"}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>LEFT</div>
          </div>
        </div>

        {/* Action */}
        <div style={{ display: "flex", gap: 8 }}>
          {isJoined ? (
            <>
              <div style={{
                flex: 1, padding: "10px 14px", borderRadius: 12,
                background: "rgba(61,220,151,0.1)", border: "1px solid rgba(61,220,151,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                color: "#3ddc97", fontSize: 13, fontWeight: 700
              }}>
                <CheckCircle size={14} /> Participating
              </div>
              <button
                onClick={() => onLeave(challenge._id)}
                style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: "transparent", border: "1px solid var(--border-card)",
                  color: "var(--text-secondary)", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 6
                }}
              >
                <LogOut size={13} /> Leave
              </button>
            </>
          ) : (
            <button
              onClick={() => onJoin(challenge._id)}
              style={{
                flex: 1, padding: "11px 18px", borderRadius: 12,
                background: "linear-gradient(135deg, #3ddc97, #57b7ff)",
                border: "none", color: "#08131d", fontSize: 14, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                boxShadow: "0 4px 14px rgba(61,220,151,0.25)"
              }}
            >
              <LogIn size={14} /> Join Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await getChallenges();
      setChallenges(data.challenges || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadChallenges(); }, []);

  const handleJoin = async (id) => {
    try {
      const response = await joinChallenge(id);
      const updatedChallenge = response?.challenge;

      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge._id === id
            ? {
                ...challenge,
                ...updatedChallenge,
                isJoined: true,
                participantCount: updatedChallenge?.participantCount ?? (Array.isArray(challenge.participants) ? challenge.participants.length + 1 : (challenge.participants || 0) + 1),
              }
            : challenge
        )
      );

      setSuccess(response?.message || "You've joined the challenge! 🎯");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to join challenge");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLeave = async (id) => {
    try {
      const response = await leaveChallenge(id);
      const updatedChallenge = response?.challenge;

      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge._id === id
            ? {
                ...challenge,
                ...updatedChallenge,
                isJoined: false,
                participantCount: updatedChallenge?.participantCount ?? Math.max(0, (Number(challenge.participantCount || (Array.isArray(challenge.participants) ? challenge.participants.length : challenge.participants || 0))) - 1),
              }
            : challenge
        )
      );

      setSuccess(response?.message || "You've left the challenge.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to leave challenge");
      setTimeout(() => setError(""), 3000);
    }
  };

  const joined = challenges.filter(c => c.isJoined);
  const available = challenges.filter(c => !c.isJoined);
  const filtered = filter === "joined" ? joined
    : filter === "available" ? available
    : challenges;

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #ff8a3d, #ff5f6d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(255,138,61,0.3)"
            }}>
              <Flame size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Competitions
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Fitness Challenges
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Join focused challenges and push your limits alongside other athletes.
          </p>
        </div>

        {!loading && (
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 14, padding: "14px 20px" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#3ddc97" }}>{joined.length}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Active</div>
            </div>
            <div style={{ textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 14, padding: "14px 20px" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)" }}>{challenges.length}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Total</div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="alert-success" style={{ marginBottom: 16 }}>{success}</div>}

      {/* Filter */}
      {!loading && challenges.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { id: "all", label: `All (${challenges.length})` },
            { id: "joined", label: `Joined (${joined.length})` },
            { id: "available", label: `Available (${available.length})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "8px 18px", borderRadius: 999, border: "1px solid",
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                background: filter === f.id ? "linear-gradient(135deg, #ff8a3d, #ff5f6d)" : "transparent",
                borderColor: filter === f.id ? "transparent" : "var(--border-card)",
                color: filter === f.id ? "#08131d" : "var(--text-secondary)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading challenges…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Flame size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
          <h3>{filter === "joined" ? "Not in any challenges yet" : "No challenges available"}</h3>
          <p>{filter === "joined" ? "Explore and join a challenge to get started!" : "New challenges coming soon."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {filtered.map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
