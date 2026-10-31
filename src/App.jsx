import { useEffect, useState } from "react";
import { buscarMapas } from "./api.js";
import { prepararMapas, filtrarMapas, ordenarMapas, contarDificultades } from "./logica.js";
import useLocalStorage from "./hooks/useLocalStorage.js";
import Cabecera from "./components/Cabecera.jsx";
import Presentacion from "./components/Presentacion.jsx";
import Buscador from "./components/Buscador.jsx";
import Filtros from "./components/Filtros.jsx";
import Ordenador from "./components/Ordenador.jsx";
import EstadoResultados from "./components/EstadoResultados.jsx";
import ListaMapas from "./components/ListaMapas.jsx";
import Comparador from "./components/Comparador.jsx";

const FAVORITOS_INICIALES = [];

export default function App() {
  const [consulta, setConsulta] = useState("nevada");
  // El número permite repetir una búsqueda aunque el texto sea el mismo.
  const [peticion, setPeticion] = useState({ texto: "nevada", numero: 0 });
  const [resultado, setResultado] = useState({ numero: -1, mapas: [], origen: "", error: "" });
  const [modo, setModo] = useState("todos");
  const [orden, setOrden] = useState("original");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [favoritosGuardados, setFavoritos] = useLocalStorage("aerobeat-m3:favoritos", FAVORITOS_INICIALES);
  // La validación pertenece a la app, no al hook genérico.
  const favoritos = Array.isArray(favoritosGuardados) ? favoritosGuardados : [];
  const [seleccion, setSeleccion] = useState([]);

  // La red es un sistema externo: por eso sí necesitamos useEffect.
  useEffect(() => {
    const controlador = new AbortController();

    buscarMapas(peticion.texto, controlador.signal)
      .then(({ datos, origen }) => {
        if (!controlador.signal.aborted) {
          setResultado({
            numero: peticion.numero,
            mapas: prepararMapas(datos),
            origen,
            error: ""
          });
        }
      })
      .catch((error) => {
        if (!controlador.signal.aborted) {
          setResultado({ numero: peticion.numero, mapas: [], origen: "", error: error.message });
        }
      });

    return () => controlador.abort();
  }, [peticion]);

  function enviarBusqueda(evento) {
    evento.preventDefault();
    const texto = consulta.trim();
    if (!texto) return;

    setSoloFavoritos(false);
    setSeleccion([]);
    // No actualizamos "cargando" a mano: se deduce del número de petición.
    setPeticion((anterior) => ({ texto, numero: anterior.numero + 1 }));
  }

  function alternarFavorito(mapa) {
    setFavoritos((guardados) => {
      const anteriores = Array.isArray(guardados) ? guardados : [];
      return anteriores.some((favorito) => favorito.id === mapa.id)
        ? anteriores.filter((favorito) => favorito.id !== mapa.id)
        : [mapa, ...anteriores];
    });
  }

  function alternarComparacion(id) {
    setSeleccion((anterior) => {
      if (anterior.includes(id)) return anterior.filter((actual) => actual !== id);
      return anterior.length < 2 ? [...anterior, id] : [anterior[1], id];
    });
  }

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    setSeleccion([]);
  }

  function cambiarBiblioteca(activo) {
    setSoloFavoritos(activo);
    setSeleccion([]);
  }

  // Estos datos son DERIVADOS. No requieren otro estado ni otro efecto.
  const cargando = resultado.numero !== peticion.numero;
  const base = soloFavoritos ? favoritos : resultado.mapas;
  const visibles = ordenarMapas(filtrarMapas(base, modo), orden);
  const idsFavoritos = new Set(favoritos.map((mapa) => mapa.id));
  const idsSeleccionados = new Set(seleccion);
  const comparados = seleccion.map((id) => visibles.find((mapa) => mapa.id === id)).filter(Boolean);
  const mostrarLista = soloFavoritos || (!cargando && !resultado.error);

  return (
    <>
      <Cabecera />
      <main className="ventana">
        <div className="barra-ventana">
          <span>Aerobeat / Explorador de mapas</span>
          <span>EDICIÓN REACT</span>
        </div>
        <Presentacion />
        <section className="explorador" aria-label="Buscador de mapas">
          <Buscador
            consulta={consulta}
            onConsulta={setConsulta}
            onBuscar={enviarBusqueda}
            cargando={cargando}
          />
          <Filtros
            modo={modo}
            onModo={cambiarModo}
            soloFavoritos={soloFavoritos}
            onFavoritos={cambiarBiblioteca}
            cantidad={favoritos.length}
          />
          <div className="resultados-cabecera">
            <h2>{soloFavoritos ? "Mi biblioteca" : "Tu selección"}</h2>
            <Ordenador orden={orden} onOrden={setOrden} />
          </div>
          <Comparador mapas={comparados} onLimpiar={() => setSeleccion([])} />
          <EstadoResultados
            cargando={!soloFavoritos && cargando}
            error={soloFavoritos || cargando ? "" : resultado.error}
          />
          {mostrarLista && (
            <>
              {visibles.length > 0 && (
                <p className="resumen">
                  {visibles.length} sets · {contarDificultades(visibles)} dificultades · {soloFavoritos ? "Tus favoritos" : resultado.origen}
                </p>
              )}
              <ListaMapas
                mapas={visibles}
                idsFavoritos={idsFavoritos}
                idsSeleccionados={idsSeleccionados}
                onFavorito={alternarFavorito}
                onComparar={alternarComparacion}
              />
            </>
          )}
        </section>
        <footer className="pie-ventana">
          <span>Descarga el .osz y ábrelo con osu! para instalarlo.</span>
          <span>La API muestra como máximo 24 resultados por búsqueda.</span>
        </footer>
      </main>
      <footer className="pie">La M2, reconstruida en React. <span>@Mendo · Web I</span></footer>
    </>
  );
}