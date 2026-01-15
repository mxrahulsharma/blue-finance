import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import express from "express";
import cors from "cors";
import compression from "compression";

import { pool } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";


const app = express();

/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" })); // 🔥 prevent payload crashes

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend running successfully 🚀",
  });
});

/* ---------- DB TEST ---------- */
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      success: true,
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);

/* ---------- ERROR HANDLER ---------- */
app.use(errorHandler);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
