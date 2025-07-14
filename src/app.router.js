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
  app.use("*", (req, res, next) => {
    return res.json({ message: "In-valid Routing" })
})
app.get("/", (req, res, next) => {
  res.send(`
    <html>
      <head>
        <title>Dashboard</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
          }
          h1 {
            font-size: 48px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>Hello, that's Dashboard</h1>
      </body>
    </html>
  `);
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
