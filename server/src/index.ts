import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pool } from "./db/pool";
import heroesRouter from "./routes/heroes";
import mapsRouter from "./routes/maps";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/maps", mapsRouter);
app.use("/api/heroes", heroesRouter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/db-test", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");

    res.status(200).json({
      status: "ok",
      database: "connected",
      now: result.rows[0]?.now,
    });
  } catch (error) {
    console.error("Database connection test failed", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: "Failed to connect to database",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
