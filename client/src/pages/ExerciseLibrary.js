import React, { useEffect, useState } from "react";
import { getExercises } from "../services/exerciseService";
import { BookOpen, Search, Dumbbell, Zap, Heart, Wind, Move, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORIES = ["All", "Strength", "Cardio", "Flexibility", "HIIT", "Mobility"];
const MUSCLE_GROUPS = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const DIFFICULTY_CONFIG = {
  Beginner:     { color: "#3ddc97", bg: "rgba(61,220,151,0.12)" },
  Intermediate: { color: "#57b7ff", bg: "rgba(87,183,255,0.12)" },
  Advanced:     { color: "#ff8a3d", bg: "rgba(255,138,61,0.14)" },
};

const CATEGORY_ICONS = {
  Strength: Dumbbell,
  Cardio: Heart,
  Flexibility: Move,
  HIIT: Zap,
  Mobility: Wind,
  default: Dumbbell,
};

const CATEGORY_COLORS = {
  Strength:    { color: "#ff8a3d", bg: "rgba(255,138,61,0.1)" },
  Cardio:      { color: "#ff5f6d", bg: "rgba(255,95,109,0.1)" },
  Flexibility: { color: "#9f8cff", bg: "rgba(159,140,255,0.1)" },
  HIIT:        { color: "#ffb84d", bg: "rgba(255,184,77,0.1)" },
  Mobility:    { color: "#57b7ff", bg: "rgba(87,183,255,0.1)" },
  default:     { color: "#3ddc97", bg: "rgba(61,220,151,0.1)" },
};

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px", borderRadius: 999, border: "1px solid",
        fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
        background: active ? "rgba(61,220,151,0.12)" : "transparent",
        borderColor: active ? "rgba(61,220,151,0.3)" : "var(--border-card)",
        color: active ? "#3ddc97" : "var(--text-secondary)",
        whiteSpace: "nowrap"
      }}
    >
      {label}
    </button>
  );
}

function ExerciseCard({ exercise }) {
  const [expanded, setExpanded] = useState(false);
  const diff = DIFFICULTY_CONFIG[exercise.difficulty] || DIFFICULTY_CONFIG.Beginner;
  const cat = CATEGORY_COLORS[exercise.category] || CATEGORY_COLORS.default;
  const CatIcon = CATEGORY_ICONS[exercise.category] || CATEGORY_ICONS.default;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-card)",
      borderRadius: 18,
      overflow: "hidden",
      transition: "transform 0.2s ease, border-color 0.2s ease",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(110,231,168,0.2)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-card)"}
    >
      {/* Color accent strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />

      <div style={{ padding: "18px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CatIcon size={18} style={{ color: cat.color }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
                {exercise.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {exercise.category}
              </div>
            </div>
          </div>

          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
            background: diff.bg, color: diff.color, flexShrink: 0
          }}>
            {exercise.difficulty?.toUpperCase()}
          </span>
        </div>

        {/* Metrics */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8, marginBottom: 12
        }}>
          <div style={{ background: "var(--bg-subtle)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{exercise.muscleGroup}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>MUSCLE</div>
          </div>
          <div style={{ background: "var(--bg-subtle)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#ff8a3d" }}>
              {exercise.caloriesPerMinute || "—"}
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>KCAL/MIN</div>
          </div>
          <div style={{ background: "var(--bg-subtle)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", lineHeight: 1.2 }}>
              {exercise.equipment || "Bodyweight"}
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, marginTop: 2 }}>EQUIPMENT</div>
          </div>
        </div>

        {/* Instructions toggle */}
        {exercise.instructions?.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "transparent", border: "none", padding: 0,
                fontSize: 12, fontWeight: 600, color: "var(--text-muted)",
                cursor: "pointer", transition: "color 0.15s"
              }}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? "Hide" : "Show"} instructions ({exercise.instructions.length} steps)
            </button>

            {expanded && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
                  {exercise.instructions.map((step, i) => (
                    <li key={i} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [muscleGroup, setMuscleGroup] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getExercises({
          category: category !== "All" ? category : undefined,
          muscleGroup: muscleGroup !== "All" ? muscleGroup : undefined,
          difficulty: difficulty !== "All" ? difficulty : undefined,
          search: debouncedSearch || undefined,
        });
        setExercises(data.exercises || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, muscleGroup, difficulty, debouncedSearch]);

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #9f8cff, #57b7ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(159,140,255,0.3)"
            }}>
              <BookOpen size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Exercise Library
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Exercise Collection
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Browse and filter {exercises.length}+ exercises for your training sessions.
          </p>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Filters */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-card)",
        borderRadius: 20, padding: "20px 22px", marginBottom: 22
      }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            className="form-control"
            style={{ paddingLeft: 38 }}
            placeholder="Search exercises by name, muscle group, or equipment…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>
              Category
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <FilterChip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>
                Muscle Group
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {MUSCLE_GROUPS.map(m => (
                  <FilterChip key={m} label={m} active={muscleGroup === m} onClick={() => setMuscleGroup(m)} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>
                Difficulty
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {DIFFICULTIES.map(d => (
                  <FilterChip key={d} label={d} active={difficulty === d} onClick={() => setDifficulty(d)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, fontWeight: 600 }}>
          {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} found
        </div>
      )}

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading exercises…</div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
          <h3>No exercises found</h3>
          <p>Try adjusting your search or filter settings.</p>
          <button
            className="btn btn-secondary"
            style={{ marginTop: 12 }}
            onClick={() => { setSearch(""); setCategory("All"); setMuscleGroup("All"); setDifficulty("All"); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {exercises.map(exercise => (
            <ExerciseCard key={exercise._id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
