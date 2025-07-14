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
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});


     // const companies = [ // {
