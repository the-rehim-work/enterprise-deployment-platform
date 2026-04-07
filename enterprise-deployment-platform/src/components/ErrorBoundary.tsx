"use client";

import React from "react";

const MAX_RETRIES = 3;

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: string;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
  retryCount: number;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: "", retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const context = this.props.context || "component";
    console.error(`[ErrorBoundary] [${context}] [${this.state.errorId}]`, error, info.componentStack);

    if (this.props.onError) {
      this.props.onError(error, info);
    }

    fetch("/api/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        errorId: this.state.errorId,
        context,
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
        url: typeof window !== "undefined" ? window.location.href : "",
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      }),
    }).catch(() => {});
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorId: "",
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const isProduction = process.env.NODE_ENV === "production";

      return (
        <div
          style={{
            padding: "2rem",
            maxWidth: "32rem",
            margin: "2rem auto",
            backgroundColor: "var(--color-surface-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</p>
            <h2
              style={{
                color: "var(--color-foreground)",
                fontSize: "1.25rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
              }}
            >
              Something went wrong
            </h2>
            <p style={{ color: "var(--color-muted-foreground)", fontSize: "0.875rem" }}>
              Context: {this.props.context || "component"}
            </p>
            <p
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "0.75rem",
                marginTop: "0.25rem",
                fontFamily: "monospace",
              }}
            >
              Error ID: {this.state.errorId}
            </p>
          </div>
          {!isProduction && this.state.error && (
            <pre
              style={{
                backgroundColor: "var(--color-steam-darkest)",
                color: "var(--color-error)",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.75rem",
                overflow: "auto",
                maxHeight: "10rem",
                marginBottom: "1.5rem",
              }}
            >
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            {this.state.retryCount < MAX_RETRIES && (
              <button
                onClick={this.handleRetry}
                style={{
                  padding: "0.5rem 1.25rem",
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
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.5rem 1.25rem",
                backgroundColor: "var(--color-secondary)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-secondary-foreground)",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
