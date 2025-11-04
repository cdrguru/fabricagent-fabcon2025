# Contributing to FabricAgent

Thanks for your interest in contributing! This project is a Vite + React frontend hosted under `src/` with static assets under `src/public/`.

## Local Setup

- Prereqs: Node.js 18+ (Node 20 recommended), npm
- Install: `cd src && npm install`
- Dev server: `npm run dev` (from `src/`)
- Build: `npm run build` (outputs to `src/dist`)
- Preview: `npm run preview`

## Tests

If tests are present:

- Unit tests: `npm test`
- E2E (if configured): `npm run test:e2e`

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `chore:` maintenance tasks
- `refactor:` code change that neither fixes a bug nor adds a feature

## Pull Request Flow

1. Branch from `main`: `git checkout -b feat/your-change`
2. Make changes and run `npm run build` to ensure it compiles
3. Push your branch and open a PR with a clear description and screenshots if UI

## Code of Conduct

This project adheres to the Contributor Covenant v2.1. See `CODE_OF_CONDUCT.md`.
