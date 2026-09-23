const express = require('express');
const path = require('node:path');
const expressLayouts = require('express-ejs-layouts');
const { leerArchivoJson } = require('./archivos.js');

const PORT = process.env.PORT || 3000;
const rutaJson = path.join(__dirname, '..', 'datos', 'mascotas.json');

// Arreglo en memoria para la sesión activa
let mascotas = [];

async function main() {
  try {
    // 1. Cargar datos iniciales antes de iniciar el servidor
    mascotas = await leerArchivoJson(rutaJson);

    const app = express();

    // 2. Configurar Express y EJS Layouts
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'views'));
    app.use(expressLayouts);
    app.set('layout', 'layouts/main');

    // 3. Middlewares para estáticos y parseo de formularios
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use(express.urlencoded({ extended: false }));

    // 4. RUTAS DEL CONTRATO OBLIGATORIO

    // GET / (Inicio)
    app.get('/', (req, res) => {
      res.render('inicio', { titulo: 'Inicio - Adopción de Mascotas' });
    });

    // GET /mascotas (Listado)
    app.get('/mascotas', (req, res) => {
      res.render('mascotas/lista', { 
        titulo: 'Catálogo de Mascotas', 
        mascotas 
      });
    });

    // GET /mascotas/nueva (Formulario) - Declarada ANTES de /mascotas/:id
    app.get('/mascotas/nueva', (req, res) => {
      res.render('mascotas/nueva', { 
        titulo: 'Agregar Nueva Mascota',
        error: null,
        valores: {}
      });
    });

    // GET /mascotas/:id (Detalle)
    app.get('/mascotas/:id', (req, res) => {
      const id = parseInt(req.params.id, 10);
      const mascota = mascotas.find(m => m.id === id);

      if (!mascota) {
        return res.status(404).render('no-encontrado', { 
          titulo: 'Página no encontrada' 
        });
      }

      res.render('mascotas/detalle', { 
        titulo: `Detalle de ${mascota.nombre}`, 
        mascota 
      });
    });

    // POST /mascotas (Procesamiento de formulario)
    app.post('/mascotas', (req, res) => {
      const { nombre, especie, edad, estado, descripcion } = req.body;
      const edadNum = Number(edad);

      // Validaciones
      const estadosPermitidos = ['En adopción', 'Reservada', 'Adoptada'];
      let error = null;

      if (!nombre || !especie || !edad || !estado || !descripcion) {
        error = 'Todos los campos son obligatorios.';
      } else if (isNaN(edadNum) || edadNum < 0) {
        error = 'La edad debe ser un número igual o mayor a 0.';
      } else if (!estadosPermitidos.includes(estado)) {
        error = 'El estado seleccionado no es válido.';
      }

      // Si hay error, responder 400 y conservar los valores ingresados
      if (error) {
        return res.status(400).render('mascotas/nueva', {
          titulo: 'Agregar Nueva Mascota',
          error,
          valores: { nombre, especie, edad, estado, descripcion }
        });
      }

      // Generar nuevo ID único
      const nuevoId = mascotas.length > 0 ? Math.max(...mascotas.map(m => m.id)) + 1 : 1;

      const nuevaMascota = {
        id: nuevoId,
        nombre: nombre.trim(),
        especie: especie.trim(),
        edad: edadNum,
        estado,
        descripcion: descripcion.trim(),
        imagen: '/img/mascota.svg'
      };

      // Guardar SOLO en memoria (sin modificar mascotas.json)
      mascotas.push(nuevaMascota);

      // Redirección POST-Redirect-GET
      res.redirect('/mascotas');
    });

    // Middleware 404 para cualquier otra ruta no definida
    app.use((req, res) => {
      res.status(404).render('no-encontrado', { 
        titulo: 'Página no encontrada' 
      });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor iniciado con éxito en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error al iniciar la aplicación:', error.message);
    process.exit(1);
  }
}

main();