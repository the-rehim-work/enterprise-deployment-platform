"use client";

import { useEffect } from "react";

export default function GlobalErrorHandler() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "unhandled_error",
          message: event.message,
          stack: event.error?.stack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const error = event.reason;
      fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "unhandled_rejection",
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
