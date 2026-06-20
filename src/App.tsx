import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { seedUsers } from './services/userService';
import './App.css';

function App() {
  useEffect(() => {
    seedUsers();
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
