# Aerobeat React — M3 · Reactor Core

**Alumno:** @Mendo · Web Development I · U-tad

**Origen:** evolución de [M2 · Async Odyssey](https://github.com/mend0x/mision2). El nuevo repositorio conserva la historia de commits de M2 y añade los cambios de M3. No es una aplicación sin relación con la misión anterior.

## Qué hace

Busca hasta 24 sets de mapas de osu! con la API de hinai, permite filtrar por modo de juego, abrir la ficha y descargar el `.osz`. Conserva la estética Frutiger Aero de M2. Las novedades de M3 son **favoritos persistentes** (también visibles sin conexión si ya estaban guardados) y **comparación de dos sets** según su número de dificultades. Si eliges un tercero, sustituye al primero. La información de dificultades es cuantitativa: más dificultades no significa necesariamente mayor dificultad técnica.

## Instalación

Requisitos: Node.js 22.12 o superior, npm.

```bash
npm install
npm run dev
```

Para comprobar la entrega:

```bash
npm run lint
npm run build
```

## Evolución técnica de M2 a M3

| En M2 (JavaScript puro) | En M3 (React 19) |
| --- | --- |
| `querySelector`, `innerHTML`, `createElement` | Componentes JSX que React actualiza |
| `main.js` coordina el DOM | `App.jsx` mantiene el estado compartido |
| `render.js` dibuja tarjetas manualmente | `ListaMapas` y `TarjetaMapa` con `map` y `key={mapa.id}` |
| Filtros mediante DOM | `filtrarMapas` produce valores derivados |
| `fetch` controlado desde eventos | `useEffect` consulta la API y cancela con `AbortController` |
| Caché por consulta | Se mantiene la caché original de M2 en `api.js` |

## Estructura y responsabilidades

- `src/App.jsx`: estado compartido, búsqueda, favoritos, comparación y props.
- `src/components/Buscador.jsx`: formulario controlado, recibe valor y eventos por props.
- `src/components/Filtros.jsx`: modo y selector de biblioteca.
- `src/components/ListaMapas.jsx`: mensajes condicionales y lista con keys estables.
- `src/components/TarjetaMapa.jsx`: tarjeta reutilizable y acciones.
- `src/components/Comparador.jsx`: comparación derivada de dos mapas.
- `src/hooks/useLocalStorage.js`: hook reutilizable de estado persistente, con sincronización entre pestañas y cleanup.
- `src/api.js`: fetch, comprobación HTTP, caché, enlace de descarga.
- `src/logica.js`: transformar, filtrar y contar sin mutar arrays.
- `src/style.css`: estilo Frutiger Aero de M2 ampliado para M3.

## Estado, efectos y listas

`consulta` representa el texto que se escribe; `peticion` identifica la búsqueda enviada. Separarlos permite escribir sin solicitar la API en cada tecla y repetir una consulta al pulsar Buscar. `resultado` guarda datos y estado de la petición (cargando/error/origen). `modo`, `soloFavoritos` y `seleccion` son estados pequeños. Los mapas visibles y los comparados **se derivan durante el render**; no se duplican en `useState`.

El efecto de búsqueda depende de `peticion`, lee un servicio externo y cancela la petición anterior durante la limpieza (`AbortController`). El hook `useLocalStorage` usa un efecto `[clave, valor]` para guardar y otro `[clave]` para escuchar `storage`, retirando el listener en el cleanup. La vista muestra mensajes diferentes ante carga, error, vacío y resultados; `key={mapa.id}` es estable. `setFavoritos` y `setSeleccion` usan actualizaciones funcionales e inmutables.

## Uso de IA

Se ha utilizado ChatGPT para analizar el código público de M2, proponer la migración a React 19, generar componentes JSX, diseñar los nuevos estados y efectos, crear el hook de persistencia, ampliar el diseño, redactar esta documentación y sugerir comprobaciones. La base de la aplicación, la API, la lógica de filtrado y la estética vienen de M2. Se declara este apoyo y no se presenta la generación automática como código escrito sin asistencia. El alumno es responsable de ejecutar, comprobar y comprender el código antes de defenderlo línea a línea.

## Autopsia

1. **Decisión: conservar M2 en lugar de empezar otra idea.** Esto demuestra la diferencia entre una interfaz imperativa y una declarativa. Se eliminan los archivos que manipulaban el DOM manualmente para no mantener dos implementaciones contradictorias.
2. **Decisión: evitar estado duplicado.** `visibles` se obtiene con `filter`, y los mapas de la comparación con `find`. No existe un efecto para recalcular lo que ya sabemos con JavaScript.
3. **Decisión: cancelar solicitudes.** Si se lanza otra búsqueda o se desmonta el componente, el `AbortController` evita actualizar la interfaz con una respuesta obsoleta.
4. **Decisión: favoritos locales.** `useLocalStorage` evita montar un backend. A cambio, los favoritos dependen del navegador y pueden perderse al borrar sus datos.
5. **Decisión: comparar número de dificultades.** No interpretamos ese número como dificultad real de jugar. Es una comparación sencilla, comprensible y honesta con los datos disponibles.

## Limitaciones

- La API puede fallar, cambiar o devolver menos de 24 sets; los filtros afectan únicamente a los resultados recibidos.
- Los mapas guardados en favoritos pueden contener metadatos antiguos.
- La caché de búsquedas no caduca automáticamente (heredada de M2).
- Los enlaces de descarga dependen de un tercero; una descarga no está garantizada.
- Sin red no pueden realizarse nuevas búsquedas, aunque los favoritos guardados sí pueden visualizarse.

## Comprobaciones manuales

1. Buscar `nevada`, cambiar de modo y comprobar el contador.
2. Guardar un favorito, recargar y encontrarlo en `Mis favoritos`.
3. Abrir la app en dos pestañas y comprobar que se sincronizan los favoritos.
4. Comparar dos mapas y seleccionar un tercero para sustituir al primero.
5. Buscar algo inexistente, comprobar el vacío y probar el modo sin conexión.
6. Ejecutar `npm run lint` y `npm run build` antes de entregar.

No se incluyen `node_modules` ni `dist` en Git. Proyecto académico sin afiliación con osu! o hinai. Portadas de osu! y enlaces de terceros.