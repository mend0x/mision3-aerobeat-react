import TarjetaMapa from "./TarjetaMapa.jsx";
import { contarDificultades } from "../logica.js";

export default function ListaMapas({ mapas, cargando, error, origen, soloFavoritos, favoritos, seleccion, onFavorito, onComparar }) {
  if (!soloFavoritos && cargando) {
    return <p className="mensaje" role="status">Buscando mapas en la API…</p>;
  }
  if (!soloFavoritos && error) {
    return <p className="mensaje error" role="alert">Error: {error}. Puedes volver a buscar.</p>;
  }
  if (mapas.length === 0) {
    return <p className="mensaje">No hay mapas para este filtro. Prueba otro modo o busca otra canción.</p>;
  }
  return (
    <>
      <p className="resumen">
        {mapas.length} sets · {contarDificultades(mapas)} dificultades · {soloFavoritos ? "Tus favoritos" : origen}
      </p>
      <div className="cuadricula">
        {mapas.map((mapa) => (
          <TarjetaMapa
            key={mapa.id}
            mapa={mapa}
            favorito={favoritos.some((f) => f.id === mapa.id)}
            seleccionado={seleccion.includes(mapa.id)}
            onFavorito={onFavorito}
            onComparar={onComparar}
          />
        ))}
      </div>
    </>
  );
}