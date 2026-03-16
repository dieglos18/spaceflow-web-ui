import { Tooltip } from 'react-tooltip';
import { CalendarCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Reservation } from '@/types';

interface ReservationsSectionProps {
  spaceId: string | null;
  reservations: Reservation[];
  isLoading: boolean;
  onBookReservation: () => void;
  onEdit: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
  deleteMutationPending?: boolean;
}

export function ReservationsSection({
  spaceId,
  reservations,
  isLoading,
  onBookReservation,
  onEdit,
  onDelete,
  deleteMutationPending = false,
}: ReservationsSectionProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-(--app-text) flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
          Reservations
        </h2>
        {spaceId && (
          <button
            type="button"
            onClick={onBookReservation}
            className="btn btn-primary cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Book reservation
          </button>
        )}
      </div>
      <div className="rounded-xl border border-gray-300 dark:border-gray-500 bg-(--app-card) overflow-hidden min-h-[120px] sm:min-h-[140px] md:min-h-[160px] shadow-sm">
        {!spaceId ? (
          <p className="text-(--app-text) opacity-80 text-center py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-6 flex items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            Select a Space to see its Reservations
          </p>
        ) : isLoading ? (
          <p className="text-(--app-text) opacity-80 text-center py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-6 flex items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            Loading reservations...
          </p>
        ) : reservations.length === 0 ? (
          <p className="text-(--app-text) opacity-80 text-center py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-6 flex items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            No reservations for this space.
          </p>
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="table-header-row">
                    <th className="py-2 px-2 text-xs sm:py-3.5 sm:px-4 sm:text-sm">Client email</th>
                    <th className="py-2 px-2 text-xs sm:py-3.5 sm:px-4 sm:text-sm">Date</th>
                    <th className="py-2 px-2 text-xs sm:py-3.5 sm:px-4 sm:text-sm">Start</th>
                    <th className="py-2 px-2 text-xs sm:py-3.5 sm:px-4 sm:text-sm">End</th>
                    <th className="py-2 px-2 text-xs sm:py-3.5 sm:px-4 sm:text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-300 dark:border-gray-600 last:border-b-0 transition-colors bg-white dark:bg-transparent"
                    >
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{r.clientEmail}</td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{r.reservationDate.slice(0, 10)}</td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{r.startTime.slice(0, 5)}</td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{r.endTime.slice(0, 5)}</td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(r)}
                            data-tooltip-id="edit-reservation"
                            data-tooltip-content="Edit reservation"
                            aria-label="Edit reservation"
                            className="p-1.5 sm:p-2 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-(--color-bg-hover) transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(r)}
                            disabled={deleteMutationPending}
                            data-tooltip-id="delete-reservation"
                            data-tooltip-content="Delete reservation"
                            aria-label="Delete reservation"
                            className="p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-(--color-danger-bg) transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: cards */}
            <div className="md:hidden flex flex-col gap-3 p-3">
              {reservations.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-gray-300 dark:border-gray-500 bg-(--app-card) p-4 shadow-sm"
                >
                  <p className="text-(--app-text) font-medium text-sm truncate" title={r.clientEmail}>
                    {r.clientEmail}
                  </p>
                  <p className="text-(--app-text) opacity-80 text-xs mt-1">
                    {r.reservationDate.slice(0, 10)} · {r.startTime.slice(0, 5)} – {r.endTime.slice(0, 5)}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={() => onEdit(r)}
                      data-tooltip-id="edit-reservation"
                      data-tooltip-content="Edit reservation"
                      aria-label="Edit reservation"
                      className="p-2 rounded-lg text-(--app-text) opacity-70 hover:opacity-100 hover:bg-(--color-bg-hover) transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(r)}
                      disabled={deleteMutationPending}
                      data-tooltip-id="delete-reservation"
                      data-tooltip-content="Delete reservation"
                      aria-label="Delete reservation"
                      className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-(--color-danger-bg) transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Tooltip id="edit-reservation" place="top" />
      <Tooltip id="delete-reservation" place="top" />
    </>
  );
}
