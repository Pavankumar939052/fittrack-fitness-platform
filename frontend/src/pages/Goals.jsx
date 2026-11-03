import { useEffect, useState } from "react";
import { Plus, Target, Trash2, TrendingUp, CheckCircle2 } from "lucide-react";
import api from "../services/api";

const emptyForm = {
  goal_type: "Weight Loss",
  target_value: "",
  current_value: "",
  deadline: "",
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGoals = async () => {
    try {
      const response = await api.get("/goals/");
      setGoals(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("/goals/", {
        ...form,
        target_value: Number(form.target_value),
        current_value: Number(form.current_value || 0),
      });
      setForm(emptyForm);
      setShowForm(false);
      await loadGoals();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create goal.");
    } finally {
      setSaving(false);
    }
  };

  const updateProgress = async (goal) => {
    const value = window.prompt(
      "Enter your current progress value:",
      String(goal.current_value)
    );

    if (value === null) return;
    if (value.trim() === "" || !Number.isFinite(Number(value)) || Number(value) < 0) {
      setError("Please enter a valid non-negative number.");
      return;
    }

    try {
      await api.put(`/goals/${goal.id}`, {
        current_value: Number(value),
      });
      await loadGoals();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update goal.");
    }
  };

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this fitness goal?")) return;

    try {
      await api.delete(`/goals/${id}`);
      await loadGoals();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete goal.");
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR TARGETS</p>
          <h1>Fitness goals</h1>
          <p className="muted">Set meaningful targets and keep moving forward.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Create goal
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="panel form-panel">
          <h2>Create a fitness goal</h2>
          <form className="data-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Goal type</label>
                <select
                  value={form.goal_type}
                  onChange={(e) => setForm({ ...form, goal_type: e.target.value })}
                >
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Steps</option>
                </select>
              </div>
              <div>
                <label>Target value</label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={form.target_value}
                  onChange={(e) => setForm({ ...form, target_value: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Current value</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.current_value}
                  onChange={(e) => setForm({ ...form, current_value: e.target.value })}
                />
              </div>
              <div>
                <label>Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="primary-button" disabled={saving}>
                {saving ? "Saving..." : "Save goal"}
              </button>
              <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="section-heading">
        <h2>Your goals</h2>
        <span className="count-chip">{goals.length} goals</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="panel empty-state">
          <Target size={35} />
          <h3>No goals set yet</h3>
          <p>Create your first goal and start tracking your progress.</p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const percentage = goal.target_value > 0
              ? Math.min(100, Math.max(0, (goal.current_value / goal.target_value) * 100))
              : 0;
            const completed = goal.status === "COMPLETED";

            return (
              <div className="panel goal-card" key={goal.id}>
                <div className="goal-card-top">
                  <div className="stat-icon purple"><Target size={21} /></div>
                  <span className={completed ? "status-chip completed" : "status-chip"}>
                    {completed ? <CheckCircle2 size={14} /> : <TrendingUp size={14} />}
                    {goal.status}
                  </span>
                </div>
                <p className="eyebrow">FITNESS TARGET</p>
                <h3>{goal.goal_type}</h3>
                <div className="goal-values">
                  <strong>{goal.current_value}</strong>
                  <span> / {goal.target_value}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percentage}%` }} />
                </div>
                <p className="goal-percentage">{percentage.toFixed(0)}% completed</p>
                <p className="goal-deadline">Deadline: {String(goal.deadline).slice(0, 10)}</p>
                <div className="goal-actions">
                  {!completed && (
                    <button className="secondary-button" onClick={() => updateProgress(goal)}>
                      Update progress
                    </button>
                  )}
                  <button className="icon-button danger" title="Delete goal" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
