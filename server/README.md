# Server

Future Node.js + Express + TypeScript backend for the Overwatch Map Winrate Tracker.

No features are implemented yet.

## Database Schema

The PostgreSQL schema is defined in `sql/schema.sql` and includes:
- `maps`: Overwatch maps
- `heroes`: Overwatch heroes with role
- `matches`: Individual match results with format (5v5/6v6) and season
- `match_heroes`: Junction table for hero tracking by group (player, teammate, enemy)

### Apply Schema to Local Database

1. **Start the Docker PostgreSQL container** from the project root:
   ```bash
   docker-compose up -d
   ```

2. **Reset the database** (if you previously applied an older schema):
   ```bash
   docker exec -it overwatch_tracker_db psql -U postgres -d overwatch_tracker -c "DROP TABLE IF EXISTS match_heroes CASCADE; DROP TABLE IF EXISTS matches CASCADE; DROP TABLE IF EXISTS heroes CASCADE; DROP TABLE IF EXISTS maps CASCADE;"
   ```

3. **Connect to the database and apply the schema**:
   ```bash
   psql -h localhost -U postgres -d overwatch_tracker -f server/sql/schema.sql
   ```
   When prompted, enter password: `password`

4. **Verify the schema** was created:
   ```bash
   psql -h localhost -U postgres -d overwatch_tracker
   \dt
   \q
   ```

5. **Load seed data** (maps and heroes):
   ```bash
   psql -h localhost -U postgres -d overwatch_tracker -f server/sql/seed.sql
   ```
   This command is safe to run multiple times—it uses `ON CONFLICT` to skip duplicates.

## Development

- **Dev mode** (auto-reload): `npm run dev`
- **Build**: `npm run build`
- **Run compiled**: `npm run start`

The server reads `DATABASE_URL` and `PORT` from `.env`. See `.env.example` for required variables.
