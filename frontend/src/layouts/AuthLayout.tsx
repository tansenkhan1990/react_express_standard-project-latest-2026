import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} React Pro. All rights reserved.</p>
          <p className="footer-tech">Built with React 19, Redux Toolkit &amp; TypeScript</p>
        </div>
      </footer>
    </div>
  );
};

const MemoizedAuthLayout = memo(AuthLayout);
MemoizedAuthLayout.displayName = 'AuthLayout';

export default MemoizedAuthLayout;
