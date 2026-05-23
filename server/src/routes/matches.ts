import { Router } from "express";
import { pool } from "../db/pool";

type MatchResult = "win" | "loss" | "draw";
type MatchFormat = "5v5" | "6v6";

const router = Router();

const validResults = new Set<MatchResult>(["win", "loss", "draw"]);
const validMatchFormats = new Set<MatchFormat>(["5v5", "6v6"]);

function toPositiveInteger(value: unknown): number | null {
  const parsedValue = typeof value === "string" ? Number(value) : value;

  if (typeof parsedValue !== "number" || !Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function toOptionalText(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return typeof value === "string" ? value : null;
}

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         m.id,
         mp.name AS map_name,
         mp.mode AS map_mode,
         m.result,
         m.match_format AS match_format,
         m.season,
         m.played_at AS played_at,
         m.notes,
         m.created_at AS created_at,
         COALESCE(
           json_agg(
             json_build_object(
               'id', h.id,
               'name', h.name,
               'role', h.role,
               'hero_order', mh.hero_order
             )
             ORDER BY mh.hero_order
           ) FILTER (WHERE mh.id IS NOT NULL),
           '[]'::json
         ) AS heroes
       FROM matches m
       INNER JOIN maps mp ON mp.id = m.map_id
       LEFT JOIN match_heroes mh
         ON mh.match_id = m.id
        AND mh.hero_group = 'player'
       LEFT JOIN heroes h ON h.id = mh.hero_id
       GROUP BY
         m.id,
         mp.name,
         mp.mode,
         m.result,
         m.match_format,
         m.season,
         m.played_at,
         m.notes,
         m.created_at
       ORDER BY m.played_at DESC, m.created_at DESC`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch matches", error);
    return res.status(500).json({ message: "Failed to fetch matches" });
  }
});

router.post("/", async (req, res) => {
  const mapId = toPositiveInteger(req.body?.mapId);
  const result = req.body?.result === undefined ? "draw" : req.body.result;
  const matchFormat = req.body?.matchFormat === undefined ? "5v5" : req.body.matchFormat;
  const season = toOptionalText(req.body?.season);
  const notes = toOptionalText(req.body?.notes);
  const playedAtValue = req.body?.playedAt;
  const heroes = req.body?.heroes;

  if (mapId === null) {
    return res.status(400).json({ message: "mapId must be a positive integer" });
  }

  if (!validResults.has(result)) {
    return res.status(400).json({ message: "result must be win, loss, or draw" });
  }

  if (!validMatchFormats.has(matchFormat)) {
    return res.status(400).json({ message: "matchFormat must be 5v5 or 6v6" });
  }

  if (!Array.isArray(heroes) || heroes.length < 1 || heroes.length > 3) {
    return res.status(400).json({ message: "heroes must contain between 1 and 3 hero IDs" });
  }

  const heroIds = heroes.map((heroId: unknown) => toPositiveInteger(heroId));

  if (heroIds.some((heroId: number | null) => heroId === null)) {
    return res.status(400).json({ message: "heroes must contain valid hero IDs" });
  }

  const uniqueHeroIds = new Set<number>(heroIds as number[]);

  if (uniqueHeroIds.size !== heroIds.length) {
    return res.status(400).json({ message: "heroes must not contain duplicate IDs" });
  }

  const playedAt = playedAtValue === undefined ? new Date() : new Date(playedAtValue);

  if (Number.isNaN(playedAt.getTime())) {
    return res.status(400).json({ message: "playedAt must be a valid date" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const mapResult = await client.query("SELECT id FROM maps WHERE id = $1", [mapId]);

    if (mapResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "mapId does not exist" });
    }

    const heroResult = await client.query(
      "SELECT id FROM heroes WHERE id = ANY($1::int[])",
      [heroIds]
    );

    if (heroResult.rowCount !== heroIds.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "One or more hero IDs do not exist" });
    }

    const matchResult = await client.query(
      `INSERT INTO matches (map_id, result, match_format, season, played_at, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, map_id AS "mapId", result, match_format AS "matchFormat", season, played_at AS "playedAt", notes, created_at AS "createdAt"`,
      [mapId, result, matchFormat, season, playedAt, notes]
    );

    const match = matchResult.rows[0];

    for (let index = 0; index < heroIds.length; index += 1) {
      await client.query(
        `INSERT INTO match_heroes (match_id, hero_id, hero_group, hero_order)
         VALUES ($1, $2, 'player', $3)`,
        [match.id, heroIds[index], index + 1]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      ...match,
      heroes: heroIds.map((heroId, index) => ({
        heroId,
        heroGroup: "player",
        heroOrder: index + 1,
      })),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to create match", error);
    return res.status(500).json({ message: "Failed to create match" });
  } finally {
    client.release();
  }
});

export default router;