# FabricAgent - FabCon Global Hack 2025

## 🎥 Demo Video
**Watch the 3-5 minute demo:** [YouTube Link](https://youtu.be/YOUR_VIDEO_ID)

## 🌐 Live Demo
**Try it now:** [fabricprompts.com](https://fabricprompts.com) (or local setup below)

## 📦 GitHub Repository
**Source code:** [github.com/YOUR_USERNAME/fabricagent-fabcon2025](https://github.com/YOUR_USERNAME/fabricagent-fabcon2025)

If you’re running locally via `npm run dev`, the video is served from Vite’s public directory and available at the Local dev URL above.

## 🎯 Features

### Conversational Discovery & Filtering

- **🧊 Guy in a Cube Filter**: 38 expert prompts generated from GIAC videos
- **👤 Custom Filter**: 72 workforce prompts for specialized use cases
- **🔍 Combined Filtering**: Source + search + pillar filtering
- **🤖 Fabric Data Agent Chat**: Ask natural-language questions and receive grounded prompt recommendations (mock or live Fabric mode)

### Real-Time Intelligence & Visual Signals

- **📊 RTI Dashboard**: Live Eventstream/Eventhouse metrics highlighting top searches, most opened prompts, and trending pillars
- **Blue GIAC Badges**: Identify Guy in a Cube prompts with cube icons
- **Gray Custom Badges**: Mark custom workforce prompts with user icons
- **YouTube Integration**: Direct links to source videos for GIAC prompts
- **Interactive Counts**: Filter buttons show real-time prompt counts

### Complete Sections

- **📚 Catalogue**: 110 total prompts with advanced filtering
- **💼 Workforce**: 72 workforce prompts in dedicated section
- **🔄 Workflow**: 113 DAG nodes with interactive visualization
- **❓ Help**: Comprehensive documentation and guides

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x
- npm 10.x (or use `make install` for `npm ci`)

### Installation & Setup

```bash
# 1. Install dependencies
cd src
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:5173/

# (Optional) enable demo safe mode
echo "VITE_USE_MOCK_SERVICES=true" > .env.local
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 🎯 Submission Kit for Judges

- Fabric overview & architecture: `docs/FABRIC_INTEGRATIONS.md`
- Reproduction guide (mock vs. live modes): `docs/REPRODUCTION.md`
- Real-Time Intelligence setup & KQL: `docs/FABRIC_RTI_INTEGRATION.md`
- Demo narration & captions checklist: `docs/DEMO_NARRATION.md`
- Executive briefing + video: see the “Executive Briefing” section above

## Deployment Notes (Azure OIDC)

- CI workflow: `.github/workflows/azure-deploy.yml`
- Uses GitHub OIDC via `azure/login@v2` (no publish profile).
- Required repo secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`.
- Required repo variables: `AZURE_WEBAPP_NAME`, `AZURE_RESOURCE_GROUP`.
- Builds frontend from `src/` and deploys a self-contained `release.zip` to Linux App Service.
- Run-from-package enabled; a tiny Node server serves SPA with `/health` and `/version` endpoints.
- Docs URL (Help): controlled by repo variable `VITE_HELP_CENTER_URL` (fallback to `VITE_HELP_URL`).

## 📚 Documentation

- Overview & Getting Started: see sections below and `src/README-REACT.md`
- Executive Briefing: see links in the "Executive Briefing" section above
- Fabric Integrations Overview: `docs/FABRIC_INTEGRATIONS.md` (Submission Kit hub)
- Reproduction Playbook: `docs/REPRODUCTION.md`
- Real-Time Intelligence Playbook: `docs/FABRIC_RTI_INTEGRATION.md`
- Demo Narration & Captions: `docs/DEMO_NARRATION.md`
- Azure Deployment: `docs/DEPLOYMENT_AZURE.md`
- Validation & Checks: `docs/VALIDATION.md`
- Upstream Content Pipeline (GIAC/Workforce): `docs/UPSTREAM_PIPELINE.md`

## 📊 Data Structure

### Main Data Files

```
src/
├── prompt-catalog.json      # 110 prompts (38 GIAC + 72 Custom)
├── workforce_prompts.json   # 72 workforce prompts (dedicated section)
└── dag.json                 # 113 workflow nodes + 45 edges
```

### Prompt Structure (GIAC)

```json
{
  "id": "giac-5i8yzn8odao",
  "name": "Power BI Assistant: STOP Using Measures in Power BI Until You See This!",
  "provenance": "giac",
  "category": "dax-modeling",
  "tags": ["dax", "measures", "guy-in-a-cube"],
  "links": {
    "youtube": "https://www.youtube.com/watch?v=5I8yzn8oDAo"
  },
  "system": "You are a Power BI expert assistant specializing in DAX..."
}
```

### Workflow Structure (DAG)

```json
{
  "nodes": [
    {
      "id": "workflow-giac-dax-optimization",
      "label": "DAX Optimization Workflow",
      "group": "giac",
      "pillars": ["dax", "performance"]
    }
  ],
  "edges": [
    {
      "from": "workflow-1",
      "to": "workflow-2"
    }
  ]
}
```

## 🎨 User Interface

### Navigation Structure

```
[Catalogue] [Workforce] [Workflow] [Help]
     ↓           ↓           ↓        ↓
110 prompts  72 prompts  113 nodes  Docs
GIAC filter  Full table  DAG graph  Guides
```

### Filter Interface

```
Search: [_______________] 

Source: [All (110)] [🧊 Guy in a Cube (38)] [👤 Custom (72)]

Pillars: [All Pillars] [DAX] [Fabric] [Power Query] [Governance] [Performance]

Results: Showing 38 of 110 prompts • Filtered by Guy in a Cube
```

### Prompt Display

```
🧊 GIAC    Power BI Assistant: DAX Optimization Techniques
           dax-modeling                                    🎥 YouTube
           Expert guidance on DAX optimization based on Guy in a Cube content

👤 Custom  Accessibility and UX Reviewer  
           deployment-governance
           Audit Power BI reports for accessibility compliance
```

## 🔧 Development

### Project Structure

```
src/
├── components/
│   ├── layout/              # Header, Footer, navigation
│   ├── sections/            # Main page sections
│   │   ├── CatalogueSection.tsx
│   │   ├── WorkforceSection.tsx
│   │   └── DagSection.tsx
│   ├── tables/              # Data tables and modals
│   │   ├── PromptTable.tsx
│   │   └── PromptDetailsModal.tsx
│   ├── ui/                  # Reusable UI components
│   │   ├── Hero.tsx
│   │   ├── SectionCard.tsx
│   │   └── PillarBadge.tsx
│   └── graph/               # DAG visualization
│       └── WorkflowGraph.tsx
├── hooks/
│   ├── useData.ts           # Data loading and management
│   └── useChatbase.ts       # Chatbot integration
├── services/                # API and data services
├── utils/                   # Utility functions
├── types.ts                 # TypeScript interfaces
├── constants.ts             # App constants
└── App.tsx                  # Main application component
```

### Key Components

**PromptTable.tsx**

- Main filtering logic for GIAC vs Custom prompts
- Visual indicators and badges
- Search and pillar filtering integration
- Real-time count updates

**Hero.tsx**

- Statistics display with GIAC/Custom breakdown
- Dynamic counts based on current data
- Visual hierarchy for key metrics

**DagSection.tsx**

- Interactive workflow visualization
- Node clicking for prompt details
- GIAC workflow integration

### Filtering Logic

```typescript
// Source filtering implementation
const sourceMatch = !activeSource || 
    (activeSource === 'giac' && p.provenance === 'giac') ||
    (activeSource === 'custom' && p.provenance !== 'giac');

// Combined with search and pillar filters
const filteredPrompts = prompts.filter(p => {
    return searchMatch && pillarMatch && sourceMatch;
});
```

## 📈 Statistics & Analytics

### Current Data Breakdown

- **Total Prompts**: 110 (38 GIAC + 72 Custom)
- **Categories**: DAX Modeling (26), Fabric Architecture (8), Power Query (10), etc.
- **GIAC Coverage**: DAX (15), Fabric (8), General (7), Power Query (5), Visualization (2), Performance (1)
- **Workflow Nodes**: 113 (72 catalog + 41 GIAC workflows)

### Quality Metrics

- **Schema Compliance**: 100% of prompts follow defined schema
- **YouTube Integration**: All GIAC prompts have source video links
- **Traceability**: Full audit trail from prompts to source content
- **Test Coverage**: Comprehensive test suite with quality gates

## 🔗 Integration

### Data Sources

- **GIAC Prompts**: Generated from `scripts/generate_giac_prompts.py`
- **Workforce Prompts**: Curated custom prompts for specialized workflows
- **DAG Workflows**: Interactive process visualization with GIAC integration

### External Services

- **YouTube**: Direct video links for GIAC prompts
- **Chatbase**: Embedded chatbot for user assistance
- **CI/CD**: Automated testing and deployment

## 🎯 Usage Examples

### Filtering Prompts

1. **Find GIAC DAX Prompts**: Click "Guy in a Cube" → Select "DAX" pillar
2. **Search Custom Prompts**: Click "Custom" → Search "governance"
3. **Browse All Content**: Click "All" → Use search or pillar filters

### Accessing Source Content

1. **View YouTube Video**: Click YouTube icon on GIAC prompts
2. **Read Documentation**: Click prompt name for detailed modal
3. **Explore Workflows**: Navigate to Workflow section for DAG visualization

### Development Workflow

1. **Update Data**: Regenerate prompts with GIAC generation scripts
2. **Test Changes**: Run comprehensive test suite
3. **Verify UI**: Check filtering and visual indicators
4. **Deploy**: Build and deploy with CI/CD pipeline

## 📚 Documentation

- **Main README**: `../README.md` - Complete project overview
- **GIAC Generation**: `../docs/GIAC_PROMPT_GENERATION.md` - Prompt generation guide
- **Frontend Features**: `../FRONTEND_GIAC_FILTERING.md` - Filtering capabilities
- **Test Suite**: `../tests/README.md` - Testing framework

## 🚀 Deployment

The frontend is designed to work with static hosting or integrated with the Python backend:

```bash
# Static deployment
npm run build
# Deploy dist/ folder to your hosting service

# Integrated deployment
# Copy built assets to backend static folder
# Configure backend to serve frontend routes
```

## 🎉 Success Metrics

### User Experience

- ✅ **One-click filtering** between GIAC and custom prompts
- ✅ **Visual indicators** clearly distinguish prompt sources
- ✅ **YouTube integration** provides direct access to expert content
- ✅ **Real-time statistics** show current filter status
- ✅ **Comprehensive coverage** of all prompt types and workflows

### Technical Quality

- ✅ **110 total prompts** with full metadata
- ✅ **38 GIAC prompts** with YouTube traceability
- ✅ **113 workflow nodes** with interactive visualization
- ✅ **100% schema compliance** across all content
- ✅ **Responsive design** works on all devices

The frontend provides a comprehensive, user-friendly interface for exploring both expert Guy in a Cube content and custom workforce prompts with advanced filtering and visualization capabilities.

- Azure Web App via GitHub Actions (`.github/workflows/azure-deploy.yml`)
- Builds under `src/` using Node 20 and deploys `src/dist`
<!-- Deprecated deployment section removed; see Deployment Notes (Azure OIDC) above. -->

Configure the following GitHub secrets for OIDC-based Azure login:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_WEBAPP_NAME` (target app service)

## 🔎 Hybrid Search (Azure Cognitive Search)

- Configure `.env` using `.env.example` (set `AZURE_AI_SEARCH_*` and Azure OpenAI keys; set `AZURE_OPENAI_EMBED_MODEL`).
- Create/update your Azure Search index to match `todo/specs/user-guide-automation/003-implement-hybrid-search/hybridsearch_fabricagent_aisearch_index.json`.
- Dry run (no upserts): `make ingest.dryrun` (prints counts by folder/ext)
- Ingest repo files to Azure Search: `make ingest`
- Run a hybrid query from CLI: `make query q="your query" k=10 opts="--semantic --filter kind=md,tag=spec"`
- Local API server exposes `/api/search/hybrid` (POST search, GET suggestions): `make serve`

Environment (set in `.env`)

- Search: `AZURE_AI_SEARCH_ENDPOINT`, `AZURE_AI_SEARCH_API_KEY`, `AZURE_AI_SEARCH_INDEX_NAME`, optional `AZURE_SEARCH_SEMANTIC_CONFIG`
- Embeddings: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY` (or `AZURE_OPENAI_KEY`), `AZURE_OPENAI_EMBED_MODEL` (e.g., `text-embedding-3-small`)

Ingest controls

- Limit scope: `INGEST_ONLY=knowledge make ingest` (only index knowledge/)
- Limit batch size for first run: `INGEST_ONLY=knowledge INGEST_MAX_DOCS=64 make ingest`
- Caching: per-chunk SHA cache in `.reports/hybrid_ingest_cache.json` avoids re‑embedding unchanged chunks

Sample CLI queries:

- `make query q="Rewrite this DirectQuery prompt for performance" k=8 opts="--semantic"`
- `make query q="DAX: monthly distinct customers with filter context notes" k=8`
- `make query q="Incremental refresh parameters guidance for Fabric" k=8 opts="--semantic"`
- `make query q="Prompt style guide for Fabric Agent" k=8`

Index provisioning:

- Create or update the index from a local schema JSON:
  - `make index.create schema="todo/specs/user-guide-automation/003-implement-hybrid-search/hybridsearch_fabricagent_aisearch_index.json"`
  - Optionally override embedded azureOpenAIParameters from env: prefix with `OVERRIDE_AZURE_OPENAI=1`
    - Example: `OVERRIDE_AZURE_OPENAI=1 AZURE_OPENAI_ENDPOINT=... AZURE_OPENAI_EMBED_MODEL=text-embedding-3-small AZURE_OPENAI_API_KEY=... make index.create`

Convert Search response → upsert payload

- Build an upsert payload from a prior Search response:
  - `make convert.payload in=embeddings/embeddings_fabricagent.json out=embeddings/upsert_payload.json action=mergeOrUpload`
- Directly POST to your index (uses `AZURE_AI_SEARCH_*` env):
  - `make convert.post in=embeddings/embeddings_fabricagent.json action=mergeOrUpload index=fabricagent`

Implementation notes

- IDs: use `sha1(file_path)-chunk_index` to satisfy Azure key constraints; original `file_path` is stored separately
- Chunking: prompts ~500 tokens (100 overlap), transcripts ~300 (50 overlap), never split code fences; MD front‑matter is excluded from embeddings
- Tags: lowercase, de‑duplicated; include top‑level folder and role (`prompt|guide|transcript|spec`)
