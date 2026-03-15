import { useParams, Link } from 'react-router-dom';

export function TelemetryDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-(--app-bg) text-(--app-text) p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/telemetry" className="text-primary mb-4 inline-block cursor-pointer">
          Volver a telemetría
        </Link>
        <h1 className="text-2xl font-semibold mb-4">Detalle de telemetría</h1>
        <p className="text-(--app-text) opacity-80">
          Contenido por implementar. ID: {id ?? '—'}
        </p>
      </div>
    </div>
  );
}
