import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Dumbbell, Flame, Clock } from "lucide-react";
import api from "../services/api";

const emptyForm = {
  workout_name: "",
  category: "Cardio",
  duration: "",
  calories_burned: "",
  workout_date: new Date().toISOString().slice(0, 10),
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadWorkouts = async () => {
    try {
      const response = await api.get("/workouts/");
      setWorkouts(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load workouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      duration: Number(form.duration),
      calories_burned: Number(form.calories_burned),
    };

    try {
      if (editingId) {
        await api.put(`/workouts/${editingId}`, payload);
      } else {
        await api.post("/workouts/", payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await loadWorkouts();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save workout.");
    } finally {
      setSaving(false);
    }
  };

  const editWorkout = (workout) => {
    setForm({
      workout_name: workout.workout_name,
      category: workout.category,
      duration: workout.duration,
      calories_burned: workout.calories_burned,
      workout_date: String(workout.workout_date).slice(0, 10),
    });
    setEditingId(workout.id);
    setShowForm(true);
  };

  const deleteWorkout = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await api.delete(`/workouts/${id}`);
      await loadWorkouts();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete workout.");
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ACTIVITY TRACKER</p>
          <h1>My workouts</h1>
          <p className="muted">Record, manage and review your fitness sessions.</p>
        </div>
        <button className="primary-button" onClick={() => {
          cancelForm();
          setShowForm(true);
        }}>
          <Plus size={18} /> Add workout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="panel form-panel">
          <div className="panel-heading">
            <h2>{editingId ? "Edit workout" : "Record a workout"}</h2>
            <button className="text-button" onClick={cancelForm}>Cancel</button>
          </div>

          <form className="data-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Workout name</label>
                <input
                  value={form.workout_name}
                  onChange={(e) => setForm({ ...form, workout_name: e.target.value })}
                  placeholder="e.g. Morning Running"
                  required
                />
              </div>
              <div>
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>Cardio</option>
                  <option>Strength</option>
                  <option>Yoga</option>
                </select>
              </div>
              <div>
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Calories burned</label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={form.calories_burned}
                  onChange={(e) => setForm({ ...form, calories_burned: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Workout date</label>
                <input
                  type="date"
                  value={form.workout_date}
                  onChange={(e) => setForm({ ...form, workout_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <button className="primary-button" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update workout" : "Save workout"}
            </button>
          </form>
        </div>
      )}

      <div className="section-heading">
        <h2>Workout history</h2>
        <span className="count-chip">{workouts.length} sessions</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading workouts...</div>
      ) : workouts.length === 0 ? (
        <div className="panel empty-state">
          <Dumbbell size={35} />
          <h3>No workouts yet</h3>
          <p>Add your first workout to start tracking your fitness journey.</p>
        </div>
      ) : (
        <div className="workout-list">
          {workouts.map((workout) => (
            <div className="panel workout-card" key={workout.id}>
              <div className="workout-symbol"><Dumbbell size={22} /></div>
              <div className="workout-info">
                <h3>{workout.workout_name}</h3>
                <span className="category-chip">{workout.category}</span>
                <p>{String(workout.workout_date).slice(0, 10)}</p>
              </div>
              <div className="workout-metric">
                <Clock size={16} />
                <strong>{workout.duration}</strong>
                <span>min</span>
              </div>
              <div className="workout-metric">
                <Flame size={16} />
                <strong>{workout.calories_burned}</strong>
                <span>kcal</span>
              </div>
              <div className="workout-actions">
                <button className="icon-button" title="Edit" onClick={() => editWorkout(workout)}>
                  <Pencil size={17} />
                </button>
                <button className="icon-button danger" title="Delete" onClick={() => deleteWorkout(workout.id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
