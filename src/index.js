const express = require('express');
const path = require('node:path');
const expressLayouts = require('express-ejs-layouts');
const { leerArchivoJson } = require('./archivos.js');

const PORT = process.env.PORT || 3000;
const rutaJson = path.join(__dirname, '..', 'datos', 'mascotas.json');
const estadosPermitidos = ['En adopción', 'Reservada', 'Adoptada'];

async function iniciarServidor() {
  try {
    const mascotasIniciales = await leerArchivoJson(rutaJson);
    if (!Array.isArray(mascotasIniciales)) {
      throw new Error('El archivo inicial debe contener una lista de mascotas.');
    }

    let mascotas = mascotasIniciales;
    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'views'));
    app.use(expressLayouts);
    app.set('layout', 'layouts/main');
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use(express.urlencoded({ extended: false }));

    app.get('/', (req, res) => {
      res.render('inicio', { titulo: 'Inicio | Patitas cerca' });
    });

    app.get('/mascotas', (req, res) => {
      res.render('mascotas/lista', {
        titulo: 'Mascotas | Patitas cerca',
        mascotas
      });
    });

    app.get('/mascotas/nueva', (req, res) => {
      res.render('mascotas/nueva', {
        titulo: 'Publicar mascota | Patitas cerca',
        error: null,
        valores: {}
      });
    });

    app.get('/mascotas/:id', (req, res) => {
      const id = Number(req.params.id);
      const mascota = mascotas.find((item) => item.id === id);

      if (!Number.isInteger(id) || !mascota) {
        return res.status(404).render('no-encontrado', {
          titulo: 'Página no encontrada',
          mensaje: 'No encontramos una mascota con ese identificador.'
        });
      }

      res.render('mascotas/detalle', {
        titulo: `${mascota.nombre} | Patitas cerca`,
        mascota
      });
    });

    app.post('/mascotas', (req, res) => {
      const campoOriginal = (nombre) => (
        typeof req.body?.[nombre] === 'string' ? req.body[nombre] : ''
      );
      const valores = {
        nombre: campoOriginal('nombre'),
        especie: campoOriginal('especie'),
        edad: campoOriginal('edad'),
        estado: campoOriginal('estado'),
        descripcion: campoOriginal('descripcion')
      };
      const nombre = valores.nombre.trim();
      const especie = valores.especie.trim();
      const edadTexto = valores.edad.trim();
      const edad = Number(edadTexto);
      const estado = valores.estado.trim();
      const descripcion = valores.descripcion.trim();
      let error = null;

      if (!nombre || !especie || !edadTexto || !estado || !descripcion) {
        error = 'Completa todos los campos antes de enviar el formulario.';
      } else if (!Number.isFinite(edad) || edad < 0) {
        error = 'La edad debe ser un número igual o mayor que cero.';
      } else if (!estadosPermitidos.includes(estado)) {
        error = 'Selecciona uno de los estados permitidos.';
      }

      if (error) {
        return res.status(400).render('mascotas/nueva', {
          titulo: 'Publicar mascota | Patitas cerca',
          error,
          valores
        });
      }

      const nuevoId = Math.max(...mascotas.map((mascota) => mascota.id), 0) + 1;
      mascotas.push({
        id: nuevoId,
        nombre,
        especie,
        edad,
        estado,
        descripcion,
        imagen: '/img/mascota.svg'
      });

      res.redirect('/mascotas');
    });

    app.use((req, res) => {
      res.status(404).render('no-encontrado', {
        titulo: 'Página no encontrada',
        mensaje: 'La dirección solicitada no existe.'
      });
    });

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicación:', error.message);
    process.exitCode = 1;
  }
}

iniciarServidor();