import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity, LayoutDashboard, Dumbbell, Target,
  BarChart3, Bell, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Workouts", path: "/workouts", icon: Dumbbell },
  { label: "Goals", path: "/goals", icon: Target },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Notifications", path: "/notifications", icon: Bell },
];

export default function Layout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><Activity size={22} /></div>
          <span>FitTrack</span>
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <p className="nav-heading">WORKSPACE</p>
        <nav className="sidebar-nav">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/dashboard"}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-avatar">
            {(user.username || "U").charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <strong>{user.username || "Fitness User"}</strong>
            <small>{user.email || "Welcome to FitTrack"}</small>
          </div>
          <button className="logout-button" onClick={logout} title="Logout">
            <LogOut size={19} />
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </button>
          <div>
            <p className="topbar-label">YOUR FITNESS JOURNEY</p>
            <h2>Welcome back, {user.username || "Athlete"}!</h2>
          </div>
          <div className="topbar-status">
            <span className="status-dot" /> Stay consistent
          </div>
        </header>
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
