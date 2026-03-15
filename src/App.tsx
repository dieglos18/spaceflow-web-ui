import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import './App.css';

function App() {
  const { pathname } = useLocation();
  const { items: breadcrumbItems } = useBreadcrumbs();
  const showDashboardHeader = pathname !== '/' && pathname !== '/admin-login';

  return (
    <div className="min-h-screen bg-(--app-bg) text-(--app-text)">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--app-card)',
            color: 'var(--app-text)',
            border: '1px solid var(--color-border-secondary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'var(--app-card)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: 'var(--app-card)',
            },
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t} position="top-right">
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Close"
                  className="ml-2 p-1 rounded-md text-(--app-text) opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer shrink-0"
                >
                  <span aria-hidden>×</span>
                </button>
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
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
