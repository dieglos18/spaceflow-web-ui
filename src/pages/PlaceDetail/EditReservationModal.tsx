import type { FormEvent } from 'react';
import { Modal } from '@/components/Modal';
import type { UpdateReservationDto } from '@/types';

interface EditReservationModalProps {
  open: boolean;
  onClose: () => void;
  form: UpdateReservationDto;
  onFormChange: (f: UpdateReservationDto) => void;
  onSubmit: (e: FormEvent) => void;
  minDate: string;
  error: string | null;
  isPending: boolean;
}

export function EditReservationModal({
  open,
  onClose,
  form,
  onFormChange,
  onSubmit,
  minDate,
  error,
  isPending,
}: EditReservationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Edit reservation">
      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client email</label>
          <input
            type="email"
            value={form.clientEmail}
            onChange={(e) => onFormChange({ ...form, clientEmail: e.target.value })}
            className="input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            min={minDate}
            value={form.reservationDate}
            onChange={(e) => onFormChange({ ...form, reservationDate: e.target.value })}
            className="input w-full"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start time</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => onFormChange({ ...form, startTime: e.target.value })}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End time</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => onFormChange({ ...form, endTime: e.target.value })}
              className="input w-full"
              required
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
