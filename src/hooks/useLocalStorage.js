import { useEffect, useState } from "react";

// Hook reutilizable: vale para favoritos o cualquier otra lista.
export default function useLocalStorage(clave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const texto = localStorage.getItem(clave);
      const datos = texto === null ? inicial : JSON.parse(texto);
      return Array.isArray(datos) ? datos : inicial;
    } catch {
      return inicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      console.warn("No se pudieron guardar los favoritos.");
    }
  }, [clave, valor]);

  // También escuchamos cambios hechos desde otra pestaña.
  useEffect(() => {
    function sincronizar(evento) {
      if (evento.key !== clave) return;
      try {
        const datos = JSON.parse(evento.newValue);
        setValor(Array.isArray(datos) ? datos : []);
      } catch {
        setValor([]);
      }
    }
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, [clave]);

  return [valor, setValor];
}