import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Dumbbell,
  Target,
  BookOpen,
  CalendarDays,
  UtensilsCrossed,
  Droplets,
  TrendingUp,
  Trophy,
  Flame,
  Bell,
  User,
  Settings as SettingsIcon,
  LogOut,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/workouts", icon: Dumbbell, label: "Workouts" },
  { to: "/workout-plans", icon: CalendarDays, label: "Workout Plans" },
  { to: "/exercise-library", icon: BookOpen, label: "Exercise Library" },
  { to: "/nutrition", icon: UtensilsCrossed, label: "Nutrition" },
  { to: "/hydration", icon: Droplets, label: "Hydration" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/achievements", icon: Trophy, label: "Achievements" },
  { to: "/challenges", icon: Flame, label: "Challenges" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: SettingsIcon, label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "FT";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Backdrop */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={close}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Logo */}
        <Link to="/dashboard" className="sidebar-logo" onClick={close}>
          <div className="sidebar-logo-icon">
            <Zap size={22} />
          </div>
          <span className="sidebar-logo-text">Fit<span>Track</span> Pro</span>
        </Link>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                className={({ isActive }) =>
                  `nav-item${isActive ? " active" : ""}`
                }
              >
                <Icon size={18} className="nav-item-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {user && (
            <Link
              to="/profile"
              className="sidebar-user"
              onClick={close}
            >
              <div className="sidebar-avatar">{getInitials(user.name)}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-role">{user.fitnessGoal || "Athlete"}</div>
              </div>
            </Link>
          )}

          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
