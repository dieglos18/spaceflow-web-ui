import { useQuery } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import { getTelemetry } from '@/api/telemetryApi';

const TELEMETRY_PAGE_SIZE = 20;

interface TelemetrySectionProps {
  spaceId: string | null;
  isAdmin: boolean;
}

export function TelemetrySection({ spaceId, isAdmin }: TelemetrySectionProps) {
  const { data: telemetryData } = useQuery({
    queryKey: ['telemetry', spaceId],
    queryFn: () => getTelemetry(1, TELEMETRY_PAGE_SIZE, spaceId ?? undefined),
    enabled: !!isAdmin && !!spaceId,
  });

  if (!isAdmin) return null;

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-(--app-text) flex items-center gap-2 mb-2 sm:mb-3">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
        Telemetry
      </h2>
      <div className="rounded-xl border border-gray-300 dark:border-gray-500 bg-(--app-card) overflow-hidden shadow-sm">
        {!spaceId ? (
          <p className="text-(--app-text) opacity-80 text-center py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-6">
            Select a space to see its telemetry
          </p>
        ) : !telemetryData ? (
          <p className="text-(--app-text) opacity-80 text-center py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-6">Loading telemetry...</p>
        ) : telemetryData.data.length === 0 ? (
          <p className="text-(--app-text) opacity-80 text-center py-6 px-4 sm:py-8 sm:px-5 md:py-10 md:px-6">No telemetry for this space.</p>
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="table-header-row">
                    <th className="py-2 px-2 text-xs sm:py-3 sm:px-4 sm:text-sm">Time</th>
                    <th className="py-2 px-2 text-xs sm:py-3 sm:px-4 sm:text-sm">People</th>
                    <th className="py-2 px-2 text-xs sm:py-3 sm:px-4 sm:text-sm">Temp (°C)</th>
                    <th className="py-2 px-2 text-xs sm:py-3 sm:px-4 sm:text-sm">Humidity (%)</th>
                    <th className="py-2 px-2 text-xs sm:py-3 sm:px-4 sm:text-sm">CO₂</th>
                    <th className="py-2 px-2 text-xs sm:py-3 sm:px-4 sm:text-sm">Battery (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetryData.data.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-300 dark:border-gray-600 last:border-b-0 transition-colors bg-white dark:bg-transparent"
                    >
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">
                        {new Date(row.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{row.peopleCount}</td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{row.temperature ?? '—'}</td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{row.humidity ?? '—'}</td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{row.co2 ?? '—'}</td>
                      <td className="py-2 px-2 text-xs text-gray-800 dark:text-(--app-text) sm:py-3 sm:px-4 sm:text-sm">{row.battery ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: cards */}
            <div className="md:hidden flex flex-col gap-3 p-3">
              {telemetryData.data.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-gray-300 dark:border-gray-500 bg-(--app-card) p-4 shadow-sm"
                >
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="col-span-2">
                      <dt className="text-(--app-text) opacity-80 text-xs font-medium">Time</dt>
                      <dd className="text-(--app-text) font-medium mt-0.5">{new Date(row.timestamp).toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-(--app-text) opacity-80 text-xs font-medium">People</dt>
                      <dd className="text-(--app-text) font-medium mt-0.5">{row.peopleCount}</dd>
                    </div>
                    <div>
                      <dt className="text-(--app-text) opacity-80 text-xs font-medium">Temp (°C)</dt>
                      <dd className="text-(--app-text) font-medium mt-0.5">{row.temperature ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--app-text) opacity-80 text-xs font-medium">Humidity (%)</dt>
                      <dd className="text-(--app-text) font-medium mt-0.5">{row.humidity ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--app-text) opacity-80 text-xs font-medium">CO₂</dt>
                      <dd className="text-(--app-text) font-medium mt-0.5">{row.co2 ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-(--app-text) opacity-80 text-xs font-medium">Battery (%)</dt>
                      <dd className="text-(--app-text) font-medium mt-0.5">{row.battery ?? '—'}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
