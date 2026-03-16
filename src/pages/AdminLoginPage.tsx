import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const EXPECTED_EMAIL = 'admin@admin.com';
const EXPECTED_PASSWORD = 'admin2026';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === EXPECTED_EMAIL && password === EXPECTED_PASSWORD) {
      const token = import.meta.env.VITE_AUTH_BEARER_TOKEN ?? 'your-test-bearer-token';
      localStorage.setItem('auth_token', token);
      localStorage.setItem('spaceflow_admin', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-(--app-bg)">
      <div className="w-full max-w-md rounded-xl p-5 sm:p-6 md:p-8 shadow-xl bg-(--app-card) text-(--app-text)">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/icon-blue.svg"
            alt="SpaceFlow"
            className="w-20 h-18 object-contain"
          />
          <h1 className="mt-3 text-xl font-semibold text-(--app-text) flex items-baseline gap-1.5">
            SpaceFlow
            <span className="text-xs font-normal opacity-80 text-(--app-text)">admin</span>
          </h1>
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-600 mb-6" aria-hidden />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-login-email"
              className="block text-sm font-medium mb-1.5 text-(--app-text)"
            >
              Email
            </label>
            <input
              id="admin-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.com"
              required
              className="input w-full focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="admin-login-password"
              className="block text-sm font-medium mb-1.5 text-(--app-text)"
            >
              Password
            </label>
            <input
              id="admin-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input w-full focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full px-4 py-3 text-sm font-medium text-white bg-primary transition-opacity hover:opacity-90 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
