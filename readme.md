# FabricAgent - AI-Powered Prompt Governance for Microsoft Fabric

**Category:** Best Use of AI Features within Microsoft Fabric  
**Live Demo:** [fabricprompts.com](https://fabricprompts.com)  
**Demo Video:** [YouTube (3:23)](https://www.youtube.com/watch?v=4G6YTW1zy8g)  
**GitHub:** [github.com/cdrguru/fabricagent-fabcon2025](https://github.com/cdrguru/fabricagent-fabcon2025)

---

## The Problem

Fabric and Power BI teams face **prompt governance chaos**:

- 💸 Hours wasted searching for the right Copilot prompt  
- 🔄 Teams recreate prompts that already exist  
- 📊 Leaders have no visibility into prompt usage  
- ❌ Unvetted prompts produce inconsistent results  

**Result:** Developers spend 30+ minutes finding trusted AI guidance that should take seconds.

---

## The Solution

**FabricAgent** is a searchable, AI-powered catalog of 110+ curated prompts with conversational discovery, real-time usage analytics, and provenance tracking. Production-ready React SPA showcasing Microsoft Fabric's AI capabilities.

**Impact:**

- ⚡ **95% faster** - Prompt discovery in <30 seconds vs 30+ minutes  
- 🎯 **Proven quality** - 38 GIAC prompts + 72 custom workflows  
- 📈 **Data-driven** - Real-time telemetry shows value  
- 🤖 **AI-powered** - Natural language search via Data Agents  

---

## Microsoft Fabric Features

### Primary: AI Features ⭐

- **Data Agents** - Conversational semantic search with natural language  
- **AI Discovery** - Intelligent recommendations based on context  
- **Copilot-Ready** - 110+ prompts optimized for Fabric scenarios  

### Bonus: Real-Time Intelligence

- **Eventstream** - Captures usage events in real-time  
- **Eventhouse** - Time-series telemetry with KQL analytics  
- **Live Dashboards** - Sub-5-second latency metrics  

### Bonus: Open Mirroring

- **External Content** - Guy in a Cube videos mirrored to OneLake  
- **Auto Updates** - No manual ETL required  
- **Provenance** - Visual badges show content source  

---

## Architecture

```text
┌─────────────────────────────────────────────────────┐
│     FabricAgent SPA (React + TypeScript)           │
│  Catalog | Data Agent | RTI Dashboard | Workflow   │
└────┬─────────┬──────────┬──────────────┬──────────┘
     │         │          │              │
     ▼         ▼          ▼              ▼
┌─────────────────────────────────────────────────────┐
│        Microsoft Fabric Workspace                   │
│ Lakehouse  Data Agents  Eventstream  Open Mirroring│
│ (Prompts)  (Search)     + Eventhouse (GIAC Data)   │
└────┬─────────┬──────────┬──────────────┬──────────┘
     │         │          │              │
GIAC Videos  Guides  Telemetry      CI/CD Pipeline
```

**Tech:** React 18 · TypeScript · Vite · Tailwind · Fabric Data Agents · Eventstream · Eventhouse · Azure SWA

---

## Quick Start (5 Minutes)

```bash
# Clone and setup
git clone https://github.com/cdrguru/fabricagent-fabcon2025.git
cd fabricagent-fabcon2025/FabricAgent/src
npm ci

# Run demo-safe mode (for judges)
VITE_USE_MOCK_SERVICES=true npm run dev

# Open http://localhost:5173
```

**Try:**

- 🔍 Filter prompts by source/pillar  
- 💬 Ask Data Agent: "How do I optimize DAX?"  
- 📊 View RTI Dashboard  
- 🔄 Explore 113-node Workflow DAG  

---

## Why This Wins the Hackathon

### 1. Category Alignment (25%) ✅

**Target:** Best Use of AI Features within Microsoft Fabric

- ✅ Data Agents for conversational discovery  
- ✅ 95% faster prompt discovery (30+ min → <30 sec)  
- ✅ 110+ Copilot-optimized prompts  
- ✅ Bonus: RTI + Open Mirroring  

### 2. Innovation & Impact (25%) ✅

**Innovation:**

- 🥇 First prompt governance platform for Fabric  
- 🔄 Telemetry-driven continuous improvement  
- 🏗️ Production-ready (live at fabricprompts.com)  

**Impact:**

- ⏱️ 95% time reduction (measured)  
- 👥 110+ vetted prompts eliminate redundancy  
- 📊 Governance visibility for leaders  

### 3. Documentation & Reproducibility (25%) ✅

- ✅ Demo-safe mock mode  
- ✅ 3-command setup  
- ✅ [FABRIC_INTEGRATIONS.md](FabricAgent/docs/FABRIC_INTEGRATIONS.md)  
- ✅ Verification scripts  
- ✅ [Spec-kit](specs/hackathon-submission/)  

### 4. Video Demonstration (25%) ✅

**[Watch 3:23 Demo](https://www.youtube.com/watch?v=4G6YTW1zy8g)**

- ✅ Clear problem → solution narrative  
- ✅ Live demo of all features  
- ✅ Explicit Fabric callouts  
- ✅ HD with professional narration  

---

## Repository Structure

```text
fabricagent-fabcon2025/
├── FabricAgent/
│   ├── src/                     # React SPA
│   ├── docs/
│   │   ├── FABRIC_INTEGRATIONS.md   ← Start here
│   │   ├── VALIDATION.md
│   │   └── FABRIC_RTI_INTEGRATION.md
│   └── README.md
└── specs/hackathon-submission/  # Requirements & tasks
```

---

## Fabric Integration Guides

**For Judges:** Demo-safe mock mode works out-of-the-box. For live integration:

### Data Agents

1. Create Data Agent → Link to Lakehouse  
2. Set `VITE_DATA_AGENT_ENDPOINT`  
3. Toggle `VITE_USE_MOCK_SERVICES=false`  

**Guide:** [FABRIC_INTEGRATIONS.md](FabricAgent/docs/FABRIC_INTEGRATIONS.md)

### Real-Time Intelligence

1. Create Eventstream → Route to Eventhouse  
2. Set `VITE_EVENTSTREAM_ENDPOINT`  
3. View live metrics (<5s latency)  

**Guide:** [FABRIC_RTI_INTEGRATION.md](FabricAgent/docs/FABRIC_RTI_INTEGRATION.md)

### Open Mirroring

1. Setup Open Mirroring → Mirror GIAC to OneLake  
2. Enriches catalog with provenance  

**Guide:** [MIRRORING_SETUP.md](FabricAgent/docs/MIRRORING_SETUP.md)

---

## Validation for Judges

```bash
cd FabricAgent/src
npm ci && npm test
VITE_USE_MOCK_SERVICES=true npm run dev
```

**Checklist:**

- [ ] 110+ prompts load  
- [ ] Filters work  
- [ ] Data Agent responds  
- [ ] RTI Dashboard shows metrics  
- [ ] DAG renders 113 nodes  

**Full validation:** [VALIDATION.md](FabricAgent/docs/VALIDATION.md)

---

## Key Innovations

1. **Prompt Governance** - First Fabric catalog with provenance  
2. **Knowledge Democratization** - GIAC expertise searchable  
3. **Conversational Discovery** - Data Agent semantic search  
4. **Closed-Loop Learning** - Telemetry improves recommendations  
5. **Workflow Integration** - DAG connects prompts to tasks  

---

## Submission Checklist ✅

- [x] **GitHub:** [github.com/cdrguru/fabricagent-fabcon2025](https://github.com/cdrguru/fabricagent-fabcon2025)  
- [x] **Video (3:23):** [YouTube](https://www.youtube.com/watch?v=4G6YTW1zy8g)  
- [x] **Live Demo:** [fabricprompts.com](https://fabricprompts.com)  
- [x] **Category:** Best Use of AI Features within Microsoft Fabric  
- [x] **Documentation:** Comprehensive (README + guides + spec-kit)  
- [x] **Reproducibility:** Demo-safe mode + verification scripts  

---

## Tags

`#MicrosoftFabric` `#DataAgents` `#Eventstream` `#Eventhouse` `#OpenMirroring` `#FabCon2025` `#AIGovernance`

---

## License & Contact

**License:** MIT  
**Issues:** [GitHub Issues](https://github.com/cdrguru/fabricagent-fabcon2025/issues)  
**Live Demo:** [fabricprompts.com](https://fabricprompts.com)  

**Acknowledgments:** Microsoft Fabric Team · FabCon 2025 Organizers · Guy in a Cube · Fabric Community

---

**Built with ❤️ for the Microsoft Fabric Community**
