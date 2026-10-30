export default function Buscador({ consulta, onConsulta, onBuscar, cargando }) {
  return (
    <form onSubmit={onBuscar}>
      <label htmlFor="consulta">CanciÃ³n, artista o creador</label>
      <div className="fila-busqueda">
        <input
          id="consulta"
          type="search"
          value={consulta}
          onChange={(evento) => onConsulta(evento.target.value)}
          placeholder="Por ejemplo: Nevada, Camelliaâ€¦"
          maxLength={100}
          required
        />
        <button type="submit" disabled={cargando}>
          {cargando ? "Buscandoâ€¦" : "Buscar mapas"}
        </button>
      </div>
    </form>
  );
}