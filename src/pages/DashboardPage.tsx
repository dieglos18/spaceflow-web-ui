import { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MapPin, Building2, X } from 'lucide-react';
import { getPlaces, createPlace } from '@/api/placesApi';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import { getApiErrorMessage } from '@/utils/errors';
import type { CreatePlaceDto } from '@/types';

export function DashboardPage() {
  const [addPlaceOpen, setAddPlaceOpen] = useState(false);
  const [form, setForm] = useState<CreatePlaceDto>({ name: '', location: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { setItems: setBreadcrumbItems } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbItems([
      { label: 'Home', to: '/dashboard' },
      { label: 'Places' },
    ]);
  }, [setBreadcrumbItems]);

  const { data: places = [], isLoading, error } = useQuery({
    queryKey: ['places'],
    queryFn: getPlaces,
  });

  const createMutation = useMutation({
    mutationFn: createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      setAddPlaceOpen(false);
      setForm({ name: '', location: '' });
      setFormError(null);
    },
  });

  const handleSubmitAddPlace = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const name = form.name?.trim();
    const location = form.location?.trim();
    if (!name) {
      setFormError('Name is required.');
      return;
    }
    if (!location) {
      setFormError('Location is required.');
      return;
    }
    createMutation.mutate({ name, location });
  };

  return (
    <div className="min-h-screen bg-(--app-bg) text-(--app-text) px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-(--app-text) mt-4 mb-6">
          Places
        </h1>

        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4" role="alert">
            {getApiErrorMessage(error)}
          </p>
        )}

        {isLoading ? (
          <p className="text-(--app-text) opacity-80">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Place cards */}
            {places.map((place) => (
              <Link
                key={place.id}
                to={`/places/${place.id}`}
                className="block p-6 rounded-xl bg-(--app-card) border border-gray-300 dark:border-gray-500 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer text-(--app-text)"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-primary" strokeWidth={1} />
                  </div>
                  <h2 className="text-lg font-semibold text-(--app-text)">{place.name}</h2>
                  <div className="flex items-center justify-center gap-1 mt-2 text-sm text-(--app-text) opacity-80">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{place.location}</span>
                  </div>
                </div>
              </Link>
            ))}
            {/* Add place card */}
            <button
              type="button"
              onClick={() => setAddPlaceOpen(true)}
              className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-500 bg-(--app-card) hover:border-primary hover:opacity-90 transition-all cursor-pointer text-(--app-text)"
            >
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" strokeWidth={1} />
              </div>
              <span className="font-semibold text-(--app-text)">Add Place</span>
              <span className="text-sm text-(--app-text) opacity-80 mt-1">Create a new place</span>
            </button>
          </div>
        )}
      </div>

      {/* Add place modal */}
      {addPlaceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-(--app-card) rounded-xl p-6 max-w-md w-full border border-gray-300 dark:border-gray-500 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Place</h2>
              <button
                type="button"
                onClick={() => {
                  setAddPlaceOpen(false);
                  setFormError(null);
                }}
                className="p-1.5 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitAddPlace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input w-full"
                  placeholder="Place name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="input w-full"
                  placeholder="Address or location"
                />
              </div>
              {formError && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {formError}
                </p>
              )}
              {createMutation.isError && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {getApiErrorMessage(createMutation.error)}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="btn btn-primary cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
