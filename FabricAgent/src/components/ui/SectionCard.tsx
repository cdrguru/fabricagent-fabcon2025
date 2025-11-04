
import React from 'react';

interface SectionCardProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ children, className = '' }) => {
    return (
        <section className={`bg-white rounded-xl shadow-md p-6 sm:p-8 animate-fade-in-up overflow-hidden ${className}`}>
            {children}
        </section>
    );
};
