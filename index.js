// api/index.js
import express from 'express';
import { appRouter } from './src/app.router.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import serverless from 'serverless-http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../config/config.env') });

const app = express();
appRouter(app, express);

export const handler = serverless(app);

// optional for local testing
if (process.env.NODE_ENV !== "production") {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Running on ${process.env.PORT || 3000}`);
    });
  }
  

