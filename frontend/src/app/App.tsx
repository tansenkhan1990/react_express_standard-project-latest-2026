import { useEffect } from 'react';
import Providers from './providers';
import AppRoutes from '../routes';
import { fetchCurrentUser } from '../features/auth/slice';
import { store } from '../store';
import '../App.css';

function App() {
  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);

  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
