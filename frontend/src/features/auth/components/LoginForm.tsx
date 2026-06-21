import { useActionState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { loginUser } from '../slice';
import { validateLoginForm } from '../../../utils/validators';
import { useNavigate } from 'react-router-dom';

interface FormState {
  error: string | null;
  fieldErrors: Record<string, string>;
}

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const validation = validateLoginForm({ email, password });
      if (!validation.valid) {
        return { error: null, fieldErrors: validation.errors };
      }

      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard', { replace: true });
        return { error: null, fieldErrors: {} };
      }

      return { error: result.payload || 'Login failed', fieldErrors: {} };
    },
    { error: null, fieldErrors: {} }
  );

  return (
    <>
      {state.error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{state.error}</span>
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
            className={`form-input ${state.fieldErrors.email ? 'input-error' : ''}`}
            disabled={isPending}
          />
          {state.fieldErrors.email && (
            <span className="field-error">{state.fieldErrors.email}</span>
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
            className={`form-input ${state.fieldErrors.password ? 'input-error' : ''}`}
            disabled={isPending}
          />
          {state.fieldErrors.password && (
            <span className="field-error">{state.fieldErrors.password}</span>
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
    </>
  );
};

export default LoginForm;
