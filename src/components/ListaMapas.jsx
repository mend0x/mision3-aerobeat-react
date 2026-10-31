import TarjetaMapa from "./TarjetaMapa.jsx";

export default function ListaMapas({ mapas, idsFavoritos, idsSeleccionados, onFavorito, onComparar }) {
  if (mapas.length === 0) {
    return <p className="mensaje">No hay mapas para este filtro. Prueba otro modo o busca otra canción.</p>;
  }

  return (
    <div className="cuadricula">
      {mapas.map((mapa) => (
        <TarjetaMapa
          key={mapa.id}
          mapa={mapa}
          favorito={idsFavoritos.has(mapa.id)}
          seleccionado={idsSeleccionados.has(mapa.id)}
          onFavorito={onFavorito}
          onComparar={onComparar}
        />
      ))}
    </div>
  );
}