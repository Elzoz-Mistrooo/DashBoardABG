import authRoutes from './modules/Users/user.routes.js';
import companiesRoutes from './modules/company/company.controller.js';

import connectDB from '../DB/connection.js'
import cors from 'cors'

// import authPrivate from './modules/Users/user.privatesaccRoutes.js'

export const appRouter = (app, express) => {
  app.use(express.json());
  app.use("/upload",express.static("upload"))
  app.use("/auth", authRoutes);
  app.use("/company",companiesRoutes)
  // app.use("/authuser",authPrivate);
  app.use(cors())
  connectDB()
  app.get("/", (req, res) => {
    return res.json({ message: "Hello We're in biggest Dashboard." });
  });
  
  app.all("*", (req, res) => {
    return res.status(404).json({ message: "In-valid Routing" });
  });

app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

};
