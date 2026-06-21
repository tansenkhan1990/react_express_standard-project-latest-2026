import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useAppSelector';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="page-home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Learning Project</span>
          <h1 className="hero-title">
            Master React.js{' '}
            <span className="gradient-text">Core &amp; Advanced</span>{' '}
            Concepts
          </h1>
          <p className="hero-subtitle">
            A production-grade React application demonstrating modern state
            management with Redux Toolkit, protected routing, form validation,
            and industry best practices.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-illustration">
          <div className="concept-grid">
            <div className="concept-card">
              <span className="concept-icon">🗺️</span>
              <span>Routing</span>
            </div>
            <div className="concept-card">
              <span className="concept-icon">🛡️</span>
              <span>Auth Guards</span>
            </div>
            <div className="concept-card">
              <span className="concept-icon">📦</span>
              <span>Redux</span>
            </div>
            <div className="concept-card">
              <span className="concept-icon">✅</span>
              <span>Validation</span>
            </div>
            <div className="concept-card">
              <span className="concept-icon">🔐</span>
              <span>Private Routes</span>
            </div>
            <div className="concept-card">
              <span className="concept-icon">📋</span>
              <span>Forms</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">What's Inside</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚛️</div>
            <h3>React 19 + TypeScript</h3>
            <p>
              Built with the latest React version and full TypeScript support
              for type safety and better developer experience.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Redux Toolkit</h3>
            <p>
              Centralized state management with Redux Toolkit — including
              createSlice, createAsyncThunk, and typed hooks.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛣️</div>
            <h3>Protected Routing</h3>
            <p>
              Public and private route guards with React Router v6.
              Unauthorized users are redirected to login.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Form Validation</h3>
            <p>
              Client-side validation with real-time error feedback for
              registration and login forms.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>HTTP-Only Cookies</h3>
            <p>
              JWT-based authentication with HTTP-only cookies — secure against
              XSS attacks, with automatic credentials handling.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏗️</div>
            <h3>Best Practices</h3>
            <p>
              Feature-based architecture, separation of concerns, typed Redux,
              axios client layer, and responsive design.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
