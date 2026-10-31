export default function Cabecera() {
  return (
    <header className="cabecera">
      <a className="marca" href="./">
        <span className="orbe" aria-hidden="true">a</span> aerobeat
      </a>
      <span className="subtitulo">M3 · Reactor Core · React 19</span>
      <a href="https://osu.ppy.sh/" target="_blank" rel="noopener noreferrer">
        Conoce osu!
      </a>
    </header>
  );
}