import React, { useState, useEffect } from "react";
import { Search, Plus, X, Dumbbell } from "lucide-react";
import { getExercises } from "../../services/exerciseService";
import { FITNESS_IMAGES } from "../../utils/fitnessImages";

export default function ExercisePickerModal({ isOpen, onClose, onSelectExercise }) {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await getExercises({ muscleGroup: category !== "All" ? category : undefined });
        if (isMounted) setExercises(data.exercises || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (isOpen) {
      loadExercises();
    }
    return () => { isMounted = false; };
  }, [isOpen, category]);

  if (!isOpen) return null;

  const filtered = exercises.filter((ex) =>
    (ex.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (ex.muscleGroup || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay fade-in">
      <div className="exercise-picker-card">
        <div className="picker-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Dumbbell size={20} style={{ color: "var(--accent-primary)" }} />
            <span style={{ fontWeight: 800, fontSize: 18 }}>Select Exercise</span>
          </div>
          <button className="icon-close-btn" onClick={onClose} aria-label="Close exercise picker">
            <X size={20} />
          </button>
        </div>

        <div className="picker-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="picker-search-input"
            placeholder="Search exercises by name or muscle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="picker-category-chips">
          {["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio", "HIIT"].map((cat) => (
            <button
              key={cat}
              className={`category-chip ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="picker-exercise-list">
          {loading ? (
            <div className="picker-loading">Loading exercises…</div>
          ) : filtered.length === 0 ? (
            <div className="picker-empty">No matching exercises found.</div>
          ) : (
            filtered.map((ex) => (
              <div
                key={ex._id}
                className="picker-exercise-row"
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectExercise(ex);
                  onClose();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectExercise(ex);
                    onClose();
                  }
                }}
              >
                <img
                  src={ex.imageUrl || FITNESS_IMAGES.placeholder}
                  alt={ex.name}
                  className="picker-thumb"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FITNESS_IMAGES.placeholder;
                  }}
                />
                <div className="picker-exercise-info">
                  <div className="picker-exercise-name">{ex.name}</div>
                  <div className="picker-exercise-meta">
                    <span className="badge-meta">{ex.muscleGroup}</span>
                    <span className="badge-meta">{ex.equipment}</span>
                    <span className="badge-difficulty">{ex.difficulty}</span>
                  </div>
                </div>
                <span className="picker-add-btn" aria-hidden="true">
                  <Plus size={16} />
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
