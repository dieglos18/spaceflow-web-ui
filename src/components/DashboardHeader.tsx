import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const APP_TITLE = 'SpaceFlow';

export function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('spaceflow_admin');
    setMenuOpen(false);
    navigate('/');
  };

  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('spaceflow_admin') === 'true';

  return (
    <header className="fixed top-0 left-0 right-0 z-20 w-full flex items-center justify-between px-4 py-3 bg-(--app-card) text-(--app-text)">
      <div className="flex items-center gap-3">
        <img
          src="/icon-blue.svg"
          alt=""
          className="h-8 w-8 object-contain"
        />
        <h1 className="text-xl font-semibold text-(--app-text) flex items-baseline gap-1.5">
          {APP_TITLE}
          {isAdmin && (
            <span className="text-xs font-normal opacity-80 text-(--app-text)">admin</span>
          )}
        </h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-lg p-2 text-(--app-text) hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Open settings"
          aria-expanded={menuOpen}
        >
          <Settings className="w-6 h-6" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-1 min-w-[180px] rounded-lg shadow-lg bg-(--app-card) border border-gray-400 dark:border-gray-500 py-2"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-gray-400 dark:border-gray-500">
              <span className="text-sm font-medium text-(--app-text)">Theme</span>
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-(--app-card) ${isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-500'}`}
              >
                <span
                  className={`pointer-events-none inline-flex h-5 w-5 items-center justify-center transform rounded-full bg-white shadow ring-0 transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`}
                  aria-hidden
                >
                  {isDark ? (
                    <Moon className="w-3 h-3 text-primary" />
                  ) : (
                    <Sun className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  )}
                </span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-(--app-text) hover:opacity-80 cursor-pointer"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
