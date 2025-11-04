# Mock Services - Demo Safe Mode

## Overview

This directory contains mock implementations of Microsoft Fabric services, enabling reliable demo recording and parallel development workflows without requiring live Fabric connectivity.

## Why Mock Services?

**Competition Context**: For the FabCon Global Hack 2025, demo video reliability is critical (25% of judging score). Mock services ensure:

- **Zero API failures** during demo recording
- **Consistent golden-path data** that showcases Fabric capabilities
- **Parallel development** - frontend and documentation teams can proceed independently
- **Judge-friendly responses** - pre-crafted data that tells a compelling story

## Available Mock Services

### MockRtiService.ts

Simulates Real-Time Intelligence telemetry pipeline:

- **Telemetry ingestion** - Queues events locally (mimics Eventstream)
- **Dashboard metrics** - Returns golden-path data for RTI dashboard
- **Top searches** - Shows realistic search patterns
- **Trending pillars** - Demonstrates Fabric pillar popularity
- **Recent activity** - Displays live event stream

**Key Features:**

- Event queue with FIFO buffer (max 1000 events)
- Realistic latency simulation (50-100ms)
- Session ID management
- Health check endpoint

### MockDataAgentService.ts

Simulates Fabric Data Agent conversational search:

- **Natural language queries** - Responds to prompt search questions
- **Relevant results** - Returns matching prompts with relevance scores
- **Follow-up context** - Maintains conversation state
- **Confidence scoring** - High/medium/low confidence indicators

**Key Features:**

- Pre-defined golden-path queries (real-time, Power BI, data quality, lakehouse)
- Fallback responses for unmapped queries
- Realistic AI latency (200-500ms)
- Suggestion engine for follow-up questions

## Configuration

Enable mock services via environment variable:

```bash
# .env.local or .env
VITE_USE_MOCK_SERVICES=true
```

The `ServiceFactory.ts` automatically routes requests to mock or live implementations based on this flag.

## Usage Pattern

```typescript
// Instead of directly importing services:
// import RtiService from './services/RtiService'; // ❌ Don't do this

// Use the service factory:
import { getRtiService, getDataAgentService } from './services/ServiceFactory';

const rtiService = getRtiService();
const dataAgentService = getDataAgentService();

// These will be mock or live based on VITE_USE_MOCK_SERVICES
await rtiService.emitEvent({ event_type: 'search', search_query: 'fabric' });
const response = await dataAgentService.query({ query: 'power bi optimization' });
```

## Demo Recording Setup

For reliable demo video recording:

1. **Create `.env.local`:**

   ```bash
   VITE_USE_MOCK_SERVICES=true
   ```

2. **Start dev server:**

   ```bash
   npm run dev
   ```

3. **Verify mock mode:**
   - Check browser console for `[ServiceFactory] Using Mock*Service` logs
   - Test Data Agent queries - should return instantly with golden-path data
   - Check RTI dashboard - should show consistent metrics

4. **Record demo:**
   - No network dependencies
   - No API rate limits or timeouts
   - Consistent performance across takes

## Golden Path Demo Queries

Pre-configured queries that showcase Fabric + AI capabilities:

### Data Agent Queries

1. **"real-time data engineering"**
   - Returns prompts for Eventstream, Eventhouse, KQL
   - Highlights Real-Time Intelligence category

2. **"power bi optimization"**
   - Returns DAX, semantic model, report performance prompts
   - Demonstrates Power BI pillar coverage

3. **"data quality checks"**
   - Returns data validation, profiling, testing prompts
   - Shows operational best practices

4. **"fabric lakehouse"**
   - Returns lakehouse architecture, Delta tables, medallion patterns
   - Highlights Data Engineering depth

### RTI Dashboard Metrics

- **Top searches**: Real-time queries dominate (category alignment)
- **Most opened prompts**: Mix of GIAC and workforce content
- **Trending pillars**: Real-Time Intelligence shows upward trend
- **Recent activity**: Live-updating event feed

## Extending Mock Data

To add new golden-path responses:

### For Data Agent

Edit `MockDataAgentService.ts`, add to `mockResponses` object:

```typescript
const mockResponses: Record<string, DataAgentResponse> = {
  'your new query': {
    answer: "Your crafted response that tells judges a story",
    prompts: [
      // Add 3-5 relevant prompts with high relevance scores
    ],
    conversational_context: ['your new query'],
    timestamp: new Date().toISOString(),
    confidence: 'high'
  }
};
```

### For RTI Metrics

Edit `MockRtiService.ts`, update `generateMockMetrics()`:

```typescript
const generateMockMetrics = (): RTIDashboardMetrics => {
  return {
    topSearches: [
      // Update with demo-relevant queries
    ],
    mostOpenedPrompts: [
      // Update with judge-friendly prompt popularity
    ],
    // ...
  };
};
```

## Transitioning to Live Services

When Fabric integration is ready:

1. **Implement live service files:**
   - `LiveRtiService.ts` - Connect to Fabric Eventstream/Eventhouse
   - `LiveDataAgentService.ts` - Connect to Fabric Data Agent API

2. **Update ServiceFactory.ts:**

   ```typescript
   import LiveRtiService from './LiveRtiService';
   import LiveDataAgentService from './LiveDataAgentService';
   
   export const getRtiService = () => {
     return config.useMockServices ? MockRtiService : LiveRtiService;
   };
   ```

3. **Test both modes:**
   - Mock mode: `VITE_USE_MOCK_SERVICES=true`
   - Live mode: `VITE_USE_MOCK_SERVICES=false`

4. **Keep mock services:**
   - Useful for CI/CD testing
   - Future demo recordings
   - Development without Fabric access

## Validation

Verify mock services work correctly:

```bash
# Run tests
npm test

# Start dev server in mock mode
VITE_USE_MOCK_SERVICES=true npm run dev

# Check health
# Navigate to app and open browser console
# Should see: [ServiceFactory] Using Mock*Service logs
```

## Competition Impact

| Judging Criterion | Impact | How Mock Services Help |
|-------------------|--------|------------------------|
| **Video Demo (25%)** | HIGH | Guaranteed reliability, no API failures during recording |
| **Documentation (25%)** | HIGH | Enables parallel doc work while backend is in progress |
| **Category Alignment (25%)** | MEDIUM | Golden-path data explicitly showcases Fabric AI features |
| **Innovation (25%)** | LOW | Indirect - faster iteration enables more innovation time |

## Quick Reference

- **Enable mock mode**: `VITE_USE_MOCK_SERVICES=true`
- **Service factory**: `src/services/ServiceFactory.ts`
- **Mock RTI**: `src/services/MockRtiService.ts`
- **Mock Data Agent**: `src/services/MockDataAgentService.ts`
- **Config file**: `src/config.ts`
- **Environment types**: `src/vite-env.d.ts`
- **Example env**: `.env.example`

## Support

For questions or issues with mock services:

- Check browser console for `[Mock*Service]` logs
- Verify `.env.local` has correct flag
- Ensure ServiceFactory is being used (not direct imports)
- Review this README for golden-path queries and expected behavior

---

**Demo Recording Tip**: Always use mock mode for final demo video. Use live mode for supplementary B-roll if time permits.
