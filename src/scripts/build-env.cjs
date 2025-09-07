const fs = require('fs');
const path = require('path');
require('dotenv').config(); // carga .env si existe

const targetPath = path.resolve(__dirname, '../environments/environment.ts');

const env = {
  production: String(process.env.PRODUCTION) === 'true',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '', // ojo: todo lo que metas aquí quedará público en el bundle
};

const content =
  `export const environment = ${JSON.stringify(env, null, 2)} as const;\n`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log(`✅ Generado ${targetPath}`);
