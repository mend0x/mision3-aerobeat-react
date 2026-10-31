import { useEffect, useState } from "react";

// Funciona con listas, objetos, números o textos serializables como JSON.
function leerAlmacenamiento(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado === null ? valorInicial : JSON.parse(guardado);
  } catch {
    return valorInicial;
  }
}

export default function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => leerAlmacenamiento(clave, valorInicial));

  useEffect(() => {
    try {
      const texto = JSON.stringify(valor);
      // Evita reescribir un valor recibido desde otra pestaña.
      if (localStorage.getItem(clave) !== texto) {
        localStorage.setItem(clave, texto);
      }
    } catch (error) {
      console.error("No se pudieron guardar los datos:", error);
    }
  }, [clave, valor]);

  useEffect(() => {
    function sincronizar(evento) {
      if (evento.key === clave || evento.key === null) {
        setValor(leerAlmacenamiento(clave, valorInicial));
      }
    }

    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, [clave, valorInicial]);

  return [valor, setValor];
}