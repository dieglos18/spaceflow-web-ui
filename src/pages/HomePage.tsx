import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginDialog } from '@/components/LoginDialog';

export function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-(--app-bg)">
      <div
        className="max-w-lg w-full rounded-xl p-5 sm:p-6 md:p-8 text-center shadow-sm bg-(--app-card)"
      >
        <img
          src="/icon-blue.svg"
          alt="SpaceFlow"
          className="w-20 h-20 mx-auto mb-4 object-contain"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-(--app-text)">
          SpaceFlow
        </h1>
        <p className="mt-4 text-base sm:text-lg text-(--app-text)">
          Reserve your coworking space in one click. Find the perfect spot and book instantly.
        </p>
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full min-w-[160px] px-6 py-2.5 text-sm font-medium text-white bg-primary transition-opacity hover:opacity-90 cursor-pointer sm:min-w-[200px] sm:px-10 sm:py-3 sm:text-base"
        >
          Start
        </button>
      </div>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
}
