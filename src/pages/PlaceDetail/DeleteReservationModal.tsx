import { Modal } from '@/components/Modal';

interface DeleteReservationModalProps {
  open: boolean;
  onClose: () => void;
  confirmText: string;
  onConfirmTextChange: (v: string) => void;
  onConfirm: () => void;
  error: string | null;
  isPending: boolean;
}

export function DeleteReservationModal({
  open,
  onClose,
  confirmText,
  onConfirmTextChange,
  onConfirm,
  error,
  isPending,
}: DeleteReservationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Delete reservation">
      <p className="text-sm text-(--app-text) opacity-90 mb-4">
        This action cannot be undone. Type <strong>delete</strong> below to confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => onConfirmTextChange(e.target.value)}
        placeholder="Type delete to confirm"
        className="input w-full mb-4"
        autoComplete="off"
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4" role="alert">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmText !== 'delete' || isPending}
          className="btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white border-0"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
