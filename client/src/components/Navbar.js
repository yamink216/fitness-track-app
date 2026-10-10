import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Zap, LayoutDashboard, Dumbbell, Target, User, LogOut,
  Calendar, Droplets, UtensilsCrossed, TrendingUp, Trophy, Library
} from "lucide-react";
import HeaderNotificationDropdown from "./common/HeaderNotificationDropdown";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/dashboard" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={18} style={{ color: "#08131d" }} />
          </div>
          <span className="logo-text">Fit<span className="logo-accent">Track</span> Pro</span>
        </Link>

        {/* Mobile Menu Hamburger */}
        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="navbar-links">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <LayoutDashboard size={16} className="nav-icon" />
              Dashboard
            </NavLink>

            <NavLink
              to="/workouts"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <Dumbbell size={16} className="nav-icon" />
              Workouts
            </NavLink>

            <NavLink
              to="/workout-plans"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <Calendar size={16} className="nav-icon" />
              Plans
            </NavLink>

            <NavLink
              to="/nutrition"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <UtensilsCrossed size={16} className="nav-icon" />
              Nutrition
            </NavLink>

            <NavLink
              to="/hydration"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <Droplets size={16} className="nav-icon" />
              Hydration
            </NavLink>

            <NavLink
              to="/progress"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <TrendingUp size={16} className="nav-icon" />
              Progress
            </NavLink>

            <NavLink
              to="/goals"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <Target size={16} className="nav-icon" />
              Goals
            </NavLink>

            <NavLink
              to="/exercises"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMenu}
            >
              <Library size={16} className="nav-icon" />
              Library
            </NavLink>
          </div>

          {/* User Controls & Notifications */}
          <div className="navbar-user" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <HeaderNotificationDropdown />

            {user && (
              <Link to="/profile" className="user-profile-badge" onClick={closeMenu}>
                <div className="user-avatar">{getInitials(user.name)}</div>
                <div className="user-meta">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.fitnessGoal || "Athlete"}</span>
                </div>
              </Link>
            )}

            <button className="logout-button" onClick={handleLogout} title="Logout">
              <LogOut size={16} className="logout-icon" />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}