import { useState, FormEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutGrid, Users, Pencil, Trash2, CalendarCheck, DoorClosed } from 'lucide-react';
import { getPlaceById } from '@/api/placesApi';
import { getSpaces } from '@/api/spacesApi';
import { getReservations, deleteReservation, updateReservation } from '@/api/reservationsApi';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import { getApiErrorMessage } from '@/utils/errors';
import type { Reservation, UpdateReservationDto } from '@/types';

const RESERVATIONS_PAGE_SIZE = 50;

export function PlaceDetailPage() {
  const { id: placeId } = useParams<{ id: string }>();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editForm, setEditForm] = useState<UpdateReservationDto>({
    clientEmail: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
  });

  const queryClient = useQueryClient();
  const { setItems: setBreadcrumbItems } = useBreadcrumbs();

  const { data: place, isLoading: placeLoading, error: placeError } = useQuery({
    queryKey: ['place', placeId],
    queryFn: () => getPlaceById(placeId!),
    enabled: !!placeId,
  });

  const { data: spaces = [], isLoading: spacesLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: getSpaces,
    enabled: !!placeId,
  });

  const { data: reservationsData, isLoading: reservationsLoading } = useQuery({
    queryKey: ['reservations', selectedSpaceId],
    queryFn: () => getReservations(1, RESERVATIONS_PAGE_SIZE),
    enabled: !!selectedSpaceId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateReservationDto }) =>
      updateReservation(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setEditingReservation(null);
    },
  });

  const openEdit = (r: Reservation) => {
    setEditingReservation(r);
    setEditForm({
      clientEmail: r.clientEmail,
      reservationDate: r.reservationDate.slice(0, 10),
      startTime: r.startTime.slice(0, 5),
      endTime: r.endTime.slice(0, 5),
    });
  };

  const handleSubmitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;
    updateMutation.mutate({ id: editingReservation.id, body: editForm });
  };

  const spacesForPlace = placeId ? spaces.filter((s) => s.placeId === placeId) : [];
  const reservations = reservationsData?.data ?? [];
  const reservationsForSpace = selectedSpaceId
    ? reservations.filter((r) => r.spaceId === selectedSpaceId)
    : [];

  useEffect(() => {
    if (!placeId) return;
    if (place) {
      setBreadcrumbItems([
        { label: 'Home', to: '/dashboard' },
        { label: 'Places', to: '/dashboard' },
        { label: place.name },
      ]);
    } else {
      setBreadcrumbItems([
        { label: 'Home', to: '/dashboard' },
        { label: 'Places', to: '/dashboard' },
        { label: '...' },
      ]);
    }
  }, [placeId, place, setBreadcrumbItems]);

  if (!placeId) {
    return (
      <div className="min-h-screen bg-(--app-bg) text-(--app-text) p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-(--app-text) opacity-80">Place not found.</p>
        </div>
      </div>
    );
  }

  if (placeLoading || placeError) {
    return (
      <div className="min-h-screen bg-(--app-bg) text-(--app-text) p-6">
        <div className="max-w-7xl mx-auto">
          {placeError && (
            <p className="text-red-600 dark:text-red-400 mb-4" role="alert">
              {getApiErrorMessage(placeError)}
            </p>
          )}
          {placeLoading && <p className="text-(--app-text) opacity-80">Loading...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--app-bg) text-(--app-text) px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-(--app-text) mt-4 mb-6 flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-primary shrink-0" />
          Spaces
        </h1>

        {/* Spaces list */}
        {spacesLoading ? (
          <p className="text-(--app-text) opacity-80 mb-6">Loading spaces...</p>
        ) : spacesForPlace.length === 0 ? (
          <p className="text-(--app-text) opacity-80 mb-6">No spaces in this place.</p>
        ) : (
          <div className="w-screen relative left-1/2 -translate-x-1/2 mb-8 pl-6 pr-6">
            <div className="flex gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">
              {spacesForPlace.map((space) => (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => setSelectedSpaceId((prev) => (prev === space.id ? null : space.id))}
                  className={`group relative text-left rounded-xl border transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md shrink-0 w-[320px] min-w-[320px] h-[180px] snap-start flex flex-col ${selectedSpaceId === space.id
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20 text-(--app-text)'
                    : 'bg-(--app-card) border-gray-300 dark:border-gray-500 hover:border-primary/50 text-(--app-text)'
                    }`}
                >
                  {selectedSpaceId === space.id && (
                    <span
                      className="absolute top-3 right-3 z-10 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white dark:ring-gray-900"
                      aria-hidden
                    />
                  )}
                  <div className="px-5 pt-5 pb-1 flex flex-col h-full min-h-0">
                    <div className="shrink-0 h-[60px] flex items-start gap-3 mb-0">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DoorClosed className="w-6 h-6 text-primary" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="text-sm font-bold text-(--app-text) truncate">{space.name}</h3>
                        <p className="text-[11px] text-(--app-text) opacity-70 mt-1 truncate">{space.reference}</p>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-h-0 border-t border-gray-200 dark:border-gray-600 pt-2.5 space-y-2">
                      {space.capacity != null && (
                        <div className="shrink-0 flex items-center gap-2 text-xs text-(--app-text) opacity-90">
                          <Users className="w-3.5 h-3.5 shrink-0 opacity-75" />
                          <span className="font-medium opacity-80">Capacity</span>
                          <span className="opacity-100">{space.capacity} people</span>
                        </div>
                      )}
                      {space.description ? (
                        <p className="text-xs text-(--app-text) opacity-80 line-clamp-2 leading-relaxed min-h-0 overflow-hidden mb-0 shrink-0">
                          {space.description}
                        </p>
                      ) : (
                        <div className="flex-1 min-h-10" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reservations section */}
        <h2 className="text-xl font-semibold text-(--app-text) mb-3 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-primary shrink-0" />
          Reservations
        </h2>
        <div className="rounded-xl border border-gray-300 dark:border-gray-500 bg-(--app-card) overflow-hidden min-h-[160px] shadow-sm">
          {!selectedSpaceId ? (
            <p className="text-(--app-text) opacity-80 text-center py-10 px-6">
              Select a Space to see its Reservations
            </p>
          ) : reservationsLoading ? (
            <p className="text-(--app-text) opacity-80 py-10 px-6">Loading reservations...</p>
          ) : reservationsForSpace.length === 0 ? (
            <p className="text-(--app-text) opacity-80 py-10 px-6">No reservations for this space.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800/80 border-b border-gray-300 dark:border-gray-500">
                    <th className="py-3.5 px-4 font-semibold text-sm text-(--app-text)">Client email</th>
                    <th className="py-3.5 px-4 font-semibold text-sm text-(--app-text)">Date</th>
                    <th className="py-3.5 px-4 font-semibold text-sm text-(--app-text)">Start</th>
                    <th className="py-3.5 px-4 font-semibold text-sm text-(--app-text)">End</th>
                    <th className="py-3.5 px-4 font-semibold text-sm text-(--app-text) text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservationsForSpace.map((r, index) => (
                    <tr
                      key={r.id}
                      className={`border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''
                        }`}
                    >
                      <td className="py-3 px-4 text-sm text-(--app-text)">{r.clientEmail}</td>
                      <td className="py-3 px-4 text-sm text-(--app-text)">{r.reservationDate.slice(0, 10)}</td>
                      <td className="py-3 px-4 text-sm text-(--app-text)">{r.startTime.slice(0, 5)}</td>
                      <td className="py-3 px-4 text-sm text-(--app-text)">{r.endTime.slice(0, 5)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(r)}
                            title="Edit"
                            className="p-2 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMutation.mutate(r.id)}
                            disabled={deleteMutation.isPending}
                            title="Delete"
                            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit reservation modal */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-(--app-card) rounded-xl p-6 max-w-md w-full border border-gray-300 dark:border-gray-500">
            <h2 className="text-xl font-semibold mb-4">Edit reservation</h2>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client email</label>
                <input
                  type="email"
                  value={editForm.clientEmail}
                  onChange={(e) => setEditForm((f) => ({ ...f, clientEmail: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={editForm.reservationDate}
                  onChange={(e) => setEditForm((f) => ({ ...f, reservationDate: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start time</label>
                  <input
                    type="time"
                    value={editForm.startTime}
                    onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End time</label>
                  <input
                    type="time"
                    value={editForm.endTime}
                    onChange={(e) => setEditForm((f) => ({ ...f, endTime: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
              {updateMutation.isError && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {getApiErrorMessage(updateMutation.error)}
                </p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="btn btn-outline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="btn btn-primary cursor-pointer disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
