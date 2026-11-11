
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "PrepMaster AI API"
  });
});

app.use("/api/health/db", healthRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error"
  });
});

export default app;
