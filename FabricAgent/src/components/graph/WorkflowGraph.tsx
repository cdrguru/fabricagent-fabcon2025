// FIX: Import useMemo to resolve 'Cannot find name 'useMemo'' error.
import React, { useEffect, useRef, useState, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { DagData, Prompt, DagNode } from '../../types';
import { GROUP_COLORS } from '../../constants';

// vis-network is not typed, so we declare it
declare const vis: any;

interface WorkflowGraphProps {
    dag: DagData;
    onNodeClick: (prompt: Prompt) => void;
    globalPromptMap: Map<string, Prompt>;
}

const escapeHtml = (s: string) => s
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({ dag, onNodeClick, globalPromptMap }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<any>(null);
    const minimapRef = useRef<HTMLCanvasElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [layoutMode, setLayoutMode] = useState<'hierarchical' | 'force'>('hierarchical');
    const userLayoutOverride = useRef(false);

    // Auto-pick a sensible layout based on graph size unless user overrides
    useEffect(() => {
        const isSmall = dag.nodes.length <= 80;
        if (!userLayoutOverride.current) {
            setLayoutMode(isSmall ? 'force' : 'hierarchical');
        }
    }, [dag]);

    const pillarOrder = useMemo(() => {
        const pillars = new Set<string>();
        dag.nodes.forEach(node => {
            const group = (node.pillars && node.pillars[0]) || node.category || 'other';
            pillars.add(group);
        });
        return Array.from(pillars).sort();
    }, [dag]);

    useEffect(() => {
        if (!containerRef.current || !vis) return;

        // Compute levels by longest distance from sources for better separation
        const inDegree = new Map<string, number>();
        const adj = new Map<string, string[]>();
        dag.nodes.forEach(n => { inDegree.set(n.id, 0); adj.set(n.id, []); });
        dag.edges.forEach(e => {
            inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1);
            adj.get(e.from)?.push(e.to);
        });
        const queue: string[] = [];
        inDegree.forEach((deg, id) => { if (!deg) queue.push(id); });
        const level = new Map<string, number>();
        queue.forEach(id => level.set(id, 0));
        while (queue.length) {
            const u = queue.shift()!;
            const lu = level.get(u) || 0;
            for (const v of (adj.get(u) || [])) {
                const lv = Math.max(level.get(v) || 0, lu + 1);
                level.set(v, lv);
                const deg = (inDegree.get(v) || 0) - 1;
                inDegree.set(v, deg);
                if (deg === 0) queue.push(v);
            }
        }

        const nodes = new vis.DataSet(dag.nodes.map(n => {
            const group = (n.pillars && n.pillars[0]) || n.category || 'other';
            const fullPrompt = globalPromptMap.get(n.id.toLowerCase());
            const hasSafety = !!fullPrompt?.safety?.safety_clause;
            // Normalize label: convert <br> to newlines and strip other tags so vis renders multiline text nicely
            const rawLabel = n.title || n.label || n.role || n.id;
            const label = String(rawLabel)
              .replace(/<br\s*\/?>(\n)?/gi, "\n")
              .replace(/<[^>]*>/g, "");
            // HTML tooltip: escape text, preserve line breaks with <br />
            const safeLabel = escapeHtml(label).replace(/\n/g, '<br />');
            const safeGroup = escapeHtml(group);
            const tooltipHtml = DOMPurify.sanitize(
              `Title: ${safeLabel}<br />Pillar: ${safeGroup}`,
              { ALLOWED_TAGS: ['br'] }
            );
            return {
                id: n.id,
                label: (hasSafety ? '🛡️ ' : '') + label,
                title: tooltipHtml,
                group: group,
                level: level.get(n.id) ?? undefined,
            };
        }));

        const edges = new vis.DataSet(dag.edges.map(e => ({
            from: e.from,
            to: e.to,
            arrows: { to: { enabled: true, scaleFactor: 0.7 } },
            color: { inherit: 'from' },
        })));

        const data = { nodes, edges };

        const chosenLayout: 'hierarchical' | 'force' = layoutMode;

        const options = {
            nodes: {
                shape: 'box',
                margin: 10,
                font: { color: '#333', size: 14 },
                shadow: true,
            },
            edges: {
                smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 },
            },
            layout: {
                hierarchical: chosenLayout === 'hierarchical' ? {
                    enabled: true,
                    direction: 'UD',
                    levelSeparation: 160,
                    nodeSpacing: 220,
                    treeSpacing: 200,
                    sortMethod: 'directed',
                } : false,
            },
            interaction: {
                hover: true,
                dragNodes: true,
                dragView: true,
                zoomView: true,
            },
            physics: chosenLayout === 'force' ? {
                enabled: true,
                solver: 'forceAtlas2Based',
                forceAtlas2Based: { gravitationalConstant: -50, centralGravity: 0.01, springLength: 170, springConstant: 0.06, avoidOverlap: 1 },
                stabilization: { enabled: true, iterations: 200 },
            } : { enabled: false },
            groups: Object.fromEntries(
                Object.entries(GROUP_COLORS).map(([group, color]) => [
                    group,
                    { color: { background: color, border: '#444' } },
                ])
            ),
        };

        const network = new vis.Network(containerRef.current, data, options);
        networkRef.current = network;

        // Fit-to-view on initial stabilization and on resize
        const fit = () => network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
        const onStabilized = () => fit();
        network.once('stabilized', onStabilized);

        const ro = new ResizeObserver(() => fit());
        ro.observe(containerRef.current);

        // Minimap draw function
        const drawMinimap = () => {
            const canvas = minimapRef.current; if (!canvas) return;
            const ctx = canvas.getContext('2d'); if (!ctx) return;
            const positions = network.getPositions();
            const vals = Object.values(positions);
            if (!vals.length) return;
            const xs = vals.map(p => p.x), ys = vals.map(p => p.y);
            const minX = Math.min(...xs), maxX = Math.max(...xs);
            const minY = Math.min(...ys), maxY = Math.max(...ys);
            const pad = 10;
            const w = canvas.width, h = canvas.height;
            ctx.clearRect(0,0,w,h);
            ctx.fillStyle = '#e2e8f0'; ctx.fillRect(0,0,w,h);
            ctx.fillStyle = '#334155';
            vals.forEach(p => {
                const nx = ((p.x - minX) / Math.max(1, (maxX - minX))) * (w - pad*2) + pad;
                const ny = ((p.y - minY) / Math.max(1, (maxY - minY))) * (h - pad*2) + pad;
                ctx.fillRect(nx, ny, 2, 2);
            });
        };
        const drawLoop = () => { drawMinimap(); requestAnimationFrame(drawLoop); };
        requestAnimationFrame(drawLoop);

        network.on('click', (params: any) => {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const prompt = globalPromptMap.get(nodeId.toLowerCase());
                if (prompt) {
                    onNodeClick(prompt);
                }
            }
        });

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
            ro.disconnect();
        };

    }, [dag, globalPromptMap, onNodeClick, layoutMode]);

    const [debouncedQuery, setDebouncedQuery] = useState('');
    useEffect(() => {
        const id = setTimeout(() => setDebouncedQuery(searchQuery), 250);
        return () => clearTimeout(id);
    }, [searchQuery]);

    useEffect(() => {
        if (!networkRef.current || !debouncedQuery) return;
        const query = debouncedQuery.toLowerCase();
        const allNodes: any[] = networkRef.current.body.data.nodes.get();
        const foundNode = allNodes.find(
            (node) => String(node.id).toLowerCase().includes(query) || (node.label || "").toLowerCase().includes(query)
        );
        if (foundNode) {
            networkRef.current.focus(foundNode.id, { scale: 1.2, animation: true });
            networkRef.current.selectNodes([foundNode.id]);
        }
    }, [debouncedQuery]);

    // Highlight paths on hover
    useEffect(() => {
        const net = networkRef.current;
        if (!net) return;
        const onHover = (params: any) => {
            if (!params.node) return;
            const nodeId = params.node;
            const connectedEdges = net.getConnectedEdges(nodeId);
            net.selectEdges(connectedEdges);
        };
        const onBlur = () => { net.unselectAll(); };
        net.on('hoverNode', onHover);
        net.on('blurNode', onBlur);
        return () => {
            net.off('hoverNode', onHover);
            net.off('blurNode', onBlur);
        };
    }, [networkRef.current]);

     const resetView = () => {
        if (networkRef.current) {
            networkRef.current.fit({ animation: true });
            networkRef.current.unselectAll();
        }
    };


    return (
         <div className="space-y-4">
             <div className="flex flex-wrap gap-2 items-center p-2 bg-slate-50 rounded-lg">
                <div className="relative">
                     <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        placeholder="Search node..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
                        aria-label="Search nodes"
                    />
                </div>
                <button onClick={resetView} className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 transition" aria-label="Reset view">
                    <i className="fas fa-sync-alt mr-2"></i>Reset View
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-slate-600">Layout:</span>
                  <select aria-label="Layout mode" value={layoutMode} onChange={(e) => { userLayoutOverride.current = true; setLayoutMode(e.target.value as any); }} className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-white">
                    <option value="hierarchical">Hierarchical</option>
                    <option value="force">Force-directed</option>
                  </select>
                  <div className="h-5 w-px bg-slate-300" />
                  <button className="px-2 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100" onClick={() => networkRef.current?.moveTo({ scale: (networkRef.current.getScale?.() || 1) * 1.2 })} title="Zoom in">＋</button>
                  <button className="px-2 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100" onClick={() => networkRef.current?.moveTo({ scale: (networkRef.current.getScale?.() || 1) / 1.2 })} title="Zoom out">－</button>
                  <button className="px-2 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100" onClick={resetView} title="Fit to view">Fit</button>
                  <div className="h-5 w-px bg-slate-300" />
                  <button className="px-2 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100" onClick={() => {
                    const container = containerRef.current; if (!container) return;
                    const cvs = container.querySelector('canvas');
                    const url = (cvs as HTMLCanvasElement)?.toDataURL('image/png');
                    if (url) { const a = document.createElement('a'); a.href = url; a.download = 'workflow.png'; a.click(); }
                  }} title="Export PNG">PNG</button>
                  <button className="px-2 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100" onClick={() => {
                    const blob = new Blob([JSON.stringify(dag, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'workflow.json'; a.click(); URL.revokeObjectURL(url);
                  }} title="Export JSON">JSON</button>
                  <div className="h-5 w-px bg-slate-300" />
                  <button className="px-2 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100" onClick={() => {
                    const net = networkRef.current; if (!net) return; try { net.clusterByHubsize?.(undefined, { clusterNodeProperties: { label: 'Cluster' } }); } catch {}
                  }} title="Cluster">Cluster</button>
                  <button className="px-2 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100" onClick={() => networkRef.current?.openCluster?.()} title="Uncluster">Uncluster</button>
                </div>
             </div>
            <div className="relative w-full h-[70vh] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                <div ref={containerRef} className="w-full h-full" />
                {/* Minimap */}
                <canvas ref={minimapRef} width={160} height={100} className="absolute right-3 bottom-3 border border-slate-300 rounded bg-white/80 shadow" />
            </div>
        </div>
    );
};
