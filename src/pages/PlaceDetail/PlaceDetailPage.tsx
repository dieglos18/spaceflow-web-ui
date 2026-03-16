import { useState, FormEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getPlaceById } from '@/api/placesApi';
import { getSpaces, createSpace } from '@/api/spacesApi';
import { getReservations, deleteReservation, updateReservation, createReservation } from '@/api/reservationsApi';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { getApiErrorMessage } from '@/utils/errors';
import type { Reservation, UpdateReservationDto, CreateReservationDto, CreateSpaceDto } from '@/types';
import { SpacesSection } from './SpacesSection';
import { TelemetrySection } from './TelemetrySection';
import { ReservationsSection } from './ReservationsSection';
import { EditReservationModal } from './EditReservationModal';
import { CreateReservationModal } from './CreateReservationModal';
import { AddSpaceModal } from './AddSpaceModal';
import { DeleteReservationModal } from './DeleteReservationModal';

const RESERVATIONS_PAGE_SIZE = 50;

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

  const minDate = new Date().toISOString().slice(0, 10);

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
      <div className="min-h-screen bg-(--app-bg) text-(--app-text) p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-(--app-text) opacity-80">Place not found.</p>
        </div>
      </div>
    );
  }

  if (placeLoading || placeError) {
    return (
      <div className="min-h-screen bg-(--app-bg) text-(--app-text) p-4 sm:p-6">
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
    <div className="min-h-screen bg-(--app-bg) text-(--app-text) px-3 pb-6 sm:px-4 sm:pb-8 md:px-6 md:pb-10">
      <div className="max-w-7xl mx-auto">
        <SpacesSection
          spaces={spacesForPlace}
          selectedSpaceId={selectedSpaceId}
          onSelectSpace={setSelectedSpaceId}
          isAdmin={isAdmin}
          placeId={placeId}
          onOpenAddSpace={() => {
            setSpaceForm({ placeId, name: '', reference: '', capacity: undefined, description: '' });
            setAddSpaceOpen(true);
          }}
          isLoading={spacesLoading}
        />

        <TelemetrySection spaceId={selectedSpaceId} isAdmin={isAdmin} />

        <ReservationsSection
          spaceId={selectedSpaceId}
          reservations={reservationsForSpace}
          isLoading={reservationsLoading}
          onBookReservation={handleOpenCreate}
          onEdit={openEdit}
          onDelete={(r) => {
            setReservationToDelete(r);
            setDeleteConfirmText('');
          }}
          deleteMutationPending={deleteMutation.isPending}
        />
      </div>

      <EditReservationModal
        open={!!editingReservation}
        onClose={() => setEditingReservation(null)}
        form={editForm}
        onFormChange={setEditForm}
        onSubmit={handleSubmitEdit}
        minDate={minDate}
        error={updateMutation.isError ? getApiErrorMessage(updateMutation.error) : null}
        isPending={updateMutation.isPending}
      />

      <AddSpaceModal
        open={isAdmin && addSpaceOpen && !!placeId}
        onClose={() => setAddSpaceOpen(false)}
        form={spaceForm}
        onFormChange={setSpaceForm}
        onSubmit={handleSubmitAddSpace}
        error={createSpaceMutation.isError ? getApiErrorMessage(createSpaceMutation.error) : null}
        isPending={createSpaceMutation.isPending}
      />

      <DeleteReservationModal
        open={!!reservationToDelete}
        onClose={() => {
          setReservationToDelete(null);
          setDeleteConfirmText('');
        }}
        confirmText={deleteConfirmText}
        onConfirmTextChange={setDeleteConfirmText}
        onConfirm={() => reservationToDelete && deleteMutation.mutate(reservationToDelete.id)}
        error={deleteMutation.isError ? getApiErrorMessage(deleteMutation.error) : null}
        isPending={deleteMutation.isPending}
      />

      <CreateReservationModal
        open={createReservationOpen && !!selectedSpaceId}
        onClose={() => setCreateReservationOpen(false)}
        form={createForm}
        onFormChange={setCreateForm}
        onSubmit={handleSubmitCreate}
        minDate={minDate}
        error={createMutation.isError ? getApiErrorMessage(createMutation.error) : null}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
