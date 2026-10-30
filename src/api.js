// Conservamos la API de M2 y añadimos cancelación con AbortController.
const API = "https://mirror.hinamizawa.ai";

export async function buscarMapas(consulta, signal) {
  const clave = `aerobeat-v1:${consulta.toLowerCase()}`;
  try {
    const guardados = JSON.parse(localStorage.getItem(clave));
    if (Array.isArray(guardados) && guardados.length > 0) {
      return { datos: guardados, origen: "caché local" };
    }
  } catch {
    // Si falla localStorage, seguimos con la petición de red.
  }

  const parametros = new URLSearchParams({ q: consulta, amount: "24" });
  const respuesta = await fetch(`${API}/api/v2/search?${parametros}`, { signal });
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con HTTP ${respuesta.status}.`);
  }
  const datos = await respuesta.json();
  if (!Array.isArray(datos)) {
    throw new Error("La API no ha devuelto una lista de mapas.");
  }
  try {
    if (datos.length > 0) localStorage.setItem(clave, JSON.stringify(datos));
  } catch {
    // Un almacenamiento lleno no impide mostrar los resultados.
  }
  return { datos, origen: "API hinai" };
}

export function enlaceDescarga(id) {
  return `https://beatconnect.io/b/${id}`;
}