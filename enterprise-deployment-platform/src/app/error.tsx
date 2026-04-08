"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "28rem",
          width: "100%",
          textAlign: "center",
          backgroundColor: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2rem",
        }}
      >
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>💥</p>
        <h1
          style={{
            color: "var(--color-foreground)",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            color: "var(--color-muted-foreground)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          {error.message || "An unexpected error occurred"}
        </p>
        {error.digest && (
          <p
            style={{
              color: "var(--color-muted-foreground)",
              fontSize: "0.75rem",
              marginBottom: "1.5rem",
              fontFamily: "monospace",
            }}
          >
            Digest: {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              padding: "0.625rem 1.5rem",
              background: "linear-gradient(to right, #47bfff, #1a44c2)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: "0.625rem 1.5rem",
              backgroundColor: "var(--color-secondary)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-secondary-foreground)",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
