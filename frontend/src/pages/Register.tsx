import { useState, useEffect, useActionState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { registerUser, clearError } from '../features/auth/authSlice';
import { validateRegisterForm } from '../utils/validators';
import type { RegisterData } from '../types';

interface RegisterFormState {
  error: string | null;
  fieldErrors: Record<string, string>;
}

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      _prevState: RegisterFormState,
      formData_: FormData
    ): Promise<RegisterFormState> => {
      const name = formData_.get('name') as string;
      const email = formData_.get('email') as string;
      const password = formData_.get('password') as string;
      const confirmPassword = formData_.get('confirmPassword') as string;

      // Validate
      const validation = validateRegisterForm({
        name,
        email,
        password,
        confirmPassword,
      });
      if (!validation.valid) {
        return { error: null, fieldErrors: validation.errors };
      }

      // Dispatch Redux thunk
      const result = await dispatch(
        registerUser({ name, email, password, confirmPassword })
      );

      if (registerUser.fulfilled.match(result)) {
        navigate('/dashboard', { replace: true });
        return { error: null, fieldErrors: {} };
      }

      return {
        error: result.payload || 'Registration failed',
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
      const result = validateRegisterForm({ ...formData, [name]: value });
      setFieldErrors((prev) => ({
        ...prev,
        [name]: result.errors[name] || '',
      }));
    }

    // Re-validate confirmPassword when either password field changes
    if (
      (name === 'password' || name === 'confirmPassword') &&
      touched.confirmPassword
    ) {
      const newFormData = { ...formData, [name]: value };
      const result = validateRegisterForm(newFormData);
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: result.errors.confirmPassword || '',
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const result = validateRegisterForm(formData);
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
          <h1>Create Account</h1>
          <p>Register to get started with the platform</p>
        </div>

        {displayError && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{displayError}</span>
          </div>
        )}

        <form action={formAction} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${displayFieldErrors.name && touched.name ? 'input-error' : ''}`}
              disabled={isPending}
            />
            {displayFieldErrors.name && touched.name && (
              <span className="field-error">{displayFieldErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${displayFieldErrors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`}
              disabled={isPending}
            />
            {displayFieldErrors.confirmPassword && touched.confirmPassword && (
              <span className="field-error">
                {displayFieldErrors.confirmPassword}
              </span>
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
