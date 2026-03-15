import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <FileQuestion className="w-16 h-16 text-gray-400 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <Link
        to="/"
        className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium"
      >
        Go home
      </Link>
    </div>
  );
}
