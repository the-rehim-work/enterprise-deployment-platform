"use server";

import { prisma, dbReady } from "@/lib/db";
import { registerSchema, loginSchema } from "@/lib/validators";
import { hashSync, compareSync } from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

const COOKIE_NAME = "auth-token";

async function setCookie(token: string) {
 const cookieStore = await cookies();
 cookieStore.set(COOKIE_NAME, token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
 });
}

function formatZodError(issues: { path: PropertyKey[]; message: string }[]): string {
 const issue = issues[0];
 const field = String(issue.path[0]);
 const map: Record<string, Record<string, string>> = {
  username: { too_small: "Username must be at least 3 characters", too_big: "Username must be at most 30 characters" },
  email: { invalid_string: "Invalid email address" },
  password: { too_small: "Password must be at least 6 characters" },
  displayName: { too_small: "Display name cannot be empty", too_big: "Display name must be at most 50 characters" },
 };
 return map[field]?.[issue.message] || `${field}: ${issue.message}`;
}

export async function loginAction(formData: { username: string; password: string }) {
 await dbReady;
 const parsed = loginSchema.safeParse(formData);
 if (!parsed.success) return { error: formatZodError(parsed.error.issues) };

 const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
 if (!user || !compareSync(parsed.data.password, user.passwordHash)) {
  return { error: "Invalid username or password" };
 }

 const token = await signToken({ id: user.id, username: user.username, role: user.role });
 await setCookie(token);
 return { success: true };
}

export async function registerAction(formData: { username: string; email: string; password: string; displayName?: string }) {
 await dbReady;
 const parsed = registerSchema.safeParse(formData);
 if (!parsed.success) return { error: formatZodError(parsed.error.issues) };

 try {
  const user = await prisma.user.create({
   data: {
    username: parsed.data.username,
    email: parsed.data.email,
    passwordHash: hashSync(parsed.data.password, 10),
    displayName: parsed.data.displayName || parsed.data.username,
   },
  });

  const token = await signToken({ id: user.id, username: user.username, role: user.role });
  await setCookie(token);
  return { success: true };
 } catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
   const field = (e.meta?.target as string[])?.[0];
   if (field === "username") return { error: "Username already taken" };
   if (field === "email") return { error: "Email already taken" };
   return { error: "Account already exists" };
  }
  console.error("Register error:", e);
  return { error: "Something went wrong, try again" };
 }
}

export async function logoutAction() {
 const cookieStore = await cookies();
 cookieStore.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
 return { success: true };
}