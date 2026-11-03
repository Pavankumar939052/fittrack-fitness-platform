import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2, Clock } from "lucide-react";
import api from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications/");
      setNotifications(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update notification.");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to mark notifications as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete notification.");
    }
  };

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">STAY UPDATED</p>
          <h1>Notifications</h1>
          <p className="muted">Your fitness reminders and activity updates.</p>
        </div>
        {unreadCount > 0 && (
          <button className="secondary-button" onClick={markAllRead}>
            <CheckCheck size={17} /> Mark all as read
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="section-heading">
        <h2>Your inbox</h2>
        <span className="count-chip">{unreadCount} unread</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="panel empty-state">
          <Bell size={35} />
          <h3>You're all caught up!</h3>
          <p>New reminders and updates will appear here.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((item) => (
            <div className={`panel notification-card ${item.is_read ? "read" : "unread"}`} key={item.id}>
              <div className="notification-icon"><Bell size={20} /></div>
              <div className="notification-content">
                <div className="notification-title-row">
                  <h3>{item.title}</h3>
                  {!item.is_read && <span className="unread-dot" />}
                </div>
                <p>{item.message}</p>
                <span className="notification-time">
                  <Clock size={13} />
                  {new Date(item.created_at).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="notification-actions">
                {!item.is_read && (
                  <button className="icon-button" title="Mark as read" onClick={() => markRead(item.id)}>
                    <CheckCheck size={17} />
                  </button>
                )}
                <button className="icon-button danger" title="Delete" onClick={() => deleteNotification(item.id)}>
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
