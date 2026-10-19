# Registro de cambios — Punto 3.4

## 1. Información general

- **Nombre del taller:** Punto 3.4 — Arquitectura y Organización del Software.
- **Repositorio trabajado:** [crgonzalez3212/Guia5Arquitectura](https://github.com/crgonzalez3212/Guia5Arquitectura), copia local abierta en Visual Studio Code.
- **Fecha de ejecución:** 19 de octubre de 2026.
- **Estado final:** refactorización del frontend completada; pruebas del servicio e integración HTTP y de interfaz verificadas.

## 2. Cambios realizados

| Archivo | Tipo | Cambio comprobable | Motivo y mejora arquitectónica |
|---|---|---|---|
| `backend/package.json` | Modificado | Se agregó el script `test` con el ejecutor de pruebas integrado de Node.js (`node --test`). | Permite ejecutar las pruebas del backend sin agregar una dependencia de pruebas. |
| `backend/test/taskService.test.js` | Creado | Se añadieron seis pruebas para creación, normalización, validaciones de título, actualización de estado y errores 400/404. | Aísla y verifica las reglas de negocio del servicio. |
| `frontend/index.html` | Modificado | El punto de entrada `app.js` ahora se carga con `type="module"`. | Habilita la separación de la aplicación web en módulos nativos, sin añadir herramientas ni dependencias. |
| `frontend/src/app.js` | Modificado | Se dejó como coordinador de eventos y flujo de pantalla; delega las peticiones a `taskApi.js` y la presentación a `taskView.js`. También informa si falta el selector asociado al botón de estado. | Reduce las responsabilidades del módulo y facilita entender y mantener la coordinación de la interfaz. |
| `frontend/src/taskApi.js` | Creado | Agrupa las operaciones HTTP para listar, crear y actualizar tareas. | Encapsula el acceso a la API y evita mezclar `fetch` con el renderizado y los eventos de pantalla. |
| `frontend/src/taskView.js` | Creado | Agrupa el escape de texto, el renderizado de tareas y los mensajes/estado visuales. | Mantiene la presentación separada del transporte HTTP y del flujo de interacción. |
| `CAMBIOS_PUNTO_3_4.md` | Creado | Registra el análisis, cambios, verificaciones y limitaciones del taller. | Deja evidencia reproducible del trabajo realizado. |
| `DOCUMENTACION_ARQUITECTURA.md` | Creado | Describe la arquitectura comprobada antes y después de los cambios. | Facilita explicar la solución durante la sustentación. |

No se modificaron los módulos del backend (`domain.js`, `taskService.js`, `taskRepository.js`, `taskController.js`, `taskRoutes.js` y `server.js`): la inspección confirmó que sus responsabilidades principales ya estaban separadas y conectadas mediante inyección de dependencias.

## 3. Problemas de arquitectura identificados

En el proyecto original, `frontend/src/app.js` reunía responsabilidades distintas:

1. **Comunicación HTTP:** definía la URL, ejecutaba `fetch`, preparaba las cabeceras y procesaba respuestas y errores.
2. **Presentación:** escapaba contenido e insertaba en el DOM el HTML de las tareas y los estados de la API.
3. **Coordinación de interacciones:** enlazaba el envío del formulario, la actualización de la lista y el guardado de estados; además coordinaba las llamadas HTTP y los mensajes para el usuario.

La combinación acoplaba la interfaz a los detalles de transporte y hacía más difícil probar o cambiar cada responsabilidad de forma independiente. Se abordó separando el cliente HTTP (`taskApi.js`), la presentación (`taskView.js`) y la coordinación (`app.js`).

El backend ya separaba rutas, controlador, servicio y repositorio. El servicio valida títulos y estados; el repositorio mantiene los datos en memoria; y `server.js` construye e inyecta las dependencias. No se identificó evidencia para justificar cambios artificiales en esas capas. La ausencia inicial de pruebas automatizadas sí dificultaba comprobar las reglas del servicio y se abordó con pruebas nativas de Node.js.

## 4. Pruebas y verificaciones

### Aprobadas

- **Pruebas unitarias:** `cd backend` y `npm test` — 6 pruebas aprobadas, 0 fallidas. Se cubrieron creación y normalización de una tarea, títulos inválidos, estados válidos e inválidos y tarea inexistente.
- **Sintaxis:** `node --check` sobre los tres módulos del frontend, los seis módulos existentes del backend y el archivo de pruebas — todos finalizaron sin errores.
- **Integración HTTP:** backend iniciado en un puerto de prueba; `GET /api/health`, `GET /api/tasks`, `POST /api/tasks` y `PATCH /api/tasks/:id/status` respondieron con los datos esperados. Se confirmó que la tarea creada aparecía en el listado con su estado actualizado.
- **Interfaz en navegador:** se sirvió el frontend por HTTP y se comprobó que cargara las tareas, permitiera crear una tarea y guardar su estado como `finalizada`.
- **Formato del diff:** `git diff --check` — sin errores de espacios en blanco.
- **Dependencias necesarias para la comprobación:** `npm install --no-save --no-package-lock` en `backend/` completó; no se cambió el manifiesto ni se generó un lockfile. El resultado indicó 0 vulnerabilidades en esa instalación.

### Fallidas o reintentadas

- Los primeros comandos `npm test` y `node --check` se invocaron desde la raíz, donde no existe `package.json` y desde donde las rutas `src/...` no existen. Esas invocaciones terminaron con error de ruta; se repitieron desde los directorios/rutas correctos y las pruebas y comprobaciones de sintaxis aprobaron.
- Un primer intento de `npm start` desde la raíz falló porque allí no hay `package.json`.
- El primer intento de `npm start` desde `backend/` no pudo arrancar porque todavía no estaban instaladas las dependencias y faltaba `express`. Después de instalar las dependencias ya declaradas, se verificó correctamente la API mediante las operaciones HTTP descritas arriba.
- Una comprobación auxiliar de la página con `Invoke-WebRequest` no pudo ejecutarse en el PowerShell no interactivo; se sustituyó por `curl.exe`, que confirmó la respuesta HTTP 200 del servidor estático.
- En la primera carga del navegador apareció un error transitorio de recurso y la página permaneció en estado de conexión; al recargar, los módulos cargaron y el flujo de creación/actualización se completó. La prueba exitosa se realizó después de esa recarga.

### No ejecutadas

- No se ejecutaron pruebas automatizadas de frontend ni una batería en múltiples navegadores. El frontend se validó mediante el flujo interactivo en el navegador disponible.
- No se probó persistencia en una base de datos: la aplicación original usa almacenamiento en memoria y no incluye una base de datos.
- No se ejecutó una matriz de pruebas con otras versiones de Node.js.

## 5. Archivos sin cambios

No fue necesario cambiar la implementación del backend ni `frontend/styles.css`: sus responsabilidades y estilos existentes no impedían separar los módulos del frontend. `frontend/index.html` sí se modificó para activar los módulos JavaScript.

## 6. Pendientes y limitaciones

- Las tareas se guardan en memoria y se reinician al detener el backend; esto ya era una característica indicada por la interfaz y no se reemplazó por una base de datos.
- No se añadieron pruebas unitarias automatizadas de la interfaz. La creación y actualización se comprobó manualmente en navegador.
- Para ampliar la validación, queda ejecutar los mismos controles en otros navegadores y versiones de Node.js que el proyecto decida soportar.

## 7. Resumen final

Se mantuvo la arquitectura backend existente y se separaron en módulos independientes el acceso HTTP, la presentación y la coordinación de la interfaz. Se agregaron seis pruebas del servicio y se comprobó el flujo de salud, listado, creación y actualización tanto por HTTP como desde el navegador. La separación reduce el acoplamiento y facilita modificar y verificar cada responsabilidad sin introducir dependencias nuevas.
