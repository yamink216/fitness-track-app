import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Goals from "./pages/Goals";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import WorkoutPlans from "./pages/WorkoutPlans";
import Nutrition from "./pages/Nutrition";
import Hydration from "./pages/Hydration";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import Challenges from "./pages/Challenges";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import HeaderNotificationDropdown from "./components/common/HeaderNotificationDropdown";

import { AuthProvider } from "./context/AuthContext";

import "./App.css";

function AppLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-wrapper">
        <header className="top-header">
          <div className="top-header-title-block">
            <span className="top-header-kicker">Performance Center</span>
            <h2>{user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "FitTrack Pro"}</h2>
          </div>

          <div className="top-header-actions">
            <HeaderNotificationDropdown />
            <div className="header-profile-pill">
              <div className="header-profile-avatar">{user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "FT"}</div>
              <div>
                <div className="header-profile-name">{user?.name || "Athlete"}</div>
                <div className="header-profile-role">{user?.fitnessGoal || "Member"}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <AppLayout><Workouts /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <AppLayout><Goals /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise-library"
            element={
              <ProtectedRoute>
                <AppLayout><ExerciseLibrary /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises"
            element={<Navigate to="/exercise-library" replace />}
          />
          <Route
            path="/workout-plans"
            element={
              <ProtectedRoute>
                <AppLayout><WorkoutPlans /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <AppLayout><Nutrition /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hydration"
            element={
              <ProtectedRoute>
                <AppLayout><Hydration /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <AppLayout><Progress /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <AppLayout><Achievements /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <AppLayout><Challenges /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <AppLayout><Notifications /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout><Profile /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout><Settings /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;