import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logoutUser } from '../features/auth/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="header-logo-icon" aria-hidden="true">⚛️</span>
          <span>React Pro</span>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <Link to="/settings" className="nav-link">
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {isAuthenticated && currentUser ? (
            <div className="user-menu">
              <span className="user-greeting">
                Hi, {currentUser.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                type="button"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

const MemoizedHeader = memo(Header);
MemoizedHeader.displayName = 'Header';

export default MemoizedHeader;
