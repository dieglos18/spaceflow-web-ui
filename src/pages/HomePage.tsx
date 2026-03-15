import { useState } from 'react';
import { LogIn, LayoutGrid } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';

export function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-(--app-bg)">
      <div
        className="max-w-lg w-full rounded-xl p-8 text-center shadow-sm bg-(--app-card)"
      >
        <LayoutGrid
          className="w-20 h-20 mx-auto mb-4 text-primary"
          style={{ color: '#4F46E5' }}
        />
        <h1 className="text-4xl font-bold tracking-tight text-(--app-text)">
          Spaceflow
        </h1>
        <p className="mt-4 text-lg text-(--app-text)">
          Reserve your coworking space in one click. Find the perfect spot and book instantly.
        </p>
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full min-w-[200px] px-10 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#4F46E5' }}
        >
          <LogIn className="w-5 h-5" />
          Login
        </button>
      </div>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setLoginOpen(false)}
      />
    </div>
  );
}
