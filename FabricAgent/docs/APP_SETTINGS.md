# App Service Configuration (Azure)

Set the following Application Settings on your Azure Web App. The server accepts both the standardized and legacy names:

## Required

- `AZURE_OPENAI_ENDPOINT`: `https://<resource>.openai.azure.com`
- `AZURE_OPENAI_API_KEY` or `AZURE_OPENAI_KEY`: your key
- `AZURE_OPENAI_API_VERSION`: e.g., `2024-02-15-preview` or `2025-04-01-preview`
- `AZURE_OPENAI_DEPLOYMENT` or `AZURE_OPENAI_MODEL` (or `AZURE_OPENAI_MODEL_AGENT`): your model deployment name

## Diagnostics

- `GET /health` → `{ ok: true }`
- `GET /env-check` → `{ ok: true, presence: { KEY: true|false, ... } }`

## Notes

- During rollout you can enable container logs by setting the repo variable `ENABLE_DOCKER_LOGS='true'`.
- The client also surfaces detailed error messages from `/api/rewrite` so you can see upstream Azure errors.

