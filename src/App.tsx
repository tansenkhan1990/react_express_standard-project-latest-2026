import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { fetchCurrentUser } from './features/auth/authSlice';
import './App.css';

function App() {
  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
