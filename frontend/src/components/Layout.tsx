import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
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

const MemoizedLayout = memo(Layout);
MemoizedLayout.displayName = 'Layout';

export default MemoizedLayout;
