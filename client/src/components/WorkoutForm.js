import React, { useEffect, useState } from "react";
import { createWorkout, updateWorkout } from "../services/workoutService";
import ExercisePickerModal from "./workouts/ExercisePickerModal";
import RestTimerModal from "./common/RestTimerModal";
import { Plus, Trash2, Clock, Dumbbell, Save, X, BookOpen } from "lucide-react";

const INITIAL = {
  title: "",
  workoutType: "Running",
  duration: "",
  caloriesBurned: "",
  distance: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
  exercises: [],
};

const CATEGORIES = [
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

export default function WorkoutForm({
  onWorkoutAdded,
  editingWorkout,
  onWorkoutUpdated,
  onCancelEdit,
  prefillPlan = null,
}) {
  const [formData, setFormData] = useState(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [timerModal, setTimerModal] = useState({ open: false, seconds: 60 });

  useEffect(() => {
    if (editingWorkout) {
      setFormData({
        title: editingWorkout.title || "",
        workoutType: editingWorkout.workoutType || "Running",
        duration: editingWorkout.duration ?? "",
        caloriesBurned: editingWorkout.caloriesBurned ?? "",
        distance: editingWorkout.distance ?? "",
        date: editingWorkout.date
          ? new Date(editingWorkout.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        notes: editingWorkout.notes || "",
        exercises: editingWorkout.exercises || [],
      });
      setError("");
    } else if (prefillPlan) {
      setFormData({
        title: prefillPlan.title || prefillPlan.name || "",
        workoutType: "Gym",
        duration: prefillPlan.duration || 45,
        caloriesBurned: prefillPlan.caloriesBurned || 350,
        distance: "",
        date: new Date().toISOString().split("T")[0],
        notes: prefillPlan.notes || `Generated from plan: ${prefillPlan.name || ""}`,
        exercises: (prefillPlan.exercises || []).map((ex) => ({
          exerciseId: ex.exerciseId || null,
          name: ex.name,
          sets: ex.sets || 3,
          reps: ex.reps || 10,
          weight: ex.weight || 0,
          duration: ex.duration || 0,
          restTime: ex.restTime || 60,
        })),
      });
    } else {
      setFormData({ ...INITIAL, date: new Date().toISOString().split("T")[0] });
    }
  }, [editingWorkout, prefillPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExerciseFromPicker = (exercise) => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseId: exercise._id,
          name: exercise.name,
          sets: 3,
          reps: 10,
          weight: 0,
          duration: 0,
          restTime: 60,
        },
      ],
    }));
  };

  const handleAddCustomExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseId: null,
          name: "Custom Exercise",
          sets: 3,
          reps: 10,
          weight: 0,
          duration: 0,
          restTime: 60,
        },
      ],
    }));
  };

  const handleUpdateExercise = (index, field, val) => {
    const list = [...formData.exercises];
    list[index][field] = val;
    setFormData((prev) => ({ ...prev, exercises: list }));
  };

  const handleRemoveExercise = (index) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim() || `${formData.workoutType} Session`,
        workoutType: formData.workoutType,
        duration: Number(formData.duration),
        caloriesBurned: Number(formData.caloriesBurned),
        date: formData.date || new Date().toISOString().split("T")[0],
        notes: formData.notes?.trim() || "",
        exercises: formData.exercises.map((ex) => ({
          exerciseId: ex.exerciseId || null,
          name: ex.name,
          sets: Number(ex.sets) || 0,
          reps: Number(ex.reps) || 0,
          weight: Number(ex.weight) || 0,
          duration: Number(ex.duration) || 0,
          restTime: Number(ex.restTime) || 0,
        })),
      };

      if (formData.distance !== "" && formData.distance !== null) {
        payload.distance = Number(formData.distance);
      }

      if (editingWorkout) {
        const data = await updateWorkout(editingWorkout._id, payload);
        onWorkoutUpdated(data?.workout || data);
      } else {
        const data = await createWorkout(payload);
        onWorkoutAdded(data?.workout || data);
        setFormData({ ...INITIAL, date: new Date().toISOString().split("T")[0] });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-panel fade-in">
      <div className="form-panel-title">
        <Dumbbell size={20} style={{ color: "var(--accent-primary)", marginRight: 8 }} />
        <span>{editingWorkout ? "Edit Workout Session" : "Log New Workout Session"}</span>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
          <div className="form-group">
            <label htmlFor="title">Session Title</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g. Morning Chest & Triceps Pump"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="workoutType">Workout Category *</label>
            <select
              id="workoutType"
              name="workoutType"
              className="form-control"
              value={formData.workoutType}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16 }}>
          <div className="form-group">
            <label htmlFor="duration">Duration (mins) *</label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              max="600"
              className="form-control"
              placeholder="45"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="caloriesBurned">Calories Burned (kcal) *</label>
            <input
              id="caloriesBurned"
              name="caloriesBurned"
              type="number"
              min="0"
              max="5000"
              className="form-control"
              placeholder="320"
              value={formData.caloriesBurned}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="distance">Distance (km)</label>
            <input
              id="distance"
              name="distance"
              type="number"
              step="0.01"
              min="0"
              max="500"
              className="form-control"
              placeholder="5.2"
              value={formData.distance}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Session Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Structured Exercises Logger */}
        <div className="workout-exercises-section">
          <div className="section-header-row">
            <div>
              <div className="section-kicker">EXERCISE LOG</div>
              <h4 style={{ fontSize: 16, fontWeight: 800 }}>Structured Exercises & Sets</h4>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowPicker(true)}
              >
                <BookOpen size={14} style={{ marginRight: 6 }} /> Library
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleAddCustomExercise}
              >
                <Plus size={14} style={{ marginRight: 6 }} /> Custom
              </button>
            </div>
          </div>

          {formData.exercises.length === 0 ? (
            <div className="empty-exercises-prompt">
              <p>No exercises attached yet. Pick from the <strong>Exercise Library</strong> or add custom movements with sets, reps, and weights.</p>
            </div>
          ) : (
            <div className="exercise-inputs-table">
              <div className="exercise-table-header">
                <span style={{ flex: 2 }}>Exercise Name</span>
                <span style={{ flex: 1 }}>Sets</span>
                <span style={{ flex: 1 }}>Reps</span>
                <span style={{ flex: 1 }}>Weight (kg)</span>
                <span style={{ flex: 1 }}>Rest (s)</span>
                <span style={{ width: 64 }}>Actions</span>
              </div>

              {formData.exercises.map((ex, index) => (
                <div key={index} className="exercise-table-row">
                  <input
                    type="text"
                    className="form-control-compact"
                    style={{ flex: 2 }}
                    placeholder="Exercise name"
                    value={ex.name}
                    onChange={(e) => handleUpdateExercise(index, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    className="form-control-compact"
                    style={{ flex: 1 }}
                    placeholder="Sets"
                    value={ex.sets}
                    onChange={(e) => handleUpdateExercise(index, "sets", e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    className="form-control-compact"
                    style={{ flex: 1 }}
                    placeholder="Reps"
                    value={ex.reps}
                    onChange={(e) => handleUpdateExercise(index, "reps", e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="form-control-compact"
                    style={{ flex: 1 }}
                    placeholder="kg"
                    value={ex.weight}
                    onChange={(e) => handleUpdateExercise(index, "weight", e.target.value)}
                  />
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      type="number"
                      min="0"
                      className="form-control-compact"
                      placeholder="60"
                      value={ex.restTime}
                      onChange={(e) => handleUpdateExercise(index, "restTime", e.target.value)}
                    />
                    <button
                      type="button"
                      className="icon-action-btn"
                      title="Start Rest Timer"
                      onClick={() => setTimerModal({ open: true, seconds: ex.restTime || 60 })}
                    >
                      <Clock size={14} style={{ color: "var(--accent-primary)" }} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="icon-action-btn danger"
                    onClick={() => handleRemoveExercise(index)}
                    title="Remove exercise"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label htmlFor="notes">Session Notes & Thoughts</label>
          <textarea
            id="notes"
            name="notes"
            className="form-control"
            rows={2}
            placeholder="Felt energized, increased bench press weight by 2.5kg..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions-row">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={16} />
            {loading ? "Saving…" : editingWorkout ? "Update Session" : "Log Workout Session"}
          </button>

          {(editingWorkout || prefillPlan) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelectExercise={handleAddExerciseFromPicker}
      />

      {/* Interactive Rest Timer Modal */}
      <RestTimerModal
        isOpen={timerModal.open}
        initialSeconds={timerModal.seconds}
        onClose={() => setTimerModal({ open: false, seconds: 60 })}
      />
    </div>
  );
}