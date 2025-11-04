# Migration Guide: Integrating AppContext into App.tsx

**Goal:** Update App.tsx to use AppProvider and eliminate prop drilling to child components.

---

## Step 1: Import AppProvider

Add this import at the top of `App.tsx`:

```tsx
import { AppProvider } from './contexts/AppContext';
```

---

## Step 2: Wrap the App Content with AppProvider

### Before:
```tsx
return (
  <div className="min-h-screen bg-slate-50">
    <Header ... />
    <main>{element}</main>
    <Footer />
    {modalPrompt && ...}
  </div>
);
```

### After:
```tsx
return (
  <AppProvider
    globalPromptMap={globalPromptMap}
    catalogueCount={data?.catalogue?.length || 0}
    workforceCount={data?.workforce?.length || 0}
    dagNodeCount={data?.dag?.nodes?.length || 0}
  >
    <div className="min-h-screen bg-slate-50">
      <Header ... />
      <main>{element}</main>
      <Footer />
    </div>
  </AppProvider>
);
```

**Note:** Remove `modalPrompt` state and modal rendering from App.tsx - the context handles it now.

---

## Step 3: Remove Redundant State from App.tsx

### Delete these lines:
```tsx
const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
const [modalPrompt, setModalPrompt] = useState<Prompt | null>(null);

const onShowDetails = (prompt: Prompt) => {
  setModalPrompt(prompt);
  // ... rest of onShowDetails logic
};
const closeModal = () => setModalPrompt(null);
```

**Why:** AppContext now manages this state globally.

---

## Step 4: Update Route Definitions

### Before:
```tsx
element: (
  <CatalogueSection
    prompts={data.catalogue}
    downloadUrl={downloadLinks.catalogue}
    selectedPrompts={selectedPrompts}
    setSelectedPrompts={setSelectedPrompts}
    onShowDetails={onShowDetails}
    globalPromptMap={globalPromptMap}
    catalogueCount={data.catalogue.length}
    workforceCount={data.workforce.length}
    dagNodeCount={data.dag?.nodes?.length || 0}
  />
)
```

### After:
```tsx
element: (
  <CatalogueSection
    prompts={data.catalogue}
    downloadUrl={downloadLinks.catalogue}
  />
)
```

**Removed props:**
- `selectedPrompts` ❌
- `setSelectedPrompts` ❌
- `onShowDetails` ❌
- `globalPromptMap` ❌
- `catalogueCount` ❌
- `workforceCount` ❌
- `dagNodeCount` ❌

**Kept props:**
- `prompts` ✅ (specific to this section)
- `downloadUrl` ✅ (specific to this section)

**Repeat for WorkforceSection and DagSection routes.**

---

## Step 5: Add ModalProvider Component

Create a new component inside App.tsx (or separate file):

```tsx
const ModalProvider: React.FC = () => {
  const { modalPrompt, closePromptDetails } = useAppContext();
  const { data } = useData();
  const location = useLocation();

  if (!modalPrompt || !data) return null;

  const activeSection = location.pathname.startsWith('/workforce') ? 'workforce' : 'catalogue';
  const relatedPool = activeSection === 'workforce' ? data.workforce : data.catalogue;

  return (
    <PromptDetailsModal
      prompt={modalPrompt}
      onClose={closePromptDetails}
      context={activeSection}
      relatedPool={relatedPool}
      onShowPrompt={(p) => showPromptDetails(p)}
    />
  );
};
```

Then add `<ModalProvider />` inside the AppProvider at the end:

```tsx
<AppProvider ...>
  <div className="min-h-screen bg-slate-50">
    ...
  </div>
  <ModalProvider />
</AppProvider>
```

---

## Step 6: Update Section Components

Each section component (CatalogueSection, WorkforceSection, DagSection) should:

1. **Remove props from interface:**
```tsx
interface CatalogueSectionProps {
  prompts: Prompt[];
  downloadUrl: string;
  // ❌ Remove: selectedPrompts, setSelectedPrompts, onShowDetails, globalPromptMap, counts
}
```

2. **Import and use context:**
```tsx
import { useAppContext } from '../../contexts/AppContext';

export const CatalogueSection: React.FC<CatalogueSectionProps> = ({
  prompts,
  downloadUrl,
}) => {
  const { 
    selectedPrompts, 
    setSelectedPrompts, 
    showPromptDetails, 
    globalPromptMap,
    catalogueCount,
    workforceCount,
    dagNodeCount
  } = useAppContext();

  // Rest of component logic remains the same
};
```

---

## Full Diff Example (App.tsx)

### Before:
```tsx
const App: React.FC = () => {
  const { data, loading, error, ... } = useData();
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [modalPrompt, setModalPrompt] = useState<Prompt | null>(null);

  const onShowDetails = (prompt: Prompt) => {
    setModalPrompt(prompt);
    // telemetry and view count logic
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header ... />
      <main>{element}</main>
      <Footer />
      {modalPrompt && <PromptDetailsModal ... />}
    </div>
  );
};
```

### After:
```tsx
import { AppProvider } from './contexts/AppContext';

const App: React.FC = () => {
  const { data, loading, error, ... } = useData();

  return (
    <AppProvider
      globalPromptMap={globalPromptMap}
      catalogueCount={data?.catalogue?.length || 0}
      workforceCount={data?.workforce?.length || 0}
      dagNodeCount={data?.dag?.nodes?.length || 0}
    >
      <div className="min-h-screen bg-slate-50">
        <Header ... />
        <main>{element}</main>
        <Footer />
      </div>
      <ModalHandler />
    </AppProvider>
  );
};
```

---

## Testing Checklist

- [ ] App compiles without TypeScript errors
- [ ] Prompt modal opens when clicking on a prompt card
- [ ] Modal shows correct prompt details
- [ ] Selection state persists across route changes
- [ ] DataAgentChat component works (uses context for `showPromptDetails`)
- [ ] No console errors about missing context
- [ ] Demo mode badge shows correct state

---

## Rollback Plan

If issues occur, the old prop-drilling approach is still in git history:
```bash
git checkout HEAD~1 -- src/App.tsx src/components/sections/
```

---

## Competition Benefits

✅ **Cleaner code** - Judges reviewing GitHub repo see professional architecture  
✅ **Type safety** - Zero runtime errors from missing props  
✅ **Scalability** - Easy to add new components that need shared state  
✅ **Demo reliability** - Context is stable, no risk of prop mismatches during recording

---

**Estimated Time:** 15-20 minutes  
**Risk Level:** Low (context pattern is React best practice)  
**Competition Impact:** High (shows architectural maturity)
