import useSWR from "swr";
import type { Game, Achievement } from "@prisma/client";

async function fetcher(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Fetch failed");
  return r.json();
}

export function useGames() {
  return useSWR<Game[]>("/api/games", fetcher);
}

export function useGame(id: string | number) {
  return useSWR<Game>(`/api/games/${id}`, fetcher);
}

export function useAchievements(gameId: string | number | null) {
  return useSWR<Achievement[]>(gameId ? `/api/achievements?gameId=${gameId}` : null, fetcher);
}

type LeaderboardRow = { score: number; updatedAt: string; username: string; displayName: string | null; avatar: string | null };

export function useLeaderboard(gameId: string | number | null) {
  return useSWR<LeaderboardRow[]>(gameId ? `/api/leaderboard/${gameId}` : null, fetcher);
}