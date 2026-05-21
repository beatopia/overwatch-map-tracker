import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, mode, active, created_at
       FROM maps
       WHERE active = true
       ORDER BY name ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch maps", error);
    res.status(500).json({ message: "Failed to fetch maps" });
  }
});

export default router;
