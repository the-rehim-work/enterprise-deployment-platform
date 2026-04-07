export type PerfEntry = {
  name: string;
  duration: number;
  timestamp: number;
  slow: boolean;
};

const entries: PerfEntry[] = [];
const MAX_ENTRIES = 100;

function getThreshold(name: string): number {
  if (name.includes("api-call")) return 2000;
  if (name.includes("render")) return 100;
  if (name.includes("db-query")) return 500;
  return 1000;
}

function recordEntry(name: string, duration: number) {
  const threshold = getThreshold(name);
  const slow = duration > threshold;
  entries.unshift({ name, duration, timestamp: Date.now(), slow });
  if (entries.length > MAX_ENTRIES) entries.pop();
  if (slow) {
    console.warn(`[perf] ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
  }
}

export function measurePerf<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  recordEntry(name, duration);
  return result;
}

export async function measurePerfAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  recordEntry(name, duration);
  return result;
}

export function getPerfEntries(): PerfEntry[] {
  return [...entries];
}

export function getPerfSummary(): { total: number; slowCount: number; avgMs: number; maxMs: number; minMs: number } | null {
  if (entries.length === 0) return null;
  const durations = entries.map((e) => e.duration);
  return {
    total: entries.length,
    slowCount: entries.filter((e) => e.slow).length,
    avgMs: durations.reduce((a, b) => a + b, 0) / durations.length,
    maxMs: Math.max(...durations),
    minMs: Math.min(...durations),
  };
}

export function clearPerfEntries(): void {
  entries.length = 0;
}
