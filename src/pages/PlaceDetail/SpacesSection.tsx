import { DoorClosed, LayoutPanelLeft, Plus, Users } from 'lucide-react';
import type { Space } from '@/types';

interface SpacesSectionProps {
  spaces: Space[];
  selectedSpaceId: string | null;
  onSelectSpace: (id: string | null) => void;
  isAdmin: boolean;
  placeId: string;
  onOpenAddSpace: () => void;
  isLoading?: boolean;
}

export function SpacesSection({
  spaces,
  selectedSpaceId,
  onSelectSpace,
  isAdmin,
  placeId,
  onOpenAddSpace,
  isLoading = false,
}: SpacesSectionProps) {
  return (
    <>
      <div className="flex items-center justify-between mt-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-(--app-text) flex items-center gap-2">
          <LayoutPanelLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
          Spaces
        </h1>
        {isAdmin && placeId && (
          <button
            type="button"
            onClick={onOpenAddSpace}
            className="btn btn-primary cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Add space
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-(--app-text) opacity-80 mb-4 sm:mb-6">Loading spaces...</p>
      ) : spaces.length === 0 ? (
        <p className="text-(--app-text) opacity-80 mb-4 sm:mb-6">No spaces in this place.</p>
      ) : (
        <div className="w-screen relative left-1/2 -translate-x-1/2 mb-4 sm:mb-6 md:mb-8">
          <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">
            <div className="shrink-0 w-3 sm:w-4 md:w-6 xl:w-[max(1.5rem,calc((100vw-80rem)/2))] snap-start" aria-hidden="true" />
            {spaces.map((space) => (
              <button
                key={space.id}
                type="button"
                onClick={() => onSelectSpace(selectedSpaceId === space.id ? null : space.id)}
                className={`group relative text-left rounded-xl border transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md shrink-0 w-[260px] min-w-[260px] h-[150px] sm:w-[300px] sm:min-w-[300px] sm:h-[170px] md:w-[320px] md:min-w-[320px] md:h-[180px] snap-start flex flex-col ${
                  selectedSpaceId === space.id
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
                <div className="px-3 pt-3 pb-1 sm:px-4 sm:pt-4 md:px-5 md:pt-5 flex flex-col h-full min-h-0">
                  <div className="shrink-0 h-[52px] sm:h-[60px] flex items-start gap-3 mb-0">
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DoorClosed className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <h3 className="text-sm font-bold text-(--app-text) truncate">{space.name}</h3>
                      <p className="text-[11px] text-(--app-text) opacity-70 mt-1 truncate">{space.reference}</p>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 min-h-0 border-t border-gray-400 dark:border-gray-600 pt-2 sm:pt-2.5 space-y-2">
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
            <div className="shrink-0 w-3 sm:w-4 md:w-6 xl:w-[max(1.5rem,calc((100vw-80rem)/2))] snap-start" aria-hidden="true" />
          </div>
        </div>
      )}
    </>
  );
}
