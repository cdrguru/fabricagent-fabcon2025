# Validation & Local Checks

This repo includes lightweight scripts to verify the frontend builds and basic repo hygiene before publishing.

## Scripts

- `verify_fabricagent.sh`: quick structural checks
  - Ensures required files/dirs exist (e.g., `src/public`, deploy workflow)
  - Greps for expected config (e.g., Help URL env usage)
  - Confirms no obvious secrets are tracked

- `validate_publication_readiness.sh`: install + build test
  - Runs `npm install` and `npm run build` in `src/`
  - Copies `web.config` into `dist/`
  - Verifies essential static assets exist after build

## Running

```bash
./verify_fabricagent.sh
./validate_publication_readiness.sh
```

If issues are reported, follow the messages to fix missing files or configuration.
