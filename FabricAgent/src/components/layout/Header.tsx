
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ItDepends } from '../ui/ItDepends';
import type { Section } from '../../App';

interface HeaderProps {
    activeSection: Section | null;
    onSectionChange: (section: Section) => void;
    sourceLabel: string;
    isDagAvailable: boolean;
    isHelp: boolean;
}


export const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange, sourceLabel, isDagAvailable, isHelp }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                                <Link to="/" className="flex items-center space-x-2">
                                    <img src="/assets/logos/fabricagent-logo.svg" alt="FabricAgent Logo" className="h-8 w-auto"/>
                           <span className="font-bold text-lg text-slate-800 hidden sm:inline">FabricAgent</span>
                        </Link>
                         <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full hidden md:inline">{sourceLabel}</span>
                         <div className="hidden md:inline-block ml-2"><ItDepends /></div>
                    </div>

                    <nav>
                        <ul className="flex items-center space-x-1 sm:space-x-2">
                            <li>
                                <NavLink to="/catalogue" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative hover:bg-slate-100 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}>
                                    {({ isActive }) => (
                                        <>
                                            <i className="fas fa-book fa-fw mr-2 w-4 text-center"></i>
                                            Catalogue
                                            {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-indigo-500 rounded-full"></span>}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/workforce" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative hover:bg-slate-100 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}>
                                    {({ isActive }) => (
                                        <>
                                            <i className="fas fa-users-cog fa-fw mr-2 w-4 text-center"></i>
                                            Workforce
                                            {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-indigo-500 rounded-full"></span>}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/workflow" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative hover:bg-slate-100 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`} style={{ pointerEvents: !isDagAvailable ? 'none' : 'auto', opacity: !isDagAvailable ? 0.5 : 1 }}>
                                    {({ isActive }) => (
                                        <>
                                            <i className="fas fa-stream fa-fw mr-2 w-4 text-center"></i>
                                            Workflow
                                            {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-indigo-500 rounded-full"></span>}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/help" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative hover:bg-slate-100 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'}`}>
                                    {({ isActive }) => (
                                        <>
                                            <i className="fas fa-question-circle fa-fw mr-2 w-4 text-center"></i>
                                            Help
                                            {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-indigo-500 rounded-full"></span>}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
