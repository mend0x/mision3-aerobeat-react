import { useEffect, useState } from "react";
import { buscarMapas } from "./api.js";
import { prepararMapas, filtrarMapas } from "./logica.js";
import useLocalStorage from "./hooks/useLocalStorage.js";
import Buscador from "./components/Buscador.jsx";
import Filtros from "./components/Filtros.jsx";
import ListaMapas from "./components/ListaMapas.jsx";
import Comparador from "./components/Comparador.jsx";

export default function App() {
  const [consulta, setConsulta] = useState("nevada");
  const [peticion, setPeticion] = useState({ texto: "nevada", numero: 0 });
  const [resultado, setResultado] = useState({ mapas: [], origen: "", cargando: true, error: "" });
  const [modo, setModo] = useState("todos");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useLocalStorage("aerobeat-m3:favoritos", []);
  const [seleccion, setSeleccion] = useState([]);

  // El efecto consulta un sistema externo. AbortController evita respuestas antiguas.
  useEffect(() => {
    const controlador = new AbortController();
    buscarMapas(peticion.texto, controlador.signal)
      .then(({ datos, origen }) => {
        if (!controlador.signal.aborted) {
          setResultado({ mapas: prepararMapas(datos), origen, cargando: false, error: "" });
        }
      })
      .catch((error) => {
        if (!controlador.signal.aborted) {
          setResultado({ mapas: [], origen: "", cargando: false, error: error.message });
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
    setResultado({ mapas: [], origen: "", cargando: true, error: "" });
    // numero permite volver a buscar el mismo texto al pulsar el botÃ³n.
    setPeticion((anterior) => ({ texto, numero: anterior.numero + 1 }));
  }

  function alternarFavorito(mapa) {
    setFavoritos((anteriores) =>
      anteriores.some((favorito) => favorito.id === mapa.id)
        ? anteriores.filter((favorito) => favorito.id !== mapa.id)
        : [mapa, ...anteriores]
    );
  }

  function alternarComparacion(id) {
    setSeleccion((anterior) => {
      if (anterior.includes(id)) return anterior.filter((actual) => actual !== id);
      return anterior.length < 2 ? [...anterior, id] : [anterior[1], id];
    });
  }

  // Estos valores se DERIVAN durante el render: no necesitan useState ni useEffect.
  const base = soloFavoritos ? favoritos : resultado.mapas;
  const visibles = filtrarMapas(base, modo);
  const comparados = seleccion.map((id) => base.find((mapa) => mapa.id === id)).filter(Boolean);

  return (
    <>
      <header className="cabecera">
        <a className="marca" href="./"><span className="orbe" aria-hidden="true">a</span> aerobeat</a>
        <span className="subtitulo">M3 Â· Reactor Core Â· React 19</span>
        <a href="https://osu.ppy.sh/" target="_blank" rel="noopener noreferrer">Conoce osu!</a>
      </header>
      <main className="ventana">
        <div className="barra-ventana"><span>Aerobeat / Explorador de mapas</span><span>EDICIÃ“N REACT</span></div>
        <section className="presentacion" aria-labelledby="titulo">
          <div>
            <p className="antetitulo">MÃšSICA. CÃRCULOS. Y UN POCO DE NOSTALGIA.</p>
            <h1 id="titulo">Encuentra tu ritmo.</h1>
            <p>Busca mapas de osu!, guarda tus favoritos y compara dificultades.</p>
          </div>
          <div className="disco" aria-hidden="true"><span>osu!</span></div>
        </section>
        <section className="explorador" aria-label="Buscador de mapas">
          <Buscador
            consulta={consulta}
            onConsulta={setConsulta}
            onBuscar={enviarBusqueda}
            cargando={resultado.cargando}
          />
          <Filtros
            modo={modo}
            onModo={setModo}
            soloFavoritos={soloFavoritos}
            onFavoritos={(activo) => { setSoloFavoritos(activo); setSeleccion([]); }}
            cantidad={favoritos.length}
          />
          <div className="resultados-cabecera"><h2>{soloFavoritos ? "Mi biblioteca" : "Tu selecciÃ³n"}</h2></div>
          <Comparador mapas={comparados} onLimpiar={() => setSeleccion([])} />
          <ListaMapas
            mapas={visibles}
            cargando={resultado.cargando}
            error={resultado.error}
            origen={resultado.origen}
            soloFavoritos={soloFavoritos}
            favoritos={favoritos}
            seleccion={seleccion}
            onFavorito={alternarFavorito}
            onComparar={alternarComparacion}
          />
        </section>
        <footer className="pie-ventana">
          <span>Descarga el .osz y Ã¡brelo con osu! para instalarlo.</span>
          <span>La API muestra como mÃ¡ximo 24 resultados por bÃºsqueda.</span>
        </footer>
      </main>
      <footer className="pie">La M2, reconstruida en React. <span>@Mendo Â· Web I</span></footer>
    </>
  );
}