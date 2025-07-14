// api/index.js
import express from 'express';
import { appRouter } from '../src/app.router.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, '../config/config.env') });

const app = express();
appRouter(app, express);

// ✅ Handler that Vercel understands
export default function handler(req, res) {
  return app(req, res);
}

// Optional: Run locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Running on ${process.env.PORT || 3000}`);
  });
}
