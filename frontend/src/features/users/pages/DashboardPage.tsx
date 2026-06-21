import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { formatDate } from '../../../utils/date';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  const stats = [
    { label: 'Account Status', value: 'Active', icon: '🟢' },
    {
      label: 'Member Since',
      value: currentUser?.createdAt
        ? formatDate(currentUser.createdAt)
        : 'N/A',
      icon: '📅',
    },
    { label: 'Account Type', value: 'Standard', icon: '👤' },
  ];

  return (
    <div className="page-dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {currentUser?.name}
          </p>
        </div>
        <Link to="/profile" className="btn btn-outline">
          View Profile
        </Link>
      </div>

      <div className="welcome-card">
        <div className="welcome-avatar">
          {currentUser?.name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?'}
        </div>
        <div className="welcome-info">
          <h2>{currentUser?.name}</h2>
          <p className="welcome-email">{currentUser?.email}</p>
          <p className="welcome-text">
            You are logged in and have access to all private routes. Explore the
            navigation to visit the other protected pages.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-grid">
          <Link to="/profile" className="quick-link-card">
            <span className="ql-icon">👤</span>
            <span className="ql-title">Profile</span>
            <span className="ql-desc">View and manage your profile</span>
          </Link>
          <Link to="/settings" className="quick-link-card">
            <span className="ql-icon">⚙️</span>
            <span className="ql-title">Settings</span>
            <span className="ql-desc">Configure your preferences</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
