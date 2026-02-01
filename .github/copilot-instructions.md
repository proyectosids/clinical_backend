# 🏥 Copilot Instructions for ClinicaBE

## Project Overview

- This is a Node.js + Express backend for a clinical management system, using SQL Server via the native `mssql` package.
- The architecture is layered and clean, separating domain logic, application use cases, infrastructure (DB, security), and HTTP interfaces.
- Authentication is handled via JWT; passwords are hashed with bcrypt.

## Directory Structure & Key Files

- `src/config/db.js`: SQL Server connection logic. Reads credentials from `.env`.
- `src/domain/entities/`: Domain models (e.g., `Paciente.js`).
- `src/domain/repositories/`: Repository interfaces (e.g., `IPacienteRepository.js`).
- `src/infrastructure/persistence/`: Concrete repository implementations (e.g., `MssqlPacienteRepository.js`).
- `src/interfaces/http/controllers/`: Express controllers for API endpoints.
- `src/interfaces/http/routes/`: Route definitions for Express.
- `server.js`: Main entry point. Loads routes, tests DB connection before starting.
- `.env`: Stores DB and JWT secrets. Must match SQL Server config.

## Patterns & Conventions

- **Repository Pattern:** All DB access goes through repository interfaces in `domain/repositories`, implemented in `infrastructure/persistence`.
- **Use Cases:** Business logic is in `application/paciente/` (e.g., `CreatePacienteUseCase.js`). Controllers call use cases, not repositories directly.
- **Error Handling:** Centralized error middleware in `server.js`. All errors should be passed to `next(error)` in controllers.
- **Validation:** Use `shared/validator.js` for request validation.
- **Environment Variables:** Always use `process.env` for config. Never hardcode secrets.

## Developer Workflows

- **Install dependencies:** `npm install`
- **Run in development:** `npm run dev` (uses nodemon)
- **Run in production:** `npm start`
- **Test DB connection:** La conexión se prueba automáticamente al iniciar el servidor (`npm run dev`).
- **Health check endpoint:** `GET /health`
- **API endpoints:** See `README.md` for full list and usage examples.

## Integration Points

- **SQL Server:** All data is stored in SQL Server. Table schemas are in `README.md`.
- **JWT:** Auth endpoints issue and verify JWT tokens. Secret and expiry in `.env`.
- **bcrypt:** Used for password hashing in user registration/auth.

## Troubleshooting

- **DB connection errors:** Check `.env` and SQL Server status.
- **Port conflicts:** Change `PORT` in `.env`.
- **Route errors:** Ensure all route patterns are valid (no missing parameter names).

## Example: Adding a New Entity

1. Define model in `domain/entities/`.
2. Add repository interface in `domain/repositories/`.
3. Implement repository in `infrastructure/persistence/`.
4. Create use case in `application/`.
5. Add controller and route in `interfaces/http/`.

---

For more details, see `README.md` and existing code patterns. Ask for clarification if any workflow or pattern is unclear.
