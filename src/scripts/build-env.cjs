// src/scripts/build-env.cjs (CommonJS)
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // opcional: leer .env si existe

const targetPath = path.resolve(__dirname, '../environments/environment.ts');
const dir = path.dirname(targetPath);

// 1) Asegura que la carpeta exista
fs.mkdirSync(dir, { recursive: true });

// 2) Genera el contenido
const env = {
  production: String(process.env.PRODUCTION) === 'true',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '', // ojo: todo lo que pongas aquí queda público en el bundle
};

const content = `export const environment = ${JSON.stringify(env, null, 2)} as const;\n`;

// 3) Escribe el archivo
fs.writeFileSync(targetPath, content, 'utf8');
console.log(`✅ Generado ${targetPath}`);
