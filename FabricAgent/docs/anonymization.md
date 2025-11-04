# Anonymization and Secret Hygiene

This repo is designed to be public. To keep it clean and safe:

- Do not commit secrets, tokens, keys, or credentials. Use environment variables.
- No PII or customer data should be added to the repo or issues.
- Large binary files should not be committed unless essential (use links or releases).

Recommended practices

- Add secrets to `.env` locally (never commit); see `src/.env.example` for guidance.
- Scrub commit history before publishing if sensitive files were ever committed.
- Use the provided scripts to sanity‑check before publishing:
  - `./verify_fabricagent.sh`
  - `./validate_publication_readiness.sh`

If you suspect sensitive data was exposed, rotate affected credentials immediately and open a security report (see `SECURITY.md`).
