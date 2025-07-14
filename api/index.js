// api/index.js
import express from 'express';
import { appRouter } from '../src/app.router.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import serverless from 'serverless-http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, '../config/config.env') });

// Create Express app
const app = express();

// Apply routes
appRouter(app, express);

// Export for serverless (for Vercel)
export const handler = serverless(app);

// Optional: Run locally for testing
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Running on ${process.env.PORT || 3000}`);
  });
}
