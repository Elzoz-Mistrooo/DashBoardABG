// src/app.router.js
import authRoutes from './modules/Users/user.routes.js';
import companiesRoutes from './modules/company/company.controller.js';
import cors from 'cors';

export const appRouter = (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.use("/upload", express.static("upload"));

  app.use("/auth", authRoutes);
  app.use("/company", companiesRoutes);

  app.get("/", (req, res) => {
    return res.json({ message: "✅ Welcome to the Dashboard API" });
  });

  app.all("*", (req, res) => {
    return res.status(404).json({ message: "❌ In-valid Routing" });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error("Global Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  });

};
