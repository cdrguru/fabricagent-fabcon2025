import React, { useEffect, useRef, useState } from "react";
import { HELP_URL } from "./constants";

export default function HelpSection() {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [blocked, setBlocked] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Detect frame blocking with longer timeout and more lenient detection
    useEffect(() => {
        const t = setTimeout(() => {
            if (!loaded) {
                // Check if iframe has any content before declaring it blocked
                try {
                    const iframe = iframeRef.current;
                    if (iframe && iframe.src && iframe.contentWindow) {
                        // If we can access contentWindow, keep trying a bit longer
                        setTimeout(() => {
                            if (!loaded) setBlocked(true);
                        }, 3000);
                    } else {
                        setBlocked(true);
                    }
                } catch {
                    setBlocked(true);
                }
            }
        }, 5000); // Increased from 2s to 5s
        return () => clearTimeout(t);
    }, [loaded]);

    const handleLoad = () => {
        setLoaded(true);
        // Don't immediately set blocked=true on cross-origin errors
        // Many sites will load but block contentDocument access
    };

    const handleError = () => {
        setBlocked(true);
    };

    // Document title hint is handled globally in index.tsx (see below)
    useEffect(() => { try { console.debug('HELP_URL:', HELP_URL); } catch {} }, []);

    return (
        <main style={{ padding: "24px" }} role="main" aria-labelledby="help-title">
          <div className="fabric-gradient" style={{ height: 4, borderRadius: 4 }} aria-hidden="true" />
          <header style={{ margin: "16px 0 20px" }}>
            <h1 id="help-title" style={{ margin: 0 }}>Help Center</h1>
            <p style={{ marginTop: 8, color: "#555" }}>
              Docs & FAQs for the FabricAgent Helper.
            </p>
          </header>

{
    !blocked ? (
        <iframe
          ref={iframeRef}
          src={HELP_URL}
          title="Help Center - Documentation and FAQs"
          referrerPolicy="no-referrer"
          allow="clipboard-read; clipboard-write"
          onLoad={handleLoad}
          onError={handleError}
          aria-label="Help Center content"
          style={{
            width: "100%",
            height: "calc(100vh - 210px)",
            border: 0,
            borderRadius: "12px",
          }}
        />
      ) : (
    <div
          role="region"
          aria-label="Help Center Fallback"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            background: "#fff",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Having trouble loading the Help Center?</h2>
          <p style={{ color: "#555", marginBottom: 16 }}>
            The Help Center content could not be loaded in this view. You can access it directly using the button below.
          </p>
          <a
            href={HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              backgroundColor: "#4f46e5",
              color: "white",
              textDecoration: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4338ca"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4f46e5"}
          >
            <i className="fas fa-external-link-alt" aria-hidden="true"></i>
            Open Help Center
          </a>
        </div>
      )}
</main>
  );
}
