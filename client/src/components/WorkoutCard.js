import React, { useState } from "react";
import { Clock, Flame, MapPin, Dumbbell, Edit3, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryPhoto } from "../utils/fitnessImages";

export default function WorkoutCard({ workout, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = new Date(workout.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const exercises = workout.exercises || [];

  return (
    <div className="workout-card-premium fade-in">
      <div className="card-thumb-wrap">
        <img
          src={getCategoryPhoto(workout.workoutType)}
          alt={workout.workoutType}
          className="card-cover-img"
        />
        <div className="card-thumb-badge">{workout.workoutType}</div>
      </div>

      <div className="card-body-content">
        <div className="card-title-row">
          <div>
            <span className="card-date-sub">{formattedDate}</span>
            <h3 className="card-workout-title">
              {workout.title || `${workout.workoutType} Workout`}
            </h3>
          </div>
          <div className="card-actions-group">
            <button
              className="icon-action-btn"
              onClick={() => onEdit(workout)}
              title="Edit workout"
            >
              <Edit3 size={16} />
            </button>
            <button
              className="icon-action-btn danger"
              onClick={() => onDelete(workout._id)}
              title="Delete workout"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="card-kpi-chips">
          <div className="kpi-chip">
            <Clock size={14} className="kpi-chip-icon" />
            <span>{workout.duration} min</span>
          </div>
          <div className="kpi-chip">
            <Flame size={14} className="kpi-chip-icon orange" />
            <span>{workout.caloriesBurned} kcal</span>
          </div>
          {workout.distance != null && workout.distance > 0 && (
            <div className="kpi-chip">
              <MapPin size={14} className="kpi-chip-icon blue" />
              <span>{workout.distance} km</span>
            </div>
          )}
          {exercises.length > 0 && (
            <div className="kpi-chip">
              <Dumbbell size={14} className="kpi-chip-icon green" />
              <span>{exercises.length} exercises</span>
            </div>
          )}
        </div>

        {workout.notes && (
          <p className="card-notes-snippet">"{workout.notes}"</p>
        )}

        {exercises.length > 0 && (
          <div className="card-exercise-accordion">
            <button
              className="accordion-toggle-btn"
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? "Hide Exercises" : `View ${exercises.length} Exercises`}</span>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expanded && (
              <div className="accordion-exercise-list fade-in">
                {exercises.map((ex, idx) => (
                  <div key={ex._id || idx} className="accordion-exercise-item">
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{ex.name}</div>
                    <div className="accordion-exercise-meta">
                      {ex.sets > 0 && <span>{ex.sets} sets</span>}
                      {ex.reps > 0 && <span> • {ex.reps} reps</span>}
                      {ex.weight > 0 && <span> • {ex.weight} kg</span>}
                      {ex.restTime > 0 && <span> • {ex.restTime}s rest</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}