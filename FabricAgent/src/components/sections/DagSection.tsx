
import React from 'react';
import { DagData, Prompt } from '../../types';
import { SectionCard } from '../ui/SectionCard';
import { WorkflowGraph } from '../graph/WorkflowGraph';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { Typography } from '../ui/Typography';

interface DagSectionProps {
    dag: DagData | null;
    downloadUrl: string;
    onShowDetails: (prompt: Prompt) => void;
    globalPromptMap: Map<string, Prompt>;
}

export const DagSection: React.FC<DagSectionProps> = ({ dag, downloadUrl, onShowDetails, globalPromptMap }) => {
    if (!dag) {
        return (
            <SectionCard>
                <div className="text-center py-12">
                     <i className="fas fa-exclamation-triangle fa-3x text-amber-400 mb-4"></i>
                    <h2 className="text-xl font-semibold text-slate-700">Workflow Graph Not Available</h2>
                    <p className="text-slate-500 mt-2">The DAG data could not be loaded for the current source.</p>
                </div>
            </SectionCard>
        );
    }

    return (
        <SectionCard>
             <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-grow">
                    <Typography as="h2" className="flex items-center gap-3">
                        <i className="fas fa-stream text-sky-500"></i>
                        Workflow DAG Visualization
                    </Typography>
                    <Typography as="subtle" className="mt-2 max-w-2xl">
                        Interactive graph showing the handoff between prompts. Click a node to view its details.
                         <a href={downloadUrl} target="_blank" download rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 font-semibold ml-2">
                            Download JSON
                        </a>
                    </Typography>
                </div>
                     <div className="hidden md:flex items-center justify-center p-2">
                         <img src="/assets/diagrams/dag-workforce.svg" alt="DAG workforce diagram" className="h-32 w-auto" />
                </div>
            </div>
            {dag.nodes.length === 0 ? (
              <SkeletonLoader variant="graph" />
            ) : (
              <WorkflowGraph dag={dag} onNodeClick={onShowDetails} globalPromptMap={globalPromptMap} />
            )}
        </SectionCard>
    );
};
