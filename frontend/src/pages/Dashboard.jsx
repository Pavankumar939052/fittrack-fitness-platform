import { useEffect, useState } from "react";
import { Activity, Flame, Clock, Dumbbell, TrendingUp } from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [todayResponse, weeklyResponse] = await Promise.all([
          api.get("/progress/today"),
          api.get("/analytics/weekly"),
        ]);
        setProgress(todayResponse.data);
        setWeekly(weeklyResponse.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const todayStats = [
    {
      label: "Today's Workouts",
      value: progress?.total_workouts ?? 0,
      unit: "sessions",
      icon: Dumbbell,
      color: "purple",
    },
    {
      label: "Calories Burned",
      value: progress?.total_calories ?? 0,
      unit: "kcal",
      icon: Flame,
      color: "orange",
    },
    {
      label: "Workout Duration",
      value: progress?.total_duration ?? 0,
      unit: "minutes",
      icon: Clock,
      color: "blue",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Your fitness dashboard</h1>
          <p className="muted">Track your activity and celebrate your progress.</p>
        </div>
        <div className="date-chip">
          <Activity size={16} />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading your fitness data...</div>
      ) : (
        <>
          <div className="stats-grid">
            {todayStats.map(({ label, value, unit, icon: Icon, color }) => (
              <div className="stat-card" key={label}>
                <div className={`stat-icon ${color}`}><Icon size={22} /></div>
                <p className="stat-label">{label}</p>
                <div className="stat-value">{value.toLocaleString()} <span>{unit}</span></div>
                <p className="stat-note">Today's activity</p>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="panel weekly-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">LAST 7 DAYS</p>
                  <h2>Weekly performance</h2>
                </div>
                <div className="panel-icon"><TrendingUp size={20} /></div>
              </div>

              <div className="weekly-stats">
                <div>
                  <span className="weekly-number">{weekly?.total_workouts ?? 0}</span>
                  <span className="weekly-label">Workouts completed</span>
                </div>
                <div>
                  <span className="weekly-number">{(weekly?.total_calories ?? 0).toLocaleString()}</span>
                  <span className="weekly-label">Calories burned</span>
                </div>
                <div>
                  <span className="weekly-number">{weekly?.total_duration ?? 0}</span>
                  <span className="weekly-label">Minutes active</span>
                </div>
              </div>
            </div>

            <div className="panel motivation-panel">
              <div className="motivation-icon"><Flame size={25} /></div>
              <p className="eyebrow">DAILY MOTIVATION</p>
              <h2>Small steps. Big results.</h2>
              <p>Every workout brings you closer to a stronger, healthier you. Keep showing up!</p>
              <span className="motivation-tag">Consistency is key</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
