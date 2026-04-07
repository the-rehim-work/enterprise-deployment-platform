import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1).max(50).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
});

export const createGameSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  genre: z.string().min(1),
  price: z.number().min(0).default(0),
  releaseDate: z.string().optional(),
  developer: z.string().min(1),
  publisher: z.string().optional(),
  coverImage: z.string().optional(),
  headerImage: z.string().optional(),
});

export const createAchievementSchema = z.object({
  gameId: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
  points: z.number().int().min(0).default(0),
});