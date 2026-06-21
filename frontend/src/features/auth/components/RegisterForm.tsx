import { useActionState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { registerUser } from '../slice';
import { validateRegisterForm } from '../../../utils/validators';
import { useNavigate } from 'react-router-dom';

interface FormState {
  error: string | null;
  fieldErrors: Record<string, string>;
}

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData): Promise<FormState> => {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      const validation = validateRegisterForm({
        name,
        email,
        password,
        confirmPassword,
      });
      if (!validation.valid) {
        return { error: null, fieldErrors: validation.errors };
      }

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
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            className={`form-input ${state.fieldErrors.name ? 'input-error' : ''}`}
            disabled={isPending}
          />
          {state.fieldErrors.name && (
            <span className="field-error">{state.fieldErrors.name}</span>
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
            className={`form-input ${state.fieldErrors.email ? 'input-error' : ''}`}
            disabled={isPending}
          />
          {state.fieldErrors.email && (
            <span className="field-error">{state.fieldErrors.email}</span>
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
            className={`form-input ${state.fieldErrors.password ? 'input-error' : ''}`}
            disabled={isPending}
          />
          {state.fieldErrors.password && (
            <span className="field-error">{state.fieldErrors.password}</span>
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
            className={`form-input ${state.fieldErrors.confirmPassword ? 'input-error' : ''}`}
            disabled={isPending}
          />
          {state.fieldErrors.confirmPassword && (
            <span className="field-error">
              {state.fieldErrors.confirmPassword}
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
    </>
  );
};

export default RegisterForm;
