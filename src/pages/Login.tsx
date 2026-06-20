import { useState, useEffect, useActionState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { loginUser, clearError } from '../features/auth/authSlice';
import { validateLoginForm } from '../utils/validators';
import type { LoginCredentials } from '../types';

interface LoginFormState {
  error: string | null;
  fieldErrors: Record<string, string>;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const [state, formAction, isPending] = useActionState(
    async (
      _prevState: LoginFormState,
      formData_: FormData
    ): Promise<LoginFormState> => {
      const email = formData_.get('email') as string;
      const password = formData_.get('password') as string;

      // Validate
      const validation = validateLoginForm({ email, password });
      if (!validation.valid) {
        return { error: null, fieldErrors: validation.errors };
      }

      // Dispatch Redux thunk
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard', { replace: true });
        return { error: null, fieldErrors: {} };
      }

      return {
        error: result.payload || 'Login failed',
        fieldErrors: {},
      };
    },
    { error: null, fieldErrors: {} }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only validate on change if the field has been blurred at least once
    if (touched[name]) {
      const result = validateLoginForm({ ...formData, [name]: value });
      setFieldErrors((prev) => ({
        ...prev,
        [name]: result.errors[name] || '',
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const result = validateLoginForm(formData);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: result.errors[name] || '',
    }));
  };

  const displayError = state.error;
  const displayFieldErrors = {
    ...fieldErrors,
    ...state.fieldErrors,
  };

  return (
    <div className="page-auth">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>

        {displayError && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{displayError}</span>
          </div>
        )}

        <form action={formAction} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${displayFieldErrors.email && touched.email ? 'input-error' : ''}`}
              disabled={isPending}
            />
            {displayFieldErrors.email && touched.email && (
              <span className="field-error">{displayFieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${displayFieldErrors.password && touched.password ? 'input-error' : ''}`}
              disabled={isPending}
            />
            {displayFieldErrors.password && touched.password && (
              <span className="field-error">{displayFieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isPending}
          >
            {isPending ? (
              <span className="btn-loading">
                <span className="spinner" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create one
            </Link>
          </p>
          <p className="auth-hint">
            Demo: <strong>demo@example.com</strong> /{' '}
            <strong>password123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
