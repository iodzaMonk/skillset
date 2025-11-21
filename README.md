## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Docker Compose v2)
- 4 GB RAM available for containers (recommended)
- Ports `3000`, `5432`, and `5555` free on your machine

---

## Quick Start

From the project root:

```bash
docker compose up --build
```

Visit **http://localhost:3000** to see the app.

Stop everything with:

```bash
docker compose down
```

(Add `-v` if you want to wipe the database volume.)

---

## Project Config

| File                 | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `docker-compose.yml` | Orchestrates app + database services and volumes   |
| `Dockerfile.dev`     | Node 20 container with Prisma client pre-generated |
| `.env.docker`        | Environment variables used inside containers       |
| `prisma/seed.ts`     | Faker-powered seed script (runs automatically)     |

---

## Everyday Workflow

Run this in another terminal
| Task | Command |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Start stack | `docker compose up` |
| Rebuild after dependency changes | `docker compose up --build` |
| Run Prisma Studio | `docker compose exec app npx prisma studio` (then open http://localhost:5555) |
| Run migrations manually | `docker compose exec app npx prisma migrate dev` |
| Rerun seed without rebuild | `docker compose exec app npx prisma db seed` |

Notes:

- Containers mount your project directory; edits refresh automatically.
- Seeded users share the password `123` for easy logins.

---

## Troubleshooting

| Symptom                                  | Fix                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `service "app" is not running`           | Start containers first: `docker compose up`                                                      |
| `relation "public.users" does not exist` | Run migrations: `docker compose exec app npx prisma migrate deploy`                              |
| `JWSSignatureVerificationFailed`         | Clear browser cookies or ensure `SESSION_SECRET` matches between runs                            |
| Port already in use                      | Stop whatever else is using 3000 / 5432 / 5555 or tweak the port mapping in `docker-compose.yml` |

---

## Cleaning Up

To remove containers and volumes:

```bash
docker compose down -v
```

This wipes the Postgres data volume (`skillset-db-data`) so you start fresh next time.

---

## Sokrates Code Analysis

Prerequisites: Java 17+ (Graphviz optional for dependency visuals).

From the project root:

```bash
# Refresh git history used by Sokrates
java -jar Sokrates/sokrates-LATEST.jar extractGitHistory -analysisRoot .

# Generate reports (HTML ends up in Sokrates/_sokrates/reports/html/index.html)
java -jar Sokrates/sokrates-LATEST.jar generateReports \
  -confFile Sokrates/_sokrates/config.json \
  -outputFolder Sokrates/_sokrates/reports
```

Notes:
- If Graphviz `dot` is installed and on PATH, dependency graphs render; otherwise they are skipped.
- Generated data and explorers live under `Sokrates/_sokrates/reports/`.
