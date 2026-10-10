import React, { useEffect, useState } from "react";
import { getDailyNutritionSummary, createMeal, getMeals, deleteMeal } from "../services/mealService";
import { UtensilsCrossed, Plus, Trash2, ChevronDown, ChevronUp, Sun, Moon, Coffee, Cookie } from "lucide-react";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const MEAL_ICONS = {
  Breakfast: Sun,
  Lunch: Coffee,
  Dinner: Moon,
  Snacks: Cookie,
};

const MEAL_COLORS = {
  Breakfast: { accent: "#ff8a3d", bg: "rgba(255,138,61,0.08)" },
  Lunch: { accent: "#3ddc97", bg: "rgba(61,220,151,0.08)" },
  Dinner: { accent: "#9f8cff", bg: "rgba(159,140,255,0.08)" },
  Snacks: { accent: "#57b7ff", bg: "rgba(87,183,255,0.08)" },
};

const CALORIE_GOAL = 2200;

const emptyFood = { name: "", quantity: "", calories: "", protein: "", carbohydrates: "", fat: "" };
const initialMeal = {
  mealType: "Breakfast",
  date: new Date().toISOString().split("T")[0],
  foods: [{ ...emptyFood }],
  notes: "",
};

function MacroRing({ value, max, color, label, unit = "g" }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const r = 28, circ = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <svg width={72} height={72} viewBox="0 0 72 72">
          <circle cx={36} cy={36} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth={6} />
          <circle
            cx={36} cy={36} r={r}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease", transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{value}</span>
          <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600 }}>{unit}</span>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</div>
    </div>
  );
}

