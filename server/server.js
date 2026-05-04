// =========================================================
//  Gold News — Express Backend Server
//  Serves as the API layer between the React frontend
//  and the GoldAPI.io external service.
// =========================================================

import "dotenv/config"; // loads .env from the project root
import express from "express";
import cors from "cors";

import metalsRouter from "./routes/metals.js";
import newsRouter from "./routes/news.js";

// ---------------------------------------------------------
//  Environment
// ---------------------------------------------------------
const PORT = process.env.PORT || 5000;


// ---------------------------------------------------------
//  App Initialisation
// ---------------------------------------------------------
const app = express();

// ---------------------------------------------------------
//  Middleware
// ---------------------------------------------------------

// Enable CORS — allows the React dev server (port 8080)
// to call the backend during development.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8080",
    methods: ["GET", "POST"],
  })
);

// Parse incoming JSON payloads.
app.use(express.json());

// ---------------------------------------------------------
//  Routes
// ---------------------------------------------------------

// Health-check endpoint — useful for monitoring / deploy probes.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Precious-metals data routes.
app.use("/api/metals", metalsRouter);

// Market intelligence news routes.
app.use("/api/news", newsRouter);

// ---------------------------------------------------------
//  Start Server
// ---------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
  console.log(`📡  Metals endpoint → http://localhost:${PORT}/api/metals`);
});
