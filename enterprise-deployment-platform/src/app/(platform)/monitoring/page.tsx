import { redirect } from "next/navigation";
import { getAuthFromCookies } from "@/lib/jwt";
import { prisma, dbReady } from "@/lib/db";
import { headers } from "next/headers";

type ClientError = {
  id: string;
  type?: string;
  context?: string;
  message: string;
  stack?: string;
  url?: string;
  timestamp: string;
  userAgent?: string;
};

export default async function MonitoringPage() {
  const user = await getAuthFromCookies();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  await dbReady;
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  let clientErrors: ClientError[] = [];
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") || "http";
    const res = await fetch(`${proto}://${host}/api/errors`, {
      headers: { Authorization: "Bearer admin" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      clientErrors = data.errors;
    }
  } catch {}

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Monitoring</h1>
        <p className="text-muted-foreground text-sm">Platform events and client error reports</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Platform Events</h2>
        {auditLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No platform events recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Action</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">User ID</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Meta</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => {
                  let meta: Record<string, unknown> = {};
                  try {
                    if (log.meta) meta = JSON.parse(log.meta);
                  } catch {}
                  return (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-white/5">
                      <td className="py-2 px-3 text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3">
                        <span className="badge-primary">{log.action}</span>
                      </td>
                      <td className="py-2 px-3 text-foreground">{log.userId ?? "—"}</td>
                      <td className="py-2 px-3 text-muted-foreground text-xs font-mono">
                        {Object.keys(meta).length > 0 ? JSON.stringify(meta) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Client Errors</h2>
        {clientErrors.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No client errors reported.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Timestamp</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Type</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Context</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Message</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Error ID</th>
                </tr>
              </thead>
              <tbody>
                {clientErrors.map((err) => (
                  <tr key={err.id} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-2 px-3 text-muted-foreground">
                      {new Date(err.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <span className="badge-primary">{err.type || "error"}</span>
                    </td>
                    <td className="py-2 px-3 text-foreground">{err.context || "—"}</td>
                    <td className="py-2 px-3 text-muted-foreground">
                      {err.message?.substring(0, 80) || "—"}
                      {err.message?.length > 80 ? "..." : ""}
                    </td>
                    <td className="py-2 px-3 text-xs font-mono text-muted-foreground">{err.id || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
