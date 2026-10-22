const STORAGE_KEY = "zudoku-slots-visible";

// Module-level singleton — shared across all slot components without a Provider.
// Initialized synchronously from localStorage so there's no flicker on mount.
let visible: boolean = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
})();

const subscribers = new Set<() => void>();

export const slotStore = {
  subscribe(cb: () => void) {
    subscribers.add(cb);
    return () => { subscribers.delete(cb); };
  },
  getSnapshot() {
    return visible;
  },
  // SSR fallback — Zudoku dev doesn't SSR but useSyncExternalStore requires it
  getServerSnapshot() {
    return false;
  },
  toggle() {
    visible = !visible;
    try { localStorage.setItem(STORAGE_KEY, String(visible)); } catch { /* noop */ }
    subscribers.forEach((cb) => cb());
  },
};
