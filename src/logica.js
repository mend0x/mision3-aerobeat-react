// Funciones de M2: filtrar y transformar datos sin alterar los originales.
function texto(valor, alternativa) {
  return typeof valor === "string" && valor.trim() ? valor : alternativa;
}

export function prepararMapas(datos) {
  return datos
    .filter((mapa) => Number.isInteger(mapa?.id) && mapa.id > 0)
    .map((mapa) => ({
      id: mapa.id,
      titulo: texto(mapa.title, "Sin tÃ­tulo"),
      artista: texto(mapa.artist, "Artista desconocido"),
      creador: texto(mapa.creator, "Creador desconocido"),
      dificultades: Array.isArray(mapa.beatmaps)
        ? mapa.beatmaps.filter((d) => typeof d?.mode === "string")
        : [],
      descargable: mapa.availability?.download_disabled !== true
    }));
}

export function filtrarMapas(mapas, modo) {
  return mapas.filter((mapa) =>
    modo === "todos" || mapa.dificultades.some((d) => d.mode === modo)
  );
}

export function contarDificultades(mapas) {
  return mapas.reduce((total, mapa) => total + mapa.dificultades.length, 0);
}