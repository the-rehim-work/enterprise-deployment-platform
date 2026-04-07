import Link from "next/link";

export default function NotFound() {
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
        <p
          style={{
            color: "var(--color-primary)",
            fontSize: "5rem",
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: "1rem",
          }}
        >
          404
        </p>
        <h1
          style={{
            color: "var(--color-foreground)",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            color: "var(--color-muted-foreground)",
            fontSize: "0.875rem",
            marginBottom: "2rem",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "0.625rem 1.5rem",
            background: "linear-gradient(to right, #47bfff, #1a44c2)",
            borderRadius: "var(--radius-sm)",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
