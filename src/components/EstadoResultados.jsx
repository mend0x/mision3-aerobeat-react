export default function EstadoResultados({ cargando, error }) {
  if (cargando) {
    return <p className="mensaje" role="status">Buscando mapas en la API…</p>;
  }
  if (error) {
    return <p className="mensaje error" role="alert">Error: {error}. Puedes volver a buscar.</p>;
  }
  return null;
}