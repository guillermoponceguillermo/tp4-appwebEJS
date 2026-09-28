# Trabajo Práctico 04: Aplicación web con EJS

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
