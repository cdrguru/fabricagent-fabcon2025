# THIS IS AN OUTLINE OF A TYPICAL FABRIC REPO

fabric-repo/
├─ semantic_models/
│  └─ <ModelName>.SemanticModel/
│     ├─ definition.json
│     ├─ connections.json
│     ├─ roles/
│     │  └─ <RoleName>.json
│     ├─ tables/
│     │  └─ <TableName>.json
│     └─ partitions/
│        └─ <TableName>/
│           └─ <PartitionName>.json
│
├─ reports/
│  └─ <ReportName>.Report/
│     ├─ definition.json
│     └─ connections.json
│
├─ paginated_reports/
│  └─ <ReportName>.PaginatedReport/
│     ├─ definition.rdl
│     └─ parameters.json
│
├─ notebooks/
│  └─ <NotebookName>/
│     ├─ <NotebookName>.ipynb
│     └─ requirements.txt
│
├─ datasets/
│  └─ <DatasetName>.Dataset/
│     ├─ definition.json
│     └─ refresh.json
│
├─ dataflows/
│  └─ <DataflowName>.Dataflow/
│     ├─ definition.json
│     ├─ parameters.json
│     └─ entities/
│        └─ <EntityName>.json
│
├─ lakehouses/
│  └─ <LakehouseName>.Lakehouse/
│     ├─ shortcuts.json
│     ├─ tables/
│     │  └─ <TableName>/
│     │     ├─ schema.json
│     │     └─ files/
│     │        └─ .keep
│     └─ files/
│        └─ <Folder>/
│
├─ warehouses/
│  └─ <WarehouseName>.Warehouse/
│     ├─ schema/
│     │  └─ <SchemaName>/
│     │     ├─ tables/
│     │     │  └─ <TableName>.sql
│     │     └─ views/
│     │        └─ <ViewName>.sql
│     └─ security/
│        └─ roles.sql
│
├─ pipelines/
│  └─ <PipelineName>.Pipeline/
│     ├─ pipeline.json
│     ├─ activities/
│     │  └─ <ActivityName>.json
│     ├─ datasets/
│     │  └─ <DatasetName>.json
│     └─ triggers/
│        └─ <TriggerName>.json
│
├─ shortcuts/
│  └─ <ShortcutName>.Shortcut/
│     └─ definition.json
│
├─ environments/
│  ├─ dev/
│  │  ├─ workspace.json
│  │  └─ parameters.json
│  ├─ test/
│  │  ├─ workspace.json
│  │  └─ parameters.json
│  └─ prod/
│     ├─ workspace.json
│     └─ parameters.json
│
├─ .fabricignore
├─ .gitignore
└─ README.md
