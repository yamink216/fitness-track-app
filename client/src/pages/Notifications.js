import React, { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "../services/notificationService";
import { Bell, CheckCircle, Trophy, Target, Flame, Info, AlertTriangle, Check, BellOff } from "lucide-react";

const TYPE_CONFIG = {
  achievement: { icon: Trophy, color: "#ff8a3d", bg: "rgba(255,138,61,0.12)", label: "Achievement" },
  goal: { icon: Target, color: "#9f8cff", bg: "rgba(159,140,255,0.12)", label: "Goal Update" },
  workout: { icon: Flame, color: "#3ddc97", bg: "rgba(61,220,151,0.12)", label: "Workout" },
  reminder: { icon: Bell, color: "#57b7ff", bg: "rgba(87,183,255,0.12)", label: "Reminder" },
  alert: { icon: AlertTriangle, color: "#ff5f6d", bg: "rgba(255,95,109,0.12)", label: "Alert" },
  default: { icon: Info, color: "#71819a", bg: "rgba(113,129,154,0.12)", label: "Notification" },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

function NotificationCard({ note, onRead }) {
  const cfg = TYPE_CONFIG[note.type?.toLowerCase()] || TYPE_CONFIG.default;
  const Icon = cfg.icon;

  return (
    <div style={{
      background: note.read ? "var(--bg-card)" : "linear-gradient(135deg, rgba(87,183,255,0.05), rgba(61,220,151,0.04))",
      border: `1px solid ${note.read ? "var(--border-card)" : "rgba(87,183,255,0.18)"}`,
      borderRadius: 16,
      padding: "16px 18px",
      display: "flex", alignItems: "flex-start", gap: 14,
      transition: "all 0.2s ease",
      position: "relative",
    }}>
      {/* Unread indicator */}
      {!note.read && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          width: 8, height: 8, borderRadius: "50%",
          background: "#57b7ff",
          boxShadow: "0 0 6px rgba(87,183,255,0.5)"
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={20} style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
            {note.title}
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
            {timeAgo(note.createdAt)}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 10 }}>
          {note.message}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            padding: "3px 8px", borderRadius: 999,
            background: cfg.bg, color: cfg.color
          }}>
            {cfg.label.toUpperCase()}
          </span>
          {!note.read && (
            <button
              onClick={() => onRead(note._id)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "transparent", border: "1px solid var(--border-card)",
                borderRadius: 8, padding: "5px 10px",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                color: "var(--text-secondary)", transition: "all 0.15s"
              }}
            >
              <Check size={12} /> Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update notification");
    }
  };

  const handleReadAll = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markNotificationAsRead(n._id)));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifications.filter(n => !n.read);
  const filtered = filter === "unread" ? unread
    : filter === "read" ? notifications.filter(n => n.read)
    : notifications;

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #57b7ff, #9f8cff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(87,183,255,0.3)",
              position: "relative"
            }}>
              <Bell size={18} style={{ color: "#08131d" }} />
              {unread.length > 0 && (
                <div style={{
                  position: "absolute", top: -4, right: -4,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#ff5f6d", fontSize: 9, fontWeight: 800,
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid var(--bg-base)"
                }}>
                  {unread.length}
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Alerts & Updates
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Notifications
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Stay updated with your milestones, reminders, and achievements.
          </p>
        </div>

        {unread.length > 0 && (
          <button
            onClick={handleReadAll}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(61,220,151,0.1)", border: "1px solid rgba(61,220,151,0.22)",
              borderRadius: 12, padding: "10px 18px",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              color: "#3ddc97", transition: "all 0.15s"
            }}
          >
            <CheckCircle size={14} /> Mark all read
          </button>
        )}
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Filters + stats */}
      {!loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "all", label: `All (${notifications.length})` },
              { id: "unread", label: `Unread (${unread.length})` },
              { id: "read", label: "Read" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: "8px 16px", borderRadius: 999, border: "1px solid",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  background: filter === f.id ? "linear-gradient(135deg, #57b7ff, #9f8cff)" : "transparent",
                  borderColor: filter === f.id ? "transparent" : "var(--border-card)",
                  color: filter === f.id ? "#08131d" : "var(--text-secondary)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading notifications…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <BellOff size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
          <h3>{filter === "unread" ? "All caught up!" : "No notifications"}</h3>
          <p>{filter === "unread" ? "No unread notifications." : "You'll see alerts, milestones, and reminders here."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((note) => (
            <NotificationCard key={note._id} note={note} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
}
