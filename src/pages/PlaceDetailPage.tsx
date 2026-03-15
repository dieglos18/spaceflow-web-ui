import { useState, FormEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';
import { Users, Pencil, Trash2, CalendarCheck, DoorClosed, Plus, X, Activity, LayoutPanelLeft } from 'lucide-react';
import { getPlaceById } from '@/api/placesApi';
import { getSpaces, createSpace } from '@/api/spacesApi';
import { getTelemetry } from '@/api/telemetryApi';
import toast from 'react-hot-toast';
import { getReservations, deleteReservation, updateReservation, createReservation } from '@/api/reservationsApi';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { getApiErrorMessage } from '@/utils/errors';
import type { Reservation, UpdateReservationDto, CreateReservationDto, CreateSpaceDto } from '@/types';

const RESERVATIONS_PAGE_SIZE = 50;
const TELEMETRY_PAGE_SIZE = 20;

export function PlaceDetailPage() {
  const { id: placeId } = useParams<{ id: string }>();
  const isAdmin = useIsAdmin();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [createReservationOpen, setCreateReservationOpen] = useState(false);
  const [addSpaceOpen, setAddSpaceOpen] = useState(false);
  const [spaceForm, setSpaceForm] = useState<CreateSpaceDto>({ placeId: '', name: '', reference: '', capacity: undefined, description: '' });
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [editForm, setEditForm] = useState<UpdateReservationDto>({
    clientEmail: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
  });
  const [createForm, setCreateForm] = useState<CreateReservationDto>({
    spaceId: '',
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
      setReservationToDelete(null);
      setDeleteConfirmText('');
      toast.success('Reservation deleted successfully');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateReservationDto }) =>
      updateReservation(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setEditingReservation(null);
      toast.success('Reservation updated successfully');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const createMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setCreateReservationOpen(false);
      setCreateForm({ spaceId: '', clientEmail: '', reservationDate: '', startTime: '', endTime: '' });
      toast.success('Reservation created successfully');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const createSpaceMutation = useMutation({
    mutationFn: createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      setAddSpaceOpen(false);
      setSpaceForm({ placeId: placeId ?? '', name: '', reference: '', capacity: undefined, description: '' });
      toast.success('Space created successfully');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const { data: telemetryData } = useQuery({
    queryKey: ['telemetry', selectedSpaceId],
    queryFn: () => getTelemetry(1, TELEMETRY_PAGE_SIZE, selectedSpaceId ?? undefined),
    enabled: !!isAdmin && !!selectedSpaceId,
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

  const handleOpenCreate = () => {
    if (selectedSpaceId) {
      setCreateForm({ spaceId: selectedSpaceId, clientEmail: '', reservationDate: '', startTime: '', endTime: '' });
      setCreateReservationOpen(true);
    }
  };

  const handleSubmitCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSpaceId) return;
    createMutation.mutate({ ...createForm, spaceId: selectedSpaceId });
  };

  const handleSubmitAddSpace = (e: FormEvent) => {
    e.preventDefault();
    if (!placeId) return;
    const payload: CreateSpaceDto = {
      placeId,
      name: spaceForm.name.trim(),
      reference: spaceForm.reference.trim(),
    };
    const cap = spaceForm.capacity;
    if (typeof cap === 'number' && !Number.isNaN(cap)) payload.capacity = cap;
    if (spaceForm.description?.trim()) payload.description = spaceForm.description.trim();
    createSpaceMutation.mutate(payload);
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
    <div className="min-h-screen bg-(--app-bg) text-(--app-text) px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-(--app-text) flex items-center gap-2">
            <LayoutPanelLeft className="w-6 h-6 text-primary shrink-0" />
            Spaces
          </h1>
          {isAdmin && placeId && (
            <button
              type="button"
              onClick={() => {
                setSpaceForm({ placeId, name: '', reference: '', capacity: undefined, description: '' });
                setAddSpaceOpen(true);
              }}
              className="btn btn-primary cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Add space
            </button>
          )}
        </div>

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
                    ? 'bg-(--app-card) border-primary ring-1 ring-primary/10 dark:ring-2 dark:ring-primary/20 text-(--app-text)'
                    : 'bg-(--app-card) border-gray-400 dark:border-gray-500 hover:border-primary/40 text-(--app-text)'
                    }`}
                >
                  {selectedSpaceId === space.id && (
                    <span
                      className="absolute top-3 right-3 z-10 w-2.5 h-2.5 rounded-full bg-primary"
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
                    <div className="flex flex-col flex-1 min-h-0 border-t border-gray-400 dark:border-gray-600 pt-2.5 space-y-2">
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

        {/* Telemetry section (admin only) */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-(--app-text) flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-primary shrink-0" />
              Telemetry
            </h2>
            <div className="rounded-xl border border-gray-400 dark:border-gray-500 bg-(--app-card) overflow-hidden shadow-sm">
              {!selectedSpaceId ? (
                <p className="text-(--app-text) opacity-80 text-center py-10 px-6">
                  Select a space to see its telemetry
                </p>
              ) : !telemetryData ? (
                <p className="text-(--app-text) opacity-80 text-center py-10 px-6">Loading telemetry...</p>
              ) : telemetryData.data.length === 0 ? (
                <p className="text-(--app-text) opacity-80 text-center py-10 px-6">No telemetry for this space.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="table-header-row">
                        <th className="py-3 px-4 text-sm">Time</th>
                        <th className="py-3 px-4 text-sm">People</th>
                        <th className="py-3 px-4 text-sm">Temp (°C)</th>
                        <th className="py-3 px-4 text-sm">Humidity (%)</th>
                        <th className="py-3 px-4 text-sm">CO₂</th>
                        <th className="py-3 px-4 text-sm">Battery (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {telemetryData.data.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-400 dark:border-gray-600 last:border-b-0 transition-colors bg-white dark:bg-transparent"
                        >
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">
                            {new Date(row.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{row.peopleCount}</td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{row.temperature ?? '—'}</td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{row.humidity ?? '—'}</td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{row.co2 ?? '—'}</td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{row.battery ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reservations section */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-(--app-text) flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary shrink-0" />
            Reservations
          </h2>
          {selectedSpaceId && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="btn btn-primary cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Book reservation
            </button>
          )}
        </div>
        <div className="rounded-xl border border-gray-400 dark:border-gray-500 bg-(--app-card) overflow-hidden min-h-[160px] shadow-sm">
          {!selectedSpaceId ? (
            <p className="text-(--app-text) opacity-80 text-center py-10 px-6 flex items-center justify-center min-h-[160px]">
              Select a Space to see its Reservations
            </p>
          ) : reservationsLoading ? (
            <p className="text-(--app-text) opacity-80 text-center py-10 px-6 flex items-center justify-center min-h-[160px]">Loading reservations...</p>
          ) : reservationsForSpace.length === 0 ? (
            <p className="text-(--app-text) opacity-80 text-center py-10 px-6 flex items-center justify-center min-h-[160px]">No reservations for this space.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="table-header-row">
                    <th className="py-3.5 px-4 text-sm">Client email</th>
                    <th className="py-3.5 px-4 text-sm">Date</th>
                    <th className="py-3.5 px-4 text-sm">Start</th>
                    <th className="py-3.5 px-4 text-sm">End</th>
                    <th className="py-3.5 px-4 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservationsForSpace.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-400 dark:border-gray-600 last:border-b-0 transition-colors bg-white dark:bg-transparent"
                    >
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{r.clientEmail}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{r.reservationDate.slice(0, 10)}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{r.startTime.slice(0, 5)}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-(--app-text)">{r.endTime.slice(0, 5)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(r)}
                            data-tooltip-id="edit-reservation"
                            data-tooltip-content="Edit reservation"
                            aria-label="Edit reservation"
                            className="p-2 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-(--color-bg-hover) transition-colors cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReservationToDelete(r);
                              setDeleteConfirmText('');
                            }}
                            disabled={deleteMutation.isPending}
                            data-tooltip-id="delete-reservation"
                            data-tooltip-content="Delete reservation"
                            aria-label="Delete reservation"
                            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-(--color-danger-bg) transition-colors cursor-pointer disabled:opacity-50"
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
          <div className="bg-(--app-card) text-(--app-text) rounded-xl p-6 max-w-md w-full border border-gray-400 dark:border-gray-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-(--app-text)">Edit reservation</h2>
              <button
                type="button"
                onClick={() => setEditingReservation(null)}
                className="p-1.5 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
              <div className="flex justify-end">
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

      {/* Add space modal (admin only) */}
      {isAdmin && addSpaceOpen && placeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-(--app-card) text-(--app-text) rounded-xl p-6 max-w-md w-full border border-gray-400 dark:border-gray-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-(--app-text)">Add space</h2>
              <button
                type="button"
                onClick={() => setAddSpaceOpen(false)}
                className="p-1.5 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitAddSpace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-(--app-text)">Name</label>
                <input
                  type="text"
                  value={spaceForm.name}
                  onChange={(e) => setSpaceForm((f) => ({ ...f, name: e.target.value }))}
                  className="input w-full"
                  placeholder="Space name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--app-text)">Reference</label>
                <input
                  type="text"
                  value={spaceForm.reference}
                  onChange={(e) => setSpaceForm((f) => ({ ...f, reference: e.target.value }))}
                  className="input w-full"
                  placeholder="e.g. ROOM-01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--app-text)">Capacity (optional)</label>
                <input
                  type="number"
                  min={1}
                  value={spaceForm.capacity ?? ''}
                  onChange={(e) => setSpaceForm((f) => ({ ...f, capacity: e.target.value === '' ? undefined : Number(e.target.value) }))}
                  className="input w-full"
                  placeholder="Number of people"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--app-text)">Description (optional)</label>
                <input
                  type="text"
                  value={spaceForm.description ?? ''}
                  onChange={(e) => setSpaceForm((f) => ({ ...f, description: e.target.value }))}
                  className="input w-full"
                  placeholder="Short description"
                />
              </div>
              {createSpaceMutation.isError && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {getApiErrorMessage(createSpaceMutation.error)}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createSpaceMutation.isPending}
                  className="btn btn-primary cursor-pointer disabled:opacity-50"
                >
                  {createSpaceMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete reservation confirmation */}
      {reservationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-(--app-card) text-(--app-text) rounded-xl p-6 max-w-md w-full border border-gray-400 dark:border-gray-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-(--app-text)">Delete reservation</h2>
              <button
                type="button"
                onClick={() => {
                  setReservationToDelete(null);
                  setDeleteConfirmText('');
                }}
                className="p-1.5 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-(--app-text) opacity-90 mb-4">
              This action cannot be undone. Type <strong>delete</strong> below to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type delete to confirm"
              className="input w-full mb-4"
              autoComplete="off"
            />
            {deleteMutation.isError && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-4" role="alert">
                {getApiErrorMessage(deleteMutation.error)}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => deleteMutation.mutate(reservationToDelete.id)}
                disabled={deleteConfirmText !== 'delete' || deleteMutation.isPending}
                className="btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white border-0"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create reservation modal */}
      {createReservationOpen && selectedSpaceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-(--app-card) text-(--app-text) rounded-xl p-6 max-w-md w-full border border-gray-400 dark:border-gray-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-(--app-text)">Book reservation</h2>
              <button
                type="button"
                onClick={() => setCreateReservationOpen(false)}
                className="p-1.5 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-(--app-text)">
                  Client email
                </label>
                <input
                  type="email"
                  value={createForm.clientEmail}
                  onChange={(e) => setCreateForm((f) => ({ ...f, clientEmail: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--app-text)">
                  Date
                </label>
                <input
                  type="date"
                  value={createForm.reservationDate}
                  onChange={(e) => setCreateForm((f) => ({ ...f, reservationDate: e.target.value }))}
                  className="input w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-(--app-text)">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={createForm.startTime}
                    onChange={(e) => setCreateForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-(--app-text)">
                    End time
                  </label>
                  <input
                    type="time"
                    value={createForm.endTime}
                    onChange={(e) => setCreateForm((f) => ({ ...f, endTime: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
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
      <Tooltip id="edit-reservation" place="top" />
      <Tooltip id="delete-reservation" place="top" />
    </div>
  );
}
