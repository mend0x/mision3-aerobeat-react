export default function Filtros({ modo, onModo, soloFavoritos, onFavoritos, cantidad }) {
  return (
    <div className="filtros">
      <label htmlFor="modo">Modo de juego</label>
      <select id="modo" value={modo} onChange={(e) => onModo(e.target.value)}>
        <option value="todos">Todos los modos</option>
        <option value="osu">osu!</option>
        <option value="taiko">osu!taiko</option>
        <option value="fruits">osu!catch</option>
        <option value="mania">osu!mania</option>
      </select>
      <button
        type="button"
        className={soloFavoritos ? "activo" : ""}
        onClick={() => onFavoritos(!soloFavoritos)}
        aria-pressed={soloFavoritos}
      >
        {soloFavoritos ? "Ver bÃºsqueda" : `Mis favoritos (${cantidad})`}
      </button>
      <span>El filtro afecta a los 24 sets recibidos o a tus favoritos.</span>
    </div>
  );
}