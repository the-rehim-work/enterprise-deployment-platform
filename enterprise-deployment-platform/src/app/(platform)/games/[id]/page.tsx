"use client";

import { useParams } from "next/navigation";
import { useGame } from "@/hooks";
import GameDetail from "@/components/GameDetail";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Game } from "@prisma/client";

export default function GameDetailPage() {
  const { id } = useParams();
  const { data: game, isLoading } = useGame(id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!game) return <p className="text-muted-foreground">Game not found.</p>;

  return <GameDetail {...(game as Game)} />;
}