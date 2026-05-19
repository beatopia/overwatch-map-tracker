# Server

Future Node.js + Express + TypeScript backend for the Overwatch Map Winrate Tracker.

No features are implemented yet.

## Database Schema

The PostgreSQL schema is defined in `sql/schema.sql` and includes:
- `maps`: Overwatch maps
- `heroes`: Overwatch heroes with role
- `matches`: Individual match results
- `match_heroes`: Junction table linking matches to up to 3 heroes per match

### Apply Schema to Local Database

1. **Start the Docker PostgreSQL container** from the project root:
   ```bash
   docker-compose up -d
   ```

2. **Connect to the database and apply the schema**:
   ```bash
   psql -h localhost -U postgres -d overwatch_tracker -f server/sql/schema.sql
   ```
   When prompted, enter password: `password`

3. **Verify the schema** was created:
   ```bash
   psql -h localhost -U postgres -d overwatch_tracker
   \dt
   \q
   ```

## Development

- **Dev mode** (auto-reload): `npm run dev`
- **Build**: `npm run build`
- **Run compiled**: `npm run start`

The server reads `DATABASE_URL` and `PORT` from `.env`. See `.env.example` for required variables.
