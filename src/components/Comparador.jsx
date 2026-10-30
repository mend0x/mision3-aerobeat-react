export default function Comparador({ mapas, onLimpiar }) {
  if (mapas.length === 0) return null;

  const diferencia = mapas.length === 2
    ? Math.abs(mapas[0].dificultades.length - mapas[1].dificultades.length)
    : 0;

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
                <span>{mapa.artista} · {mapa.dificultades.length} dificultades</span>
              </div>
            ))}
          </div>
          <p>
            {diferencia === 0
              ? "Ambos sets tienen el mismo número de dificultades."
              : `${mapas[0].dificultades.length > mapas[1].dificultades.length ? mapas[0].titulo : mapas[1].titulo} tiene ${diferencia} dificultades más.`}
          </p>
        </>
      )}
    </section>
  );
}