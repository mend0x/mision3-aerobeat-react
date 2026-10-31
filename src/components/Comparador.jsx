import { compararMapas, contarModos } from "../logica.js";

const ETIQUETAS = { osu: "osu!", taiko: "Taiko", fruits: "Catch", mania: "Mania" };

export default function Comparador({ mapas, onLimpiar }) {
  if (mapas.length === 0) return null;

  const comparacion = mapas.length === 2 ? compararMapas(mapas[0], mapas[1]) : null;

  return (
    <section className="comparador" aria-label="Comparación de mapas">
      <div className="comparador-titulo">
        <h2>Comparador de mapas</h2>
        <button type="button" onClick={onLimpiar}>Limpiar</button>
      </div>
      {mapas.length === 1 ? (
        <p>Has elegido {mapas[0].titulo}. Selecciona otro mapa para compararlos.</p>
      ) : (
        <>
          <div className="comparador-columnas">
            {mapas.map((mapa) => (
              <div key={mapa.id}>
                <strong>{mapa.titulo}</strong>
                <span>{mapa.artista} · creador: {mapa.creador}</span>
                <span>{mapa.dificultades.length} dificultades</span>
                <ul className="modos-comparacion">
                  {contarModos(mapa).map(({ modo, cantidad }) => (
                    <li key={modo}>{ETIQUETAS[modo] || modo}: {cantidad}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p>{comparacion.textoDiferencia}</p>
          <p>{comparacion.textoVariedad}</p>
          <p>{comparacion.textoCompartidos}</p>
        </>
      )}
    </section>
  );
}