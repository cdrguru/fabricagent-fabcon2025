
import React, { useEffect } from 'react';

declare global {
    interface Window {
        chatbase?: any;
    }
}

// Chatbase floating widget loader. Injects the provided script and lets Chatbase handle UI.
export const ChatBot: React.FC = () => {
    const analyticsId = (import.meta.env.VITE_ANALYTICS_KEY as string) || '';
    // If no analytics key provided, do not load chat widget
    if (!analyticsId) return null;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // If already initialized, do nothing
        try {
            if (
                typeof window.chatbase === 'function' &&
                window.chatbase('getState') === 'initialized' &&
                document.getElementById(analyticsId)
            ) {
                return;
            }
        } catch {
            // ignore and proceed to (re)initialize
        }

        // Adapted from the provided Chatbase snippet for React
        (function () {
            if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
                const cb: any = (...args: any[]) => {
                    if (!(cb as any).q) {
                        (cb as any).q = [];
                    }
                    (cb as any).q.push(args);
                };
                // Preserve queued calls if any existed
                (cb as any).q = (window.chatbase && (window.chatbase as any).q) || [];
                window.chatbase = new Proxy(cb, {
                    get(target: any, prop: string) {
                        if (prop === 'q') {
                            return target.q;
                        }
                        return (...args: any[]) => target(prop, ...args);
                    },
                });
            }
            const onLoad = function () {
                // Avoid adding duplicate script
                if (document.getElementById(analyticsId)) return;
                const script = document.createElement('script');
                script.src = 'https://www.chatbase.co/embed.min.js';
                script.id = analyticsId;
                (script as any).domain = 'www.chatbase.co';
                document.body.appendChild(script);
            };
            if (document.readyState === 'complete') {
                onLoad();
            } else {
                window.addEventListener('load', onLoad, { once: true });
            }
        })();
    }, []);

    // Chatbase renders its own floating widget, no React UI needed here
    return null;
};
