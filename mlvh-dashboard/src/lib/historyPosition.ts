// --- Session history position ---
const HISTORY_INDEX_KEY = "mlvh:historyIndex";
const HISTORY_MAX_INDEX_KEY = "mlvh:historyMaxIndex";

const readPosition = (key: string) => Number(window.sessionStorage.getItem(key)) || 0;
const writePosition = (key: string, value: number) => window.sessionStorage.setItem(key, String(value));

const getEntryIndex = () => {
  const index = (window.history.state as { index?: unknown } | null)?.index;
  return typeof index === "number" ? index : undefined;
};

const resolveNewEntryIndex = () => {
  const stored = window.sessionStorage.getItem(HISTORY_INDEX_KEY);
  return stored === null ? 0 : Number(stored) + 1;
};

const commitHistoryIndex = (index: number, truncate = false) => {
  writePosition(HISTORY_INDEX_KEY, index);
  const maxIndex = truncate ? index : Math.max(index, readPosition(HISTORY_MAX_INDEX_KEY));
  writePosition(HISTORY_MAX_INDEX_KEY, maxIndex);
};

export interface HistoryPosition {
  canGoBack: boolean;
  canGoForward: boolean;
}

export const stampHistoryEntry = () => {
  const restoredIndex = getEntryIndex();
  const index = restoredIndex ?? resolveNewEntryIndex();
  window.history.replaceState({ ...window.history.state, index }, "", window.location.href);
  commitHistoryIndex(index, restoredIndex === undefined);
};

export const getHistoryPosition = (): HistoryPosition => {
  const index = getEntryIndex() ?? 0;
  commitHistoryIndex(index);
  return { canGoBack: index > 0, canGoForward: index < readPosition(HISTORY_MAX_INDEX_KEY) };
};