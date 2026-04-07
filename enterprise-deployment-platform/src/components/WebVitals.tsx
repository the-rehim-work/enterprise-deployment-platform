"use client";

import { useEffect } from "react";

export default function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      const report = (metric: { name: string; value: number; id: string }) => {
        console.log("[WebVital] " + metric.name + ": " + metric.value.toFixed(2));
      };
      onCLS(report);
      onINP(report);
      onLCP(report);
      onFCP(report);
      onTTFB(report);
    });
  }, []);

  return null;
}