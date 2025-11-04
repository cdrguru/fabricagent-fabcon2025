
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-12">
      <div className="container mx-auto py-6 px-4 text-center text-slate-500">
      <div className="flex justify-center items-center space-x-2 mb-2">
        <img src="/assets/logos/fabricagent-logo.svg" alt="FabricAgent Logo" className="h-6 w-auto opacity-70"/>
             <p className="text-sm">FabricAgent Prompt Explorer</p>
         </div>
         <p className="text-xs">Built for AI Governance & Workflow Management</p>
         <p className="text-xs mt-2">
           <Link to="/help" className="hover:text-slate-700 underline">Help Center</Link>
         </p>
      </div>
    </footer>
  );
};
