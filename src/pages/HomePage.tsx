import { Home } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#F9FAFB]">
      <div className="max-w-lg w-full rounded-xl p-8 text-center shadow-sm bg-white">
        <Home className="w-16 h-16 mx-auto mb-4 text-[#4F46E5]" />
        <h1 className="text-4xl font-bold tracking-tight text-[#111827]">
          Spaceflow
        </h1>
        <p className="mt-4 text-lg text-[#111827]">
          Frontend for coworking reservation system
        </p>
      </div>
    </div>
  );
}
