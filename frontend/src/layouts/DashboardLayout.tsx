import { Outlet } from 'react-router-dom';
import Header from '../components/ui/Header';

const DashboardLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} React Pro. All rights reserved.</p>
          <p className="footer-tech">
            Built with React 19, Redux Toolkit &amp; TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
