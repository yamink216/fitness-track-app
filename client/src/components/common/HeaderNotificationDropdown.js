import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Dumbbell, Target, Droplets, Trophy } from "lucide-react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../../services/notificationService";

export default function HeaderNotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to load header notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "Workout":
        return <Dumbbell size={16} className="notif-icon workout" />;
      case "Goal":
        return <Target size={16} className="notif-icon goal" />;
      case "Hydration":
        return <Droplets size={16} className="notif-icon hydration" />;
      case "Achievement":
        return <Trophy size={16} className="notif-icon achievement" />;
      default:
        return <Bell size={16} className="notif-icon default" />;
    }
  };

  return (
    <div className="header-notif-container" ref={dropdownRef}>
      <button
        className="header-action-btn"
        onClick={() => {
          setOpen(!open);
          if (!open) loadNotifications();
        }}
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown fade-in">
          <div className="notif-dropdown-header">
            <div>
              <span className="notif-title">Notifications</span>
              {unreadCount > 0 && <span className="notif-unread-pill">{unreadCount} new</span>}
            </div>
            {unreadCount > 0 && (
              <button className="notif-markall-btn" onClick={handleMarkAll} title="Mark all as read">
                <CheckCheck size={14} style={{ marginRight: 4 }} />
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-dropdown-list">
            {loading && notifications.length === 0 ? (
              <div className="notif-empty">Loading notifications…</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <CheckCheck size={28} style={{ color: "var(--accent-primary)", marginBottom: 8 }} />
                <p>You're all caught up!</p>
              </div>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <div
                  key={n._id}
                  className={`notif-item ${!n.read ? "unread" : ""}`}
                  onClick={(e) => !n.read && handleMarkRead(n._id, e)}
                >
                  <div className="notif-item-icon">{getIcon(n.type)}</div>
                  <div className="notif-item-content">
                    <div className="notif-item-title">{n.title}</div>
                    <div className="notif-item-message">{n.message}</div>
                    <div className="notif-item-time">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  {!n.read && <span className="notif-item-dot" title="Unread" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
