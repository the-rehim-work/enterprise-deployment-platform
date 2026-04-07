"use client";

import { useState } from "react";
import { useGames, useLeaderboard } from "@/hooks";
import LeaderboardTable from "@/components/LeaderboardTable";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LeaderboardPage() {
  const { data: games, isLoading: gamesLoading } = useGames();
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const { data: entries, isLoading: lbLoading } = useLeaderboard(selectedGame);

  if (gamesLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground text-sm">Select a game to view rankings</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {games?.map((g) => (
          <button key={g.id} onClick={() => setSelectedGame(g.id)} className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${selectedGame === g.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{g.title}</button>
        ))}
      </div>
      {!selectedGame && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📈</p>
          <p className="text-muted-foreground">Select a game above to view its leaderboard</p>
        </div>
      )}
      {lbLoading && <LoadingSpinner />}
      {entries && entries.length > 0 && <LeaderboardTable entries={entries} />}
      {entries && entries.length === 0 && <p className="text-center text-muted-foreground py-12">No leaderboard entries for this game.</p>}
    </div>
  );
}