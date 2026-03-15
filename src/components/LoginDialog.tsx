import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

const EXPECTED_EMAIL = 'test@test.com';
const EXPECTED_PASSWORD = 'password2026';

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function LoginDialog({ open, onClose, onSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === EXPECTED_EMAIL && password === EXPECTED_PASSWORD) {
      const token = import.meta.env.VITE_AUTH_BEARER_TOKEN ?? 'your-test-bearer-token';
      localStorage.setItem('auth_token', token);
      onSuccess();
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid email or password. Use test@test.com / password2026');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-md rounded-lg p-6 shadow-lg bg-(--app-card) text-(--app-text)"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-(--app-text)">
            Login
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 hover:opacity-80 transition-opacity text-(--app-text)"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1 text-(--app-text)">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@test.com"
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-(--app-text) focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1 text-(--app-text)">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-(--app-text) focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-(--app-text) transition-colors hover:opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#4F46E5' }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
