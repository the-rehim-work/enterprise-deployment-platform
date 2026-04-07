import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

const log = createLogger("error-api");

type StoredError = {
  id: string;
  type?: string;
  context?: string;
  message: string;
  stack?: string;
  url?: string;
  timestamp: string;
  userAgent?: string;
};

const storedErrors: StoredError[] = [];
const MAX_ERRORS = 50;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.message) {
      return NextResponse.json({ error: "Missing message field" }, { status: 400 });
    }

    const stored: StoredError = {
      id: body.errorId || `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      type: body.type,
      context: body.context,
      message: body.message,
      stack: body.stack,
      url: body.url,
      timestamp: body.timestamp || new Date().toISOString(),
      userAgent: body.userAgent,
    };

    log.error("Client error reported", stored);
    storedErrors.unshift(stored);
    if (storedErrors.length > MAX_ERRORS) storedErrors.pop();

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== "Bearer admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ errors: storedErrors, total: storedErrors.length });
}
