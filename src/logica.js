// Funciones puras: reciben datos y devuelven resultados sin modificar el original.
function texto(valor, alternativa) {
  return typeof valor === "string" && valor.trim() ? valor : alternativa;
}

export function prepararMapas(datos) {
  return datos
    .filter((mapa) => Number.isInteger(mapa?.id) && mapa.id > 0)
    .map((mapa) => ({
      id: mapa.id,
      titulo: texto(mapa.title, "Sin título"),
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

export function ordenarMapas(mapas, orden) {
  if (orden === "original") return mapas;
  const copia = [...mapas];
  if (orden === "titulo") return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
  if (orden === "artista") return copia.sort((a, b) => a.artista.localeCompare(b.artista, "es"));
  if (orden === "dificultades") {
    return copia.sort((a, b) => b.dificultades.length - a.dificultades.length);
  }
  return mapas;
}

const MODOS = ["osu", "taiko", "fruits", "mania"];

export function contarModos(mapa) {
  return MODOS
    .map((modo) => ({
      modo,
      cantidad: mapa.dificultades.filter((d) => d.mode === modo).length
    }))
    .filter(({ cantidad }) => cantidad > 0);
}

export function compararMapas(primero, segundo) {
  const a = primero.dificultades.length;
  const b = segundo.dificultades.length;
  const diferencia = Math.abs(a - b);
  const textoDiferencia = diferencia === 0
    ? "Ambos sets tienen el mismo número de dificultades."
    : `${a > b ? primero.titulo : segundo.titulo} tiene ${diferencia} dificultades más.`;

  const modosA = contarModos(primero).map(({ modo }) => modo);
  const modosB = contarModos(segundo).map(({ modo }) => modo);
  const comunes = modosA.filter((modo) => modosB.includes(modo));

  const textoVariedad = modosA.length === modosB.length
    ? "Ambos sets incluyen la misma cantidad de modos de juego."
    : `${modosA.length > modosB.length ? primero.titulo : segundo.titulo} ofrece más variedad de modos.`;

  const textoCompartidos = comunes.length === 0
    ? "Los sets no comparten ningún modo de juego."
    : `Comparten ${comunes.length} ${comunes.length === 1 ? "modo de juego" : "modos de juego"}.`;

  return { textoDiferencia, textoVariedad, textoCompartidos };
}