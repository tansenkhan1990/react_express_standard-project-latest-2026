import { useState, useCallback } from 'react';
import { useToast } from '../components/Toast';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { showToast } = useToast();

  const handleSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      showToast('Settings saved successfully!', 'success');
    },
    [showToast]
  );

  return (
    <div className="page-settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your application preferences</p>
      </div>

      <div className="settings-card">
        <h2>Preferences</h2>
        <form onSubmit={handleSave} className="settings-form">
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Email Notifications</span>
              <span className="setting-desc">
                Receive email notifications about account activity
              </span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Dark Mode</span>
              <span className="setting-desc">
                Switch to a dark color scheme (coming soon)
              </span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                disabled
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Session Management</span>
              <span className="setting-desc">
                Your session persists across page refreshes via localStorage
              </span>
            </div>
            <span className="setting-badge">Active</span>
          </div>

          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
