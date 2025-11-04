# Azure Deployment (App Service + OIDC)

This repo builds a static Vite frontend under `src/` and deploys it to Azure App Service via GitHub Actions using OIDC (no publish profile).

## Prerequisites

- Azure subscription and permissions to create or use an App Service
- GitHub repo with Actions enabled

## Required GitHub Configuration

- Secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
- Variables: `AZURE_WEBAPP_NAME`, `AZURE_RESOURCE_GROUP`

These are consumed by `.github/workflows/azure-deploy.yml`.

## Build & Deploy Summary

1. Node 20 is installed
2. Build runs in `./src` → outputs to `src/dist`
3. `web.config` is copied into `src/dist` for hosting
4. Action deploys `src/dist` to the App Service (run-from-package)

## Health Endpoints

- `/ping`: plain text OK (static)
- `/health`: JSON or page (static)

Use Azure’s Health Check to monitor `/ping`.

## Custom Domain & SSL

Bind your custom domain and use App Service Managed Certificates for TLS. Optional redirect between `www` and apex can be set in `web.config`.

For a more detailed, step-by-step guide, see your upstream internal docs or adapt from Azure’s App Service documentation.
