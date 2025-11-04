# Upstream Content Pipeline (Overview)

This repository hosts the frontend Prompt Explorer. The upstream content pipeline that generates curated prompts (e.g., from Guy in a Cube videos) is maintained separately. That pipeline:

- Extracts transcripts and source material
- Curates and normalizes prompts into structured JSON
- Evaluates prompt quality
- Publishes artifacts consumed by this frontend (e.g., in `src/public/prompts` and DAG metadata)

This frontend does not run the pipeline; it only loads published artifacts. If you’re interested in the pipeline, see the separate pipeline repository or internal docs you maintain alongside it.

## What You Need To Know Here

- Prompts are structured and tagged (source, pillars, etc.)
- GIAC prompts include YouTube links for provenance
- Data is read from `src/public/` at runtime

## Contributing Prompts

- Follow `CONTRIBUTING.md`
- Ensure new prompts meet schema and include provenance and tags
