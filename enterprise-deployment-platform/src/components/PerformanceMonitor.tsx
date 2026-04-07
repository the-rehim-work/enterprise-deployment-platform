"use client";

import { useState, useEffect } from "react";
import { getPerfEntries, type PerfEntry } from "@/lib/perf";

const THRESHOLDS: Record<string, [number, number]> = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function getVitalColor(name: string, value: number): string {
  const t = THRESHOLDS[name];
  if (!t) return "var(--color-foreground)";
  if (value <= t[0]) return "var(--color-success)";
  if (value <= t[1]) return "var(--color-warning)";
  return "var(--color-error)";
}

export default function PerformanceMonitor() {
  const [open, setOpen] = useState(false);
  const [vitals, setVitals] = useState<Record<string, number>>({});
  const [memory, setMemory] = useState<number | null>(null);
  const [perfEntries, setPerfEntries] = useState<PerfEntry[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== "production";
    const params = new URLSearchParams(window.location.search);
    const hasDebug = params.get("debug") === "1";
    setVisible(isDev || hasDebug);
  }, []);

  useEffect(() => {
    import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      const report = (metric: { name: string; value: number }) => {
        setVitals((prev) => ({ ...prev, [metric.name]: metric.value }));
      };
      onCLS(report);
      onINP(report);
      onLCP(report);
      onFCP(report);
      onTTFB(report);
    });
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      const perf = performance as unknown as { memory?: { usedJSHeapSize: number } };
      if (perf.memory) {
        setMemory(perf.memory.usedJSHeapSize);
      }
      setPerfEntries(getPerfEntries().slice(0, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <button
        onClick={() => {
          setOpen((o) => !o);
          setPerfEntries(getPerfEntries().slice(0, 10));
        }}
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 9999,
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          border: "none",
          background: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
          fontSize: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Performance Monitor"
      >
        📊
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "4rem",
            right: "1rem",
            zIndex: 9998,
            width: "24rem",
            maxHeight: "80vh",
            overflow: "auto",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <h3
            style={{
              color: "var(--color-foreground)",
              fontSize: "0.875rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Performance Monitor
          </h3>

          <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse", marginBottom: "1rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", color: "var(--color-muted-foreground)", paddingBottom: "0.5rem" }}>
                  Metric
                </th>
                <th style={{ textAlign: "right", color: "var(--color-muted-foreground)", paddingBottom: "0.5rem" }}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(vitals).map(([name, value]) => (
                <tr key={name}>
                  <td style={{ padding: "0.25rem 0", color: "var(--color-foreground)" }}>{name}</td>
                  <td
                    style={{
                      padding: "0.25rem 0",
                      textAlign: "right",
                      color: getVitalColor(name, value),
                      fontWeight: 600,
                    }}
                  >
                    {name === "CLS" ? value.toFixed(3) : `${value.toFixed(0)}ms`}
                  </td>
                </tr>
              ))}
              {Object.keys(vitals).length === 0 && (
                <tr>
                  <td colSpan={2} style={{ color: "var(--color-muted-foreground)", padding: "0.5rem 0" }}>
                    Collecting vitals...
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {memory !== null && (
            <div style={{ fontSize: "0.75rem", color: "var(--color-muted-foreground)", marginBottom: "1rem" }}>
              Memory:{" "}
              <span style={{ color: "var(--color-foreground)", fontWeight: 600 }}>
                {(memory / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
          )}

          {perfEntries.length > 0 && (
            <>
              <h4
                style={{
                  color: "var(--color-foreground)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Recent Performance
              </h4>
              <div style={{ fontSize: "0.6875rem" }}>
                {perfEntries.map((entry, i) => (
                  <div
                    key={`${entry.name}-${entry.timestamp}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.25rem 0",
                      color: entry.slow ? "var(--color-error)" : "var(--color-muted-foreground)",
                      borderBottom: i < perfEntries.length - 1 ? "1px solid var(--color-border)" : "none",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "60%",
                      }}
                    >
                      {entry.name}
                    </span>
                    <span style={{ fontWeight: 600 }}>{entry.duration.toFixed(1)}ms</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
