const fs = require('node:fs/promises');

async function leerArchivoJson(ruta) {
  try {
    const contenido = await fs.readFile(ruta, 'utf-8');
    return JSON.parse(contenido);
  } catch (error) {
    return [];
  }
}

async function guardarArchivoJson(ruta, datos) {
  await fs.writeFile(ruta, JSON.stringify(datos, null, 2), 'utf-8');
}

module.exports = { leerArchivoJson, guardarArchivoJson };