import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutCard from "../components/WorkoutCard";
import { getWorkouts, deleteWorkout } from "../services/workoutService";
import { Plus, Search, Filter, Dumbbell, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  "All",
  "Running",
  "Gym",
  "Strength Training",
  "Cycling",
  "Walking",
  "Swimming",
  "Yoga",
  "Cardio",
  "Other",
];

export default function Workouts() {
  const location = useLocation();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditing] = useState(null);
  const [prefillPlan, setPrefillPlan] = useState(null);

  // Check if routed from WorkoutPlans page with a selected plan
  useEffect(() => {
    if (location.state?.plan) {
      setPrefillPlan(location.state.plan);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getWorkouts();
      setWorkouts(Array.isArray(data) ? data : Array.isArray(data?.workouts) ? data.workouts : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleWorkoutAdded = (w) => {
    if (!w?._id) return;
    setWorkouts((p) => [w, ...p]);
    setShowForm(false);
    setPrefillPlan(null);
    flash("Workout logged and analytics updated in real-time!");
  };

  const handleEdit = (w) => {
    setEditing(w);
    setPrefillPlan(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWorkoutUpdated = (w) => {
    if (!w?._id) return;
    setWorkouts((p) => p.map((x) => (x._id === w._id ? w : x)));
    setEditing(null);
    setShowForm(false);
    flash("Workout session updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setPrefillPlan(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout session?")) return;
    try {
      await deleteWorkout(id);
      setWorkouts((p) => p.filter((w) => w._id !== id));
      if (editingWorkout?._id === id) handleCancelEdit();
      flash("Workout removed.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete workout.");
    }
  };

  const filtered = useMemo(() => {
    let list = [...workouts];
    if (selectedCat !== "All") list = list.filter((w) => w.workoutType === selectedCat);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (w) =>
          w.title?.toLowerCase().includes(q) ||
          w.workoutType?.toLowerCase().includes(q) ||
          w.notes?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "calories_desc") return (b.caloriesBurned || 0) - (a.caloriesBurned || 0);
      if (sortBy === "duration_desc") return (b.duration || 0) - (a.duration || 0);
      return new Date(b.date || 0) - new Date(a.date || 0);
    });
    return list;
  }, [workouts, selectedCat, searchTerm, sortBy]);

  const totalCal = filtered.reduce((a, w) => a + (w.caloriesBurned || 0), 0);
  const totalMins = filtered.reduce((a, w) => a + (w.duration || 0), 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-badge">
            <Dumbbell size={14} style={{ marginRight: 6 }} /> Workouts
          </div>
          <h1>Workout Sessions</h1>
          <p>Log and analyze your training volume, structured movements, and calorie output.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) {
              handleCancelEdit();
            } else {
              setEditing(null);
              setPrefillPlan(null);
              setShowForm(true);
            }
          }}
        >
          <Plus size={16} />
          {showForm ? "Close Form" : "Log New Workout"}
        </button>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}
      {successMsg && (
        <div className="alert-success" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={16} style={{ marginRight: 8 }} /> {successMsg}
        </div>
      )}

      {/* Form Panel */}
      {showForm && (
        <div style={{ marginBottom: 28 }}>
          <WorkoutForm
            onWorkoutAdded={handleWorkoutAdded}
            editingWorkout={editingWorkout}
            onWorkoutUpdated={handleWorkoutUpdated}
            onCancelEdit={handleCancelEdit}
            prefillPlan={prefillPlan}
          />
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-box-wrap" style={{ flex: "1 1 240px" }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, workout type, or notes…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Filter size={15} style={{ color: "var(--text-muted)" }} />
              <select
                className="select-compact"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <select
              className="select-compact"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="calories_desc">Highest Calories</option>
              <option value="duration_desc">Longest Duration</option>
            </select>
          </div>
        </div>

        {/* Quick summary strip */}
        <div style={{ display: "flex", gap: 20, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)", fontSize: 13, color: "var(--text-secondary)" }}>
          <span>Showing: <strong>{filtered.length}</strong> sessions</span>
          <span>Calories: <strong>{totalCal.toLocaleString()}</strong> kcal</span>
          <span>Time: <strong>{totalMins >= 60 ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m` : `${totalMins}m`}</strong></span>
        </div>
      </div>

      {/* Workout Cards Grid */}
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading workout sessions…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty-state">
          <Dumbbell size={40} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
          <h3>No workout sessions found</h3>
          <p>
            {searchTerm || selectedCat !== "All"
              ? "Try adjusting your filters or search terms."
              : "Start recording your training sessions to unlock automatic progress tracking and streak counts."}
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            onClick={() => {
              setSelectedCat("All");
              setSearchTerm("");
              setShowForm(true);
            }}
          >
            <Plus size={16} /> Log Your First Session
          </button>
        </div>
      ) : (
        <div className="workout-cards-grid">
          {filtered.map((w) => (
            <WorkoutCard
              key={w._id}
              workout={w}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}