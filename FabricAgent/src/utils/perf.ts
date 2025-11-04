export function startFpsMonitor(enabled = false) {
  if (!enabled) return () => {};
  let last = performance.now();
  let frames = 0;
  let rafId = 0;
  const loop = () => {
    frames++;
    const now = performance.now();
    if (now - last >= 1000) {
      const fps = Math.round((frames * 1000) / (now - last));
      // eslint-disable-next-line no-console
      console.debug('[FPS]', fps);
      frames = 0; last = now;
    }
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}

