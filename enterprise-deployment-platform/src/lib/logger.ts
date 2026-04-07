type LogLevel = "debug" | "info" | "warn" | "error";

interface Logger {
  debug: (msg: string, data?: unknown) => void;
  info: (msg: string, data?: unknown) => void;
  warn: (msg: string, data?: unknown) => void;
  error: (msg: string, data?: unknown) => void;
}

const LOG_METHODS: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

export function createLogger(module: string): Logger {
  const isProduction = process.env.NODE_ENV === "production";

  function log(level: LogLevel, msg: string, data?: unknown) {
    if (isProduction && (level === "debug" || level === "info")) return;
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${module}]`;
    if (data !== undefined) {
      LOG_METHODS[level](`${prefix} ${msg} ${JSON.stringify(data)}`);
    } else {
      LOG_METHODS[level](`${prefix} ${msg}`);
    }
  }

  return {
    debug: (msg, data) => log("debug", msg, data),
    info: (msg, data) => log("info", msg, data),
    warn: (msg, data) => log("warn", msg, data),
    error: (msg, data) => log("error", msg, data),
  };
}

export const logger = createLogger("app");
