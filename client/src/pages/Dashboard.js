import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardAnalytics } from "../services/analyticsService";
import { addWater } from "../services/waterService";
import { FITNESS_IMAGES, getCategoryPhoto } from "../utils/fitnessImages";
import {
  Dumbbell,
  Flame,
  Clock,
  Zap,
  Target,
  Droplets,
  Plus,
  ArrowRight,
  Calendar,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [waterAdding, setWaterAdding] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
      setError("Failed to load live dashboard analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickWater = async (amount) => {
    try {
      setWaterAdding(true);
      await addWater({ amount, unit: "ml" });
      setQuickSuccess(`+${amount}ml water logged!`);
      setTimeout(() => setQuickSuccess(""), 3000);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setWaterAdding(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <div className="loading-text">Assembling your live performance metrics…</div>
      </div>
    );
  }

  const today = data?.today || {};
  const totals = data?.totals || {};
  const thisWeek = data?.thisWeek || {};
  const streak = data?.streak || 0;
  const goal = data?.goal || null;
  const last7Days = data?.last7Days || [];
  const maxCalories = Math.max(...last7Days.map((d) => d.calories), 100);

  return (
    <div className="fade-in">
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero-card">
        <div
          className="dashboard-hero-bg"
          style={{ backgroundImage: `url(${FITNESS_IMAGES.hero})` }}
        />
        <div className="dashboard-hero-overlay" />
        <div className="dashboard-hero-content">
          <div className="hero-kicker">
            <Sparkles size={14} style={{ marginRight: 6 }} />
            <span>DAILY ATHLETIC BRIEFING</span>
          </div>
          <h1 className="hero-title">
            Push Your Limits, {user?.name ? user.name.split(" ")[0] : "Athlete"}.
          </h1>
          <p className="hero-desc">
            {streak > 0
              ? `You are on a ${streak}-day active streak! Keep the intensity alive today.`
              : "Every journey begins with a single session. Log your first activity today."}
          </p>

          <div className="hero-actions">
            <Link to="/workouts" className="btn btn-primary">
              <Dumbbell size={16} />
              Start Workout
            </Link>
            <Link to="/workout-plans" className="btn btn-secondary">
              <Calendar size={16} />
              Browse Plans
            </Link>
          </div>
        </div>

        <div className="hero-streak-badge">
          <div className="streak-icon-wrap">
            <Zap size={24} className="streak-bolt" />
          </div>
          <div>
            <div className="streak-count">{streak} DAYS</div>
            <div className="streak-label">ACTIVE STREAK</div>
          </div>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}
      {quickSuccess && <div className="alert-success" style={{ marginBottom: 20 }}>{quickSuccess}</div>}

      {/* Top 4 KPI Metrics */}
      <div className="stats-grid">
        <div className="stat-card orange">
          <div className="stat-icon-box orange">
            <Dumbbell size={20} />
          </div>
          <div className="stat-label">Total Workouts</div>
          <div className="stat-value">{totals.totalWorkouts || 0}</div>
          <div className="stat-change up">+{thisWeek.count || 0} this week</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon-box green">
            <Flame size={20} />
          </div>
          <div className="stat-label">Calories Burned</div>
          <div className="stat-value">{(totals.totalCalories || 0).toLocaleString()} <span className="unit">kcal</span></div>
          <div className="stat-change up">{(thisWeek.calories || 0).toLocaleString()} kcal this week</div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon-box blue">
            <Clock size={20} />
          </div>
          <div className="stat-label">Active Time</div>
          <div className="stat-value">
            {totals.totalDuration >= 60
              ? `${Math.floor(totals.totalDuration / 60)}h ${totals.totalDuration % 60}m`
              : `${totals.totalDuration || 0}m`}
          </div>
          <div className="stat-change up">{thisWeek.duration || 0}m this week</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon-box purple">
            <Target size={20} />
          </div>
          <div className="stat-label">Goal Target</div>
          <div className="stat-value">
            {goal ? `${goal.targetWeight} kg` : "No goal set"}
          </div>
          <div className="stat-change warn">
            {goal ? `${goal.progress}% completed` : "Set your target"}
          </div>
        </div>
      </div>

      {/* 2-Column Main Section: Left = Activity Chart + Recent Workouts, Right = Today's Nutrition + Hydration + Goal */}
      <div className="dashboard-layout-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* Weekly Workout Consistency Chart */}
          <div className="card">
            <div className="card-header-row">
              <div>
                <div className="section-kicker">7-DAY ACTIVITY</div>
                <h3 className="section-heading">Training Volume & Calories</h3>
              </div>
              <div className="badge-meta">
                <Flame size={14} style={{ color: "var(--accent-orange)" }} />
                <span>Last 7 Days</span>
              </div>
            </div>

            <div className="activity-chart-container">
              {last7Days.map((day) => {
                const heightPct = Math.max(8, Math.round((day.calories / maxCalories) * 100));
                return (
                  <div key={day.date} className="chart-bar-column">
                    <div className="chart-bar-tooltip">
                      {day.calories} kcal • {day.duration}m
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="chart-day-label">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Training Sessions */}
          <div className="card">
            <div className="card-header-row">
              <div>
                <div className="section-kicker">SCHEDULE & LOGS</div>
                <h3 className="section-heading">Today's Workout Sessions</h3>
              </div>
              <Link to="/workouts" className="btn btn-secondary btn-sm">
                <Plus size={14} /> Log Session
              </Link>
            </div>

            {today.workoutsCount === 0 ? (
              <div className="empty-state" style={{ padding: "28px 16px" }}>
                <Dumbbell size={32} style={{ color: "var(--text-muted)", marginBottom: 8 }} />
                <h4 style={{ fontWeight: 800 }}>No workouts logged today yet</h4>
                <p style={{ fontSize: 13 }}>Hit the gym or go for a run to keep your active streak alive.</p>
                <Link to="/workouts" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                  Start Today's Session
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {today.workouts.map((w) => (
                  <div key={w._id} className="today-workout-item">
                    <img
                      src={getCategoryPhoto(w.workoutType)}
                      alt={w.workoutType}
                      className="today-workout-thumb"
                    />
                    <div className="today-workout-info">
                      <div className="today-workout-title">{w.title || w.workoutType}</div>
                      <div className="today-workout-meta">
                        <span>{w.duration} mins</span> • <span>{w.caloriesBurned} kcal</span>
                        {w.exercises?.length > 0 && <span> • {w.exercises.length} exercises</span>}
                      </div>
                    </div>
                    <span className="badge-meta green">Completed</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Workouts Feed */}
          <div className="card">
            <div className="card-header-row">
              <div>
                <div className="section-kicker">HISTORY</div>
                <h3 className="section-heading">Recent Workouts</h3>
              </div>
              <Link to="/workouts" className="link-arrow">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="workout-feed-list">
              {(data?.recentWorkouts || []).length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No past workouts yet.</p>
              ) : (
                data.recentWorkouts.map((w) => (
                  <div key={w._id} className="workout-feed-row">
                    <img
                      src={getCategoryPhoto(w.workoutType)}
                      alt={w.workoutType}
                      className="feed-thumb"
                    />
                    <div className="feed-details">
                      <div className="feed-title">{w.title || w.workoutType}</div>
                      <div className="feed-sub">
                        {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {w.duration} min • {w.caloriesBurned} kcal
                      </div>
                    </div>
                    <span className="badge-meta">{w.workoutType}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
          {/* Active Fitness Goal */}
          <div className="card">
            <div className="card-header-row">
              <div>
                <div className="section-kicker">TARGET</div>
                <h3 className="section-heading">Active Fitness Goal</h3>
              </div>
              <Link to="/goals" className="link-arrow">
                Manage <ArrowRight size={14} />
              </Link>
            </div>

            {goal ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{goal.goalType}</span>
                  <span style={{ fontWeight: 800, color: "var(--accent-primary)" }}>{goal.progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${goal.progress}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 13, color: "var(--text-secondary)" }}>
                  <span>Current: <strong>{goal.currentWeight} kg</strong></span>
                  <span>Target: <strong>{goal.targetWeight} kg</strong></span>
                  <span>Remaining: <strong>{goal.remainingWeight} kg</strong></span>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
                  Set a body transformation or performance target to enable automatic progress calculations.
                </p>
                <Link to="/goals" className="btn btn-secondary full-width">
                  Set Your First Goal
                </Link>
              </div>
            )}
          </div>

          {/* Today's Hydration Tracker with Quick Add */}
          <div className="card">
            <div className="card-header-row">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="stat-icon-box blue" style={{ width: 32, height: 32 }}>
                  <Droplets size={16} />
                </div>
                <h3 className="section-heading">Hydration</h3>
              </div>
              <span className="badge-meta blue">{(today.waterMl || 0)} / {today.waterTargetMl || 2500} ml</span>
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="progress-bar-bg" style={{ height: 10 }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${today.waterProgress || 0}%`, background: "linear-gradient(90deg, #57b7ff, #3ddc97)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                <span>{today.waterProgress || 0}% of daily target</span>
                <span>{Math.max(0, (today.waterTargetMl || 2500) - (today.waterMl || 0))} ml remaining</span>
              </div>

              <div className="quick-water-buttons" style={{ marginTop: 14 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleQuickWater(250)}
                  disabled={waterAdding}
                >
                  <Plus size={14} /> 250ml
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleQuickWater(500)}
                  disabled={waterAdding}
                >
                  <Plus size={14} /> 500ml
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleQuickWater(750)}
                  disabled={waterAdding}
                >
                  <Plus size={14} /> 750ml
                </button>
                <Link to="/hydration" className="btn btn-outline btn-sm">
                  View
                </Link>
              </div>
            </div>
          </div>

          {/* Today's Nutrition Breakdown */}
          <div className="card">
            <div className="card-header-row">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="stat-icon-box green" style={{ width: 32, height: 32 }}>
                  <UtensilsCrossed size={16} />
                </div>
                <h3 className="section-heading">Nutrition Summary</h3>
              </div>
              <Link to="/nutrition" className="link-arrow">
                Log <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)" }}>
                  {today.caloriesConsumed || 0}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: 14 }}>kcal consumed today</span>
              </div>

              <div className="macro-pills-row">
                <div className="macro-pill">
                  <div className="macro-pill-title">Protein</div>
                  <div className="macro-pill-val" style={{ color: "var(--accent-primary)" }}>{today.macros?.protein || 0}g</div>
                </div>
                <div className="macro-pill">
                  <div className="macro-pill-title">Carbs</div>
                  <div className="macro-pill-val" style={{ color: "var(--accent-orange)" }}>{today.macros?.carbs || 0}g</div>
                </div>
                <div className="macro-pill">
                  <div className="macro-pill-title">Fat</div>
                  <div className="macro-pill-val" style={{ color: "var(--accent-purple)" }}>{today.macros?.fat || 0}g</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}