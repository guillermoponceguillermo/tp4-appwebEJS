const fs = require('node:fs/promises');

async function leerArchivoJson(ruta) {
  const contenido = await fs.readFile(ruta, 'utf8');
  return JSON.parse(contenido);
}

module.exports = { leerArchivoJson };