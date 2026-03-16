import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlaceDetailPage } from './pages/PlaceDetail/PlaceDetailPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { TelemetryDetailPage } from './pages/TelemetryDetailPage';
import { TelemetryPage } from './pages/TelemetryPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000 },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'admin-login', element: <AdminLoginPage /> },
      { path: 'places/:id', element: <PlaceDetailPage /> },
      { path: 'telemetry', element: <TelemetryPage /> },
      { path: 'telemetry/:id', element: <TelemetryDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BreadcrumbProvider>
        <RouterProvider router={router} />
      </BreadcrumbProvider>
    </QueryClientProvider>
  </StrictMode>
);
