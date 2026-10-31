export default function Ordenador({ orden, onOrden }) {
  return (
    <div className="ordenador">
      <label htmlFor="orden-mapas">Ordenar por</label>
      <select id="orden-mapas" value={orden} onChange={(evento) => onOrden(evento.target.value)}>
        <option value="original">Relevancia</option>
        <option value="titulo">Título (A-Z)</option>
        <option value="artista">Artista (A-Z)</option>
        <option value="dificultades">Más dificultades</option>
      </select>
    </div>
  );
}