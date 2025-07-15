// api/index.js
import express from 'express';
import { appRouter } from '../src/app.router.js';
import connectDB from '../DB/connection.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../config/config.env') });

// Create express app
const app = express();

// ✅ تأكد من الاتصال قبل تركيب الراوتر
let isConnected = false;

async function setupApp() {
  if (!isConnected) {
    await connectDB(); // 👈 ده مهم جدًا
    isConnected = true;
  }
  appRouter(app, express);
}

export default async function handler(req, res) {
  await setupApp(); // ⬅️ اتأكد الاتصال حصل قبل أي طلب
  return app(req, res);
}

// Optional: Local dev mode
if (process.env.NODE_ENV !== 'production') {
  setupApp().then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Running locally on port ${process.env.PORT || 3000}`);
    });
  });
}
