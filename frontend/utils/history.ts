// utils/history.ts
// Gère l'historique local de pitchs et de tests via localStorage
// Clé utilisée : 'devdrill_history'

export type HistoryEntry = {
  type: "pitch" | "test";
  title: string;
  content: string;
  date: string; // ISO format
};

const STORAGE_KEY = "devdrill_history";
const MAX_ENTRIES = 50;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateTitle(content: string): string {
  const words = content.trim().split(/\s+/);
  if (words.length <= 10) return content.trim();
  return words.slice(0, 10).join(' ') + '…';
}

export function saveToHistory(entry: { type: "pitch" | "test"; title: string; content: string }): void {
  if (!isBrowser()) return;
  try {
    const now = new Date().toISOString();
    const newEntry: HistoryEntry = {
      ...entry,
      date: now
    };
    const raw = window.localStorage.getItem(STORAGE_KEY);
    let history: HistoryEntry[] = [];
    if (raw) {
      try {
        history = JSON.parse(raw);
        if (!Array.isArray(history)) history = [];
      } catch {
        history = [];
      }
    }
    history.push(newEntry);
    // Garder au max 50 entrées, les plus récentes
    if (history.length > MAX_ENTRIES) {
      history = history.slice(history.length - MAX_ENTRIES);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
}

export function getHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    let history: any[] = JSON.parse(raw);
    if (!Array.isArray(history)) return [];
    // Ajoute dynamiquement un titre vide si absent (pour rétrocompatibilité)
    history = history.map((entry) => ({
      ...entry,
      title: typeof entry.title === 'string' ? entry.title : '',
    }));
    // Tri du plus récent au plus ancien
    return [...history].sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
