import type { FormEvent } from 'react';
import { Modal } from '@/components/Modal';
import type { CreateSpaceDto } from '@/types';

interface AddSpaceModalProps {
  open: boolean;
  onClose: () => void;
  form: CreateSpaceDto;
  onFormChange: (f: CreateSpaceDto) => void;
  onSubmit: (e: FormEvent) => void;
  error: string | null;
  isPending: boolean;
}

export function AddSpaceModal({
  open,
  onClose,
  form,
  onFormChange,
  onSubmit,
  error,
  isPending,
}: AddSpaceModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add space">
      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-(--app-text)">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            className="input w-full"
            placeholder="Space name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-(--app-text)">Reference</label>
          <input
            type="text"
            value={form.reference}
            onChange={(e) => onFormChange({ ...form, reference: e.target.value })}
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
            value={form.capacity ?? ''}
            onChange={(e) => onFormChange({ ...form, capacity: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="input w-full"
            placeholder="Number of people"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-(--app-text)">Description (optional)</label>
          <input
            type="text"
            value={form.description ?? ''}
            onChange={(e) => onFormChange({ ...form, description: e.target.value })}
            className="input w-full"
            placeholder="Short description"
          />
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
            {isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
