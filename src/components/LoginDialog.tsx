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
      setError('Invalid email or password.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-lg min-h-[360px] sm:min-h-[420px] rounded-xl p-5 sm:p-6 md:p-8 shadow-xl bg-(--app-card) text-(--app-text) flex flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded p-1.5 hover:opacity-80 transition-opacity text-(--app-text) cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold text-(--app-text) mb-2">
          Welcome
        </h2>
        <div className="h-px bg-gray-200 dark:bg-gray-600 mb-8" aria-hidden />

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-1.5 text-(--app-text)">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@test.com"
                required
                className="input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-1.5 text-(--app-text)">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="mt-auto pt-6">
            <button
              type="submit"
              className="w-full rounded-full px-4 py-3 text-sm font-medium text-white bg-primary transition-opacity hover:opacity-90 cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
