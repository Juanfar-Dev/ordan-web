import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Estas variables vienen del sistema operativo
const environment = {
  production: true,
  supabaseUrl: process.env.SUPABASE_URL || 'https://default-api.com',
  supabaseKey: process.env.SUPABASE_KEY || '',
};

const envFile = `export const environment = ${JSON.stringify(environment, null, 2)};`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../environments/environment.ts');

fs.writeFileSync(envPath, envFile);

console.log('✅ Environment file generated at:', envPath);
console.log('📋 Content:', environment);
