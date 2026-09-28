# Trabajo práctico 04

## Descripción
Aplicación web para consultar mascotas en adopción y registrar nuevas fichas temporalmente. Está desarrollada con Node.js, Express y EJS; las páginas se renderizan como HTML.

## Instalación
Requiere Node.js 18 o superior y npm. Desde esta carpeta, instala las dependencias:

```bash
npm install
```

## Ejecución
```bash
npm start
```

Abre `http://localhost:3000`. Para comprobar la sintaxis de los archivos fuente:

```bash
npm run check
```

## Páginas y rutas
| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/` | Página inicial con enlaces al catálogo y al formulario. |
| GET | `/mascotas` | Catálogo con las mascotas iniciales o mensaje de estado vacío. |
| GET | `/mascotas/nueva` | Formulario para publicar una ficha. |
| GET | `/mascotas/:id` | Detalle completo; responde 404 con HTML si no existe. |
| POST | `/mascotas` | Valida y agrega una ficha temporalmente, luego redirige al catálogo. |
| Cualquier otra | — | Página HTML 404. |

## Estructura de vistas
- `views/layouts/main.ejs` es el layout: define el documento HTML compartido y el espacio donde se inserta el contenido de cada página.
- `views/inicio.ejs`, `views/mascotas/*.ejs` y `views/no-encontrado.ejs` son vistas: contienen el contenido específico de cada respuesta.
- `views/partials/encabezado.ejs` y `views/partials/pie.ejs` son parciales: fragmentos reutilizables incluidos por el layout.

Las rutas envían datos a las vistas con `res.render(nombre, datos)`. Por ejemplo, el listado recibe el arreglo `mascotas`; EJS lo recorre y muestra las variables con `<%= ... %>`, que escapa la salida. El layout sólo usa salida sin escapar para el cuerpo generado por Express EJS Layouts y para los parciales controlados.

## Recursos estáticos
`express.static` publica el contenido de `public/` en la raíz de las URLs. Por eso la hoja se solicita como `/css/estilos.css`, la ilustración como `/img/mascota.svg` y el JavaScript como `/js/app.js`; no se incluye `/public` en los enlaces. El CSS contiene navegación, grilla adaptable, tarjetas, formulario, alerta y foco visible. El archivo JavaScript escribe un mensaje en la consola del navegador.

## Formulario
El formulario envía `POST /mascotas`. `express.urlencoded({ extended: false })` interpreta los campos y los deja disponibles en `req.body`. El servidor recorta los textos, comprueba que todos los campos estén completos, convierte la edad a número no negativo y verifica que el estado sea `En adopción`, `Reservada` o `Adoptada`. Si falla, responde 400, muestra `role="alert"` y conserva los valores ingresados.

Si la validación pasa, la aplicación asigna un ID creciente, usa `/img/mascota.svg`, agrega el registro al arreglo en memoria y responde con una redirección a `/mascotas`. El navegador hace después un GET separado; este recorrido POST-redirección-GET evita que recargar el catálogo reenvíe el formulario.

## Persistencia de los datos
Al iniciar, el servidor lee `datos/mascotas.json` antes de comenzar a escuchar. Si la lectura o el parseo falla, no inicia el servidor. Las cinco fichas del JSON son los datos iniciales; las nuevas fichas sólo viven en el arreglo de memoria y no se guardan en archivos. Por eso, al reiniciar, las altas desaparecen y se vuelven a cargar las cinco fichas originales.# Trabajo Práctico 04: Aplicación web con EJS

Aplicación para consultar mascotas en adopción y registrar nuevas mascotas temporalmente en memoria. Está desarrollada con Node.js, Express, EJS y `express-ejs-layouts`.

## Requisitos
- Node.js 18 o superior
- npm

## Instalación y ejecución
Desde esta carpeta, instalar las dependencias:
```bash
npm install
```

Iniciar el servidor:
```bash
npm start
```

Abrir `http://localhost:3000`. Para verificar la sintaxis de los archivos fuente:
```bash
npm run check
```

El puerto puede cambiarse definiendo la variable de entorno `PORT`.

## Estructura
```text
datos/mascotas.json       Datos iniciales de mascotas
public/css/estilos.css    Estilos
public/img/mascota.svg    Imagen local usada por los registros
public/js/app.js          JavaScript del cliente
src/archivos.js           Lectura de JSON
src/index.js              Configuración, rutas y servidor Express
views/layouts/main.ejs    Layout compartido
views/partials/           Encabezado y pie
views/mascotas/           Vistas del catálogo, detalle y formulario
views/inicio.ejs          Vista de inicio
views/no-encontrado.ejs   Vista HTML de error 404
```

## Rutas
| Método | Ruta | Comportamiento |
| --- | --- | --- |
| GET | `/` | Muestra la página de inicio. |
| GET | `/mascotas` | Muestra el catálogo cargado desde `datos/mascotas.json`. |
| GET | `/mascotas/nueva` | Muestra el formulario de alta. |
| POST | `/mascotas` | Valida y agrega una mascota a la lista en memoria. |
| GET | `/mascotas/:id` | Muestra el detalle; si el ID no existe, responde 404 con una vista HTML. |
| Cualquier otra ruta | — | Responde 404 con la misma vista HTML. |

## Alta de mascotas
El formulario envía sus datos mediante `POST /mascotas`. El servidor valida que los campos estén completos, que la edad sea un entero no negativo y que el estado sea `En adopción`, `Reservada` o `Adoptada`. Si los datos no son válidos, vuelve a mostrar el formulario con un mensaje y conserva los valores ingresados. Si son válidos, asigna un ID, agrega el registro sólo al arreglo en memoria y responde con una redirección a `/mascotas` (patrón POST-redirección-GET). Los registros creados de esta forma se pierden al reiniciar el servidor y no modifican el JSON inicial.

Los cinco registros de `datos/mascotas.json` se cargan antes de iniciar el servidor. Si el archivo no se puede leer o no contiene JSON válido, el inicio informa el error en lugar de presentar silenciosamente un catálogo vacío.
