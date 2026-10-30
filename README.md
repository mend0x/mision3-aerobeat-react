# Aerobeat React â€” M3 Â· Reactor Core

**Alumno:** @Mendo Â· Web Development I Â· U-tad

**Origen:** evoluciÃ³n de [M2 Â· Async Odyssey](https://github.com/mend0x/mision2). El nuevo repositorio conserva la historia de commits de M2 y aÃ±ade los cambios de M3. No es una aplicaciÃ³n sin relaciÃ³n con la misiÃ³n anterior.

## QuÃ© hace

Busca hasta 24 sets de mapas de osu! con la API de hinai, permite filtrar por modo de juego, abrir la ficha y descargar el `.osz`. Conserva la estÃ©tica Frutiger Aero de M2. Las novedades de M3 son **favoritos persistentes** (tambiÃ©n visibles sin conexiÃ³n si ya estaban guardados) y **comparaciÃ³n de dos sets** segÃºn su nÃºmero de dificultades. Si eliges un tercero, sustituye al primero. La informaciÃ³n de dificultades es cuantitativa: mÃ¡s dificultades no significa necesariamente mayor dificultad tÃ©cnica.

## InstalaciÃ³n

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

## EvoluciÃ³n tÃ©cnica de M2 a M3

| En M2 (JavaScript puro) | En M3 (React 19) |
| --- | --- |
| `querySelector`, `innerHTML`, `createElement` | Componentes JSX que React actualiza |
| `main.js` coordina el DOM | `App.jsx` mantiene el estado compartido |
| `render.js` dibuja tarjetas manualmente | `ListaMapas` y `TarjetaMapa` con `map` y `key={mapa.id}` |
| Filtros mediante DOM | `filtrarMapas` produce valores derivados |
| `fetch` controlado desde eventos | `useEffect` consulta la API y cancela con `AbortController` |
| CachÃ© por consulta | Se mantiene la cachÃ© original de M2 en `api.js` |

## Estructura y responsabilidades

- `src/App.jsx`: estado compartido, bÃºsqueda, favoritos, comparaciÃ³n y props.
- `src/components/Buscador.jsx`: formulario controlado, recibe valor y eventos por props.
- `src/components/Filtros.jsx`: modo y selector de biblioteca.
- `src/components/ListaMapas.jsx`: mensajes condicionales y lista con keys estables.
- `src/components/TarjetaMapa.jsx`: tarjeta reutilizable y acciones.
- `src/components/Comparador.jsx`: comparaciÃ³n derivada de dos mapas.
- `src/hooks/useLocalStorage.js`: hook reutilizable de estado persistente, con sincronizaciÃ³n entre pestaÃ±as y cleanup.
- `src/api.js`: fetch, comprobaciÃ³n HTTP, cachÃ©, enlace de descarga.
- `src/logica.js`: transformar, filtrar y contar sin mutar arrays.
- `src/style.css`: estilo Frutiger Aero de M2 ampliado para M3.

## Estado, efectos y listas

`consulta` representa el texto que se escribe; `peticion` identifica la bÃºsqueda enviada. Separarlos permite escribir sin solicitar la API en cada tecla y repetir una consulta al pulsar Buscar. `resultado` guarda datos y estado de la peticiÃ³n (cargando/error/origen). `modo`, `soloFavoritos` y `seleccion` son estados pequeÃ±os. Los mapas visibles y los comparados **se derivan durante el render**; no se duplican en `useState`.

El efecto de bÃºsqueda depende de `peticion`, lee un servicio externo y cancela la peticiÃ³n anterior durante la limpieza (`AbortController`). El hook `useLocalStorage` usa un efecto `[clave, valor]` para guardar y otro `[clave]` para escuchar `storage`, retirando el listener en el cleanup. La vista muestra mensajes diferentes ante carga, error, vacÃ­o y resultados; `key={mapa.id}` es estable. `setFavoritos` y `setSeleccion` usan actualizaciones funcionales e inmutables.

## Uso de IA

Se ha utilizado ChatGPT para analizar el cÃ³digo pÃºblico de M2, proponer la migraciÃ³n a React 19, generar componentes JSX, diseÃ±ar los nuevos estados y efectos, crear el hook de persistencia, ampliar el diseÃ±o, redactar esta documentaciÃ³n y sugerir comprobaciones. La base de la aplicaciÃ³n, la API, la lÃ³gica de filtrado y la estÃ©tica vienen de M2. Se declara este apoyo y no se presenta la generaciÃ³n automÃ¡tica como cÃ³digo escrito sin asistencia. El alumno es responsable de ejecutar, comprobar y comprender el cÃ³digo antes de defenderlo lÃ­nea a lÃ­nea.

## Autopsia

1. **DecisiÃ³n: conservar M2 en lugar de empezar otra idea.** Esto demuestra la diferencia entre una interfaz imperativa y una declarativa. Se eliminan los archivos que manipulaban el DOM manualmente para no mantener dos implementaciones contradictorias.
2. **DecisiÃ³n: evitar estado duplicado.** `visibles` se obtiene con `filter`, y los mapas de la comparaciÃ³n con `find`. No existe un efecto para recalcular lo que ya sabemos con JavaScript.
3. **DecisiÃ³n: cancelar solicitudes.** Si se lanza otra bÃºsqueda o se desmonta el componente, el `AbortController` evita actualizar la interfaz con una respuesta obsoleta.
4. **DecisiÃ³n: favoritos locales.** `useLocalStorage` evita montar un backend. A cambio, los favoritos dependen del navegador y pueden perderse al borrar sus datos.
5. **DecisiÃ³n: comparar nÃºmero de dificultades.** No interpretamos ese nÃºmero como dificultad real de jugar. Es una comparaciÃ³n sencilla, comprensible y honesta con los datos disponibles.

## Limitaciones

- La API puede fallar, cambiar o devolver menos de 24 sets; los filtros afectan Ãºnicamente a los resultados recibidos.
- Los mapas guardados en favoritos pueden contener metadatos antiguos.
- La cachÃ© de bÃºsquedas no caduca automÃ¡ticamente (heredada de M2).
- Los enlaces de descarga dependen de un tercero; una descarga no estÃ¡ garantizada.
- Sin red no pueden realizarse nuevas bÃºsquedas, aunque los favoritos guardados sÃ­ pueden visualizarse.

## Comprobaciones manuales

1. Buscar `nevada`, cambiar de modo y comprobar el contador.
2. Guardar un favorito, recargar y encontrarlo en `Mis favoritos`.
3. Abrir la app en dos pestaÃ±as y comprobar que se sincronizan los favoritos.
4. Comparar dos mapas y seleccionar un tercero para sustituir al primero.
5. Buscar algo inexistente, comprobar el vacÃ­o y probar el modo sin conexiÃ³n.
6. Ejecutar `npm run lint` y `npm run build` antes de entregar.

No se incluyen `node_modules` ni `dist` en Git. Proyecto acadÃ©mico sin afiliaciÃ³n con osu! o hinai. Portadas de osu! y enlaces de terceros.