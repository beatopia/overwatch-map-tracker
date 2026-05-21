import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, role, created_at
       FROM heroes
       ORDER BY role ASC, name ASC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch heroes", error);
    res.status(500).json({ message: "Failed to fetch heroes" });
  }
});

export default router;
