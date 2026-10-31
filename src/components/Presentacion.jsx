export default function Presentacion() {
  return (
    <section className="presentacion" aria-labelledby="titulo">
      <div>
        <p className="antetitulo">MÚSICA. CÍRCULOS. Y UN POCO DE NOSTALGIA.</p>
        <h1 id="titulo">Encuentra tu ritmo.</h1>
        <p>Busca mapas de osu!, guarda tus favoritos y compara dificultades.</p>
      </div>
      <div className="disco" aria-hidden="true"><span>osu!</span></div>
    </section>
  );
}