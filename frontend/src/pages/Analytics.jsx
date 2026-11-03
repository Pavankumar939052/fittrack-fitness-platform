import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { BarChart3, Flame, Dumbbell, Clock } from "lucide-react";
import api from "../services/api";

const COLORS = ["#7657e8", "#f59e0b", "#20b894", "#3b82f6"];

export default function Analytics() {
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [weeklyRes, monthlyRes, categoriesRes] = await Promise.all([
          api.get("/analytics/weekly"),
          api.get("/analytics/monthly"),
          api.get("/analytics/categories"),
        ]);

        setWeekly(weeklyRes.data);
        setMonthly(monthlyRes.data);
        const categoryData = categoriesRes.data;
        setCategories(Array.isArray(categoryData) ? categoryData : categoryData.categories || []);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const stats = [
    { label: "Weekly workouts", value: weekly?.total_workouts ?? 0, icon: Dumbbell, color: "purple" },
    { label: "Weekly calories", value: weekly?.total_calories ?? 0, icon: Flame, color: "orange" },
    { label: "Weekly minutes", value: weekly?.total_duration ?? 0, icon: Clock, color: "blue" },
  ];

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PERFORMANCE INSIGHTS</p>
          <h1>Analytics & reports</h1>
          <p className="muted">Understand your activity and measure your progress.</p>
        </div>
        <div className="date-chip"><BarChart3 size={17} /> Activity reports</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-state">Preparing your reports...</div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div className="stat-card" key={label}>
                <div className={`stat-icon ${color}`}><Icon size={22} /></div>
                <p className="stat-label">{label}</p>
                <div className="stat-value">{Number(value).toLocaleString()}</div>
                <p className="stat-note">Last 7 days</p>
              </div>
            ))}
          </div>

          <div className="analytics-grid">
            <div className="panel chart-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">CURRENT MONTH</p>
                  <h2>Monthly performance</h2>
                </div>
              </div>
              <div className="monthly-summary">
                <div>
                  <span>{monthly?.total_workouts ?? 0}</span>
                  <small>Workouts</small>
                </div>
                <div>
                  <span>{Number(monthly?.total_calories ?? 0).toLocaleString()}</span>
                  <small>Calories</small>
                </div>
                <div>
                  <span>{monthly?.total_duration ?? 0}</span>
                  <small>Minutes</small>
                </div>
              </div>
            </div>

            <div className="panel chart-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">WORKOUT BREAKDOWN</p>
                  <h2>Category distribution</h2>
                </div>
              </div>
              {categories.length === 0 ? (
                <div className="chart-empty">No category data available yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="total_workouts"
                      nameKey="category"
                      cx="50%"
                      cy="48%"
                      outerRadius={82}
                      innerRadius={48}
                      paddingAngle={4}
                    >
                      {categories.map((item, index) => (
                        <Cell key={item.category || index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="panel chart-panel category-chart">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">CALORIES BY CATEGORY</p>
                  <h2>Workout intensity</h2>
                </div>
              </div>
              {categories.length === 0 ? (
                <div className="chart-empty">Add workouts to see category statistics.</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categories} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_calories" name="Calories" fill="#7657e8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
