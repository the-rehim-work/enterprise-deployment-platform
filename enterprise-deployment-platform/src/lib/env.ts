import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

export const env = validateEnv();
