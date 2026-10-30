import { enlaceDescarga } from "../api.js";

export default function TarjetaMapa({ mapa, favorito, seleccionado, onFavorito, onComparar }) {
  const portada = `https://assets.ppy.sh/beatmaps/${mapa.id}/covers/cover.jpg`;
  return (
    <article className={`tarjeta ${seleccionado ? "seleccionada" : ""}`}>
      <div
        className="portada"
        style={{ backgroundImage: `url("${portada}")` }}
        role="img"
        aria-label={`Portada de ${mapa.titulo}`}
      />
      <div className="ficha">
        <p className="artista">{mapa.artista}</p>
        <h3>{mapa.titulo}</h3>
        <p className="creador">Creado por {mapa.creador}</p>
        <span className="dificultades">{mapa.dificultades.length} dificultades</span>
        <div className="acciones">
          {mapa.descargable ? (
            <a className="descarga" href={enlaceDescarga(mapa.id)} target="_blank" rel="noopener noreferrer">
              Descargar .osz
            </a>
          ) : (
            <span className="descarga no-disponible">No disponible</span>
          )}
          <a className="original" href={`https://osu.ppy.sh/beatmapsets/${mapa.id}`} target="_blank" rel="noopener noreferrer">
            Ver en osu!
          </a>
        </div>
        <div className="acciones extras">
          <button type="button" onClick={() => onFavorito(mapa)} aria-pressed={favorito}>
            {favorito ? "Quitar favorito" : "Guardar favorito"}
          </button>
          <button type="button" onClick={() => onComparar(mapa.id)} aria-pressed={seleccionado}>
            {seleccionado ? "Quitar comparaciÃ³n" : "Comparar"}
          </button>
        </div>
      </div>
    </article>
  );
}