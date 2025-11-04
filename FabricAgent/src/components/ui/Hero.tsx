
import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
    catalogueCount: number;
    workforceCount: number;
    dagNodeCount: number;
    giacCount?: number;
    customCount?: number;
    compact?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ catalogueCount, workforceCount, dagNodeCount, giacCount = 0, customCount = 0, compact = false }) => {
    // Render the component only if there is data to show
    if (catalogueCount === 0 && workforceCount === 0 && dagNodeCount === 0) {
        return null;
    }

    return (
        <div className={`text-center ${compact ? 'mb-6' : 'mb-12'} animate-fade-in-up`}>
            <h1 className={`${compact ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-5xl'} font-extrabold text-slate-900 mb-2`}>
                FabricAgent Prompt Explorer
            </h1>
            <p className={`max-w-3xl mx-auto ${compact ? 'text-base mb-4' : 'text-lg mb-8'} text-slate-700`}>
                Discover, explore, and manage your AI prompts with powerful visualization and governance tools.
            </p>
            <div className={`flex justify-center items-center space-x-4 sm:space-x-8 text-slate-600 ${compact ? 'mb-4' : 'mb-8'}`}>
                <div className="text-center">
                    <p className={`${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-bold text-indigo-600`}>{catalogueCount}</p>
                    <p className="text-sm tracking-wide">Total Prompts</p>
                </div>
                <div className="text-center">
                    <p className={`${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-bold text-sky-600`}>{giacCount}</p>
                    <p className="text-sm tracking-wide">Guy in a Cube</p>
                </div>
                <div className="text-center">
                    <p className={`${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-bold text-slate-600`}>{customCount}</p>
                    <p className="text-sm tracking-wide">Custom Prompts</p>
                </div>
                <div className="text-center">
                    <p className={`${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-bold text-teal-600`}>{dagNodeCount}</p>
                    <p className="text-sm tracking-wide">Workflow Nodes</p>
                </div>
            </div>
            <div className={`flex justify-center space-x-4 ${compact ? 'hidden sm:flex' : ''}`}>
                <Link to="/catalogue" className="fabric-btn">Explore Catalogue</Link>
                <Link to="/workforce" className="fabric-btn">View Workforce</Link>
                <Link to="/help" className="fabric-btn">Help Center</Link>
            </div>
        </div>
    );
};
