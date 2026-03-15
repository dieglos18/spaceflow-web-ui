import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import './App.css';

function App() {
  const { pathname } = useLocation();
  const { items: breadcrumbItems } = useBreadcrumbs();
  const showDashboardHeader = pathname !== '/';

  return (
    <div className="min-h-screen bg-(--app-bg) text-(--app-text)">
      {showDashboardHeader && <DashboardHeader />}
      {showDashboardHeader && breadcrumbItems.length > 0 && (
        <div className="fixed top-14 left-0 right-0 z-10 bg-(--app-bg) pt-4 pb-2">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-start">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
      )}
      <main className={showDashboardHeader ? 'pt-24' : ''}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
