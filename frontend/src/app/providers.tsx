import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { ToastProvider } from '../components/ui/Toast';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Composes all top-level providers into a single wrapper.
 */
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <ToastProvider>{children}</ToastProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

export default Providers;
