# Implementation Tasks: FabCon 2025 Submission

> Time horizon: ~7 hours remaining before 11:59 PM PST deadline. Prioritize demo/video deliverables while preserving validation checkpoints and documentation quality.

## Phase 1: Repository Readiness & Validation (30 minutes) — CRITICAL

- [ ] Task 1.1: Ensure Node 20.x active (`nvm use 20`) and clean working tree (`git status`).
- [ ] Task 1.2: Re-run `npm ci && npm run build` from `FabricAgent/src` to reconfirm clean build.
- [ ] Task 1.3: Execute `./verify_fabricagent.sh` and `./validate_publication_readiness.sh` at repo root; capture results in `.temp/phase3-validation.md`.
- [ ] Task 1.4: Stage zipped production bundle (`npm run preview` sanity check) for fallback; update `.temp/deploy-report.md` if anything changes.

## Phase 2: Public Repo & Spec-Kit Consolidation (40 minutes)

- [ ] Task 2.1: Create new public GitHub repo (e.g., `fabricagent-fabcon2025`) and add as remote.
- [ ] Task 2.2: Commit spec-kit artifacts (`.specify/memory/constitution.md`, `specs/hackathon-submission/*`) and push all history to the new remote (include tags if any).
- [ ] Task 2.3: Cross-link spec-kit in `README.md` “Submission kit” section and ensure documentation references remain accurate.
- [ ] Task 2.4: Add innovation impact blurb (time-savings or telemetry insight) to README/Executive Briefing per gap analysis.
- [ ] Task 2.5: Confirm legacy automation folders are absent from the public repo and note provenance of the external pipeline in docs.

## Phase 3: Live Demo Hosting Fix (30 minutes)

- [ ] Task 3.1: Provision Azure Static Web Apps (or alternate static host) targeting FabricAgent `dist` output.
- [ ] Task 3.2: Deploy latest build; verify `https://fabricprompts.com` (or replacement SWA URL) loads in <2 s, mock services functional.
- [ ] Task 3.3: Update deployment documentation (`docs/DEPLOYMENT_AZURE.md`, `.temp/deploy-report.md`) with final hosting steps and URLs.

## Phase 4: Demo Video Production (90 minutes) — HIGHEST PRIORITY

- [ ] Task 4.1: Prep demo environment in mock mode (`VITE_USE_MOCK_SERVICES=true`), disable notifications, reset telemetry state.
- [ ] Task 4.2: Record 3–5 minute walkthrough following `docs/DEMO_NARRATION.md` (catalog → Data Agent → RTI → mirroring → impact); capture KQL screenshot if referenced.
- [ ] Task 4.3: Edit video for clarity (callouts for Data Agents, Eventstream, Eventhouse, Open Mirroring); export MP4.
- [ ] Task 4.4: Upload video (YouTube/Vimeo unlisted), note link in README, Executive Briefing, and `.temp/session-summary.md`.

## Phase 5: Devpost Submission Package (30 minutes)

- [ ] Task 5.1: Finalize `submission/devpost_submission.md` with impact stats, new video URL, live demo link, and Fabric callouts.
- [ ] Task 5.2: Copy content into Devpost form (<https://aka.ms/FabConHackProjectSubmission>), select categories, attest skilling plan.
- [ ] Task 5.3: Upload screenshots/diagrams (catalog UI, architecture) and submit; archive confirmation in `.temp/submission_receipt.md`.

## Phase 6: Final Verification & Buffer (30 minutes)

- [ ] Task 6.1: Run through `FINAL_SUBMISSION_SEQUENCE.md` and `VALIDATION_CHECKPOINTS.md`, ticking items as completed.
- [ ] Task 6.2: Execute `./sync_public.sh` if required, tag final release, and push to public repo.
- [ ] Task 6.3: Update `.temp/Repo consolidation plan.txt` and record final handoff status (`.temp/SUBMISSION_COMPLETE.md`).
- [ ] Task 6.4: Double-check README/Executive Briefing links (live demo, video, documentation) and confirm no TODO placeholders remain.
