import { prisma } from "./db";

export type AuditAction =
  | "LOGIN"
  | "LOGIN_FAILED"
  | "REGISTER"
  | "LOGOUT"
  | "GAME_CREATED"
  | "GAME_DELETED"
  | "ACHIEVEMENT_CREATED"
  | "ROLE_CHANGED";

export async function logAudit(
  action: AuditAction,
  userId: number | null,
  meta?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId,
        meta: meta ? JSON.stringify(meta) : null,
      },
    });
  } catch (e) {
    console.error("Audit log failed:", e);
  }
}