function MealCard({ meal, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = MEAL_COLORS[meal.mealType] || MEAL_COLORS.Snacks;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid var(--border-card)`,
      borderRadius: 18,
      overflow: "hidden",
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "16px 18px",
          display: "flex", alignItems: "center", gap: 14,
          cursor: "pointer"
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {(() => {
            const IconComponent = MEAL_ICONS[meal.mealType] || UtensilsCrossed;
            return <IconComponent size={18} style={{ color: cfg.accent }} />;
          })()}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{meal.mealType}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
              background: cfg.bg, color: cfg.accent
            }}>
              {meal.foods?.length || 0} items
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {new Date(meal.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </div>

        <div style={{ textAlign: "right", marginRight: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: cfg.accent }}>{meal.totalCalories || 0}</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>KCAL</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(meal._id); }}
            style={{
              background: "rgba(255,95,109,0.08)", border: "1px solid rgba(255,95,109,0.2)",
              borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#ff5f6d"
            }}
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border-subtle)", padding: "14px 18px" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[
              { label: "Protein", value: `${meal.totalProtein || 0}g`, color: "#3ddc97" },
              { label: "Carbs", value: `${meal.totalCarbs || 0}g`, color: "#ff8a3d" },
              { label: "Fat", value: `${meal.totalFat || 0}g`, color: "#9f8cff" },
            ].map(m => (
              <div key={m.label} style={{
                flex: 1, textAlign: "center", padding: "8px 12px",
                background: "var(--bg-subtle)", borderRadius: 10
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {meal.foods?.length > 0 && (
            <div style={{ display: "grid", gap: 6 }}>
              {meal.foods.map((food, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 12px", background: "var(--bg-subtle)", borderRadius: 10
                }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{food.name}</span>
                    {food.quantity && <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>({food.quantity})</span>}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>{food.calories || 0} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Nutrition() {
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [meals, setMeals] = useState([]);
  const [mealForm, setMealForm] = useState(initialMeal);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [daily, mealList] = await Promise.all([
        getDailyNutritionSummary(),
        getMeals({ date: new Date().toISOString().split("T")[0] }),
      ]);
      setSummary(daily.summary || { calories: 0, protein: 0, carbs: 0, fat: 0 });
      setMeals(mealList.meals || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load nutrition data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const updateFood = (index, field, value) => {
    const foods = [...mealForm.foods];
    foods[index] = { ...foods[index], [field]: value };
    setMealForm({ ...mealForm, foods });
  };

  const addFoodRow = () => {
    setMealForm({ ...mealForm, foods: [...mealForm.foods, { ...emptyFood }] });
  };

  const removeFoodRow = (index) => {
    if (mealForm.foods.length === 1) return;
    setMealForm({ ...mealForm, foods: mealForm.foods.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createMeal({
        ...mealForm,
        foods: mealForm.foods.filter(f => f.name.trim()),
      });
      setMealForm(initialMeal);
      setSuccess("Meal logged successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log meal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMeal(id);
      setSuccess("Meal removed");
      setTimeout(() => setSuccess(""), 2000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete meal");
    }
  };

  const calPct = Math.min(100, Math.round((summary.calories / CALORIE_GOAL) * 100));

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-header-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3ddc97, #57b7ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(61,220,151,0.3)"
            }}>
              <UtensilsCrossed size={18} style={{ color: "#08131d" }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Daily Nutrition
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Nutrition Tracking
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Monitor your daily intake — calories, protein, carbs, and fats.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Plus size={16} /> Log Meal
        </button>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {success && <div className="alert-success" style={{ marginBottom: 16 }}>{success}</div>}

      {/* Calorie progress banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(61,220,151,0.06), rgba(87,183,255,0.06))",
        border: "1px solid rgba(61,220,151,0.18)",
        borderRadius: 20, padding: "22px 26px",
        marginBottom: 20,
        display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap"
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
                {summary.calories} <span style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 600 }}>kcal</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>of {CALORIE_GOAL} kcal daily goal</div>
            </div>
            <div style={{
              fontSize: 28, fontWeight: 900, color: calPct >= 100 ? "#ff5f6d" : "#3ddc97"
            }}>
              {calPct}%
            </div>
          </div>
          <div style={{ height: 8, background: "var(--bg-subtle)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 999,
              width: `${calPct}%`,
              background: calPct >= 100
                ? "linear-gradient(90deg, #ff8a3d, #ff5f6d)"
                : "linear-gradient(90deg, #3ddc97, #57b7ff)",
              transition: "width 0.6s ease"
            }} />
          </div>
        </div>

        {/* Macro rings */}
        <div style={{ display: "flex", gap: 20 }}>
          <MacroRing value={summary.protein || 0} max={160} color="#3ddc97" label="Protein" />
          <MacroRing value={summary.carbs || 0} max={280} color="#ff8a3d" label="Carbs" />
          <MacroRing value={summary.fat || 0} max={70} color="#9f8cff" label="Fat" />
        </div>
      </div>

      {/* Log Meal Form (collapsible) */}
      {showForm && (
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border-card)",
          borderRadius: 20, padding: 24, marginBottom: 20
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 20 }}>New Meal Entry</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ marginBottom: 14 }}>
              <div className="form-group">
                <label>Meal Type</label>
                <select
                  className="form-control"
                  value={mealForm.mealType}
                  onChange={e => setMealForm({ ...mealForm, mealType: e.target.value })}
                >
                  {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input className="form-control" type="date" value={mealForm.date}
                  onChange={e => setMealForm({ ...mealForm, date: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10 }}>Food Items</div>
              {mealForm.foods.map((food, index) => (
                <div key={index} style={{
                  background: "var(--bg-subtle)", borderRadius: 14, padding: "14px 16px", marginBottom: 10
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>Item {index + 1}</span>
                    {mealForm.foods.length > 1 && (
                      <button type="button" onClick={() => removeFoodRow(index)}
                        style={{
                          background: "rgba(255,95,109,0.1)", border: "none", borderRadius: 8,
                          padding: "4px 8px", cursor: "pointer", color: "#ff5f6d", fontSize: 12
                        }}>Remove</button>
                    )}
                  </div>
                  <div className="form-row" style={{ marginBottom: 8 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: 11 }}>Food Name *</label>
                      <input className="form-control" placeholder="e.g. Grilled Chicken"
                        value={food.name} onChange={e => updateFood(index, "name", e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: 11 }}>Quantity</label>
                      <input className="form-control" placeholder="e.g. 200g / 1 cup"
                        value={food.quantity} onChange={e => updateFood(index, "quantity", e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { field: "calories", label: "Calories", placeholder: "kcal" },
                      { field: "protein", label: "Protein", placeholder: "g" },
                      { field: "carbohydrates", label: "Carbs", placeholder: "g" },
                      { field: "fat", label: "Fat", placeholder: "g" },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field} className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: 11 }}>{label}</label>
                        <input className="form-control" type="number" min="0" placeholder={placeholder}
                          value={food[field]} onChange={e => updateFood(index, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button type="button" className="btn btn-secondary" onClick={addFoodRow}
                style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> Add Food Item
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save Meal"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meals list */}
      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">Loading meals…</div>
        </div>
      ) : meals.length === 0 ? (
        <div className="empty-state">
          <UtensilsCrossed size={48} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
          <h3>No meals logged today</h3>
          <p>Click "Log Meal" to start tracking your nutrition.</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 14 }}>
            Today's Meals ({meals.length})
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {meals.map(meal => (
              <MealCard key={meal._id} meal={meal} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
