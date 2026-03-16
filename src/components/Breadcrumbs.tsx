import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-(--app-text)">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-500" aria-hidden>
              /
            </span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="text-(--app-text) opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-(--app-text) font-semibold" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
