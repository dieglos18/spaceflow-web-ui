import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-(--app-bg) text-(--app-text)">
      <header className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </header>
      <Outlet />
    </div>
  );
}

export default App;
