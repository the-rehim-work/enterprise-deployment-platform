"use client";

import { useState } from "react";
import { useGames, useAchievements } from "@/hooks";
import AchievementCard from "@/components/AchievementCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AchievementsPage() {
  const { data: games, isLoading: gamesLoading } = useGames();
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const { data: achievements, isLoading: achLoading } = useAchievements(selectedGame);

  if (gamesLoading) return <LoadingSpinner />;

  const gamesWithAchievements = games?.filter((g) => [
    "Counter-Strike 2", "Europa Universalis IV", "Grand Theft Auto V", "EA SPORTS FC 25",
    "Euro Truck Simulator 2", "Forza Horizon 5", "Battlefield 1", "The Witcher 3: Wild Hunt",
    "Elden Ring", "Baldur's Gate 3"
  ].includes(g.title)) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground text-sm">Select a game to view achievements</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {gamesWithAchievements.map((g) => (
          <button key={g.id} onClick={() => setSelectedGame(g.id)} className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${selectedGame === g.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{g.title}</button>
        ))}
      </div>
      {!selectedGame && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-muted-foreground">Select a game above to view its achievements</p>
        </div>
      )}
      {achLoading && <LoadingSpinner />}
      {achievements && achievements.length > 0 && (
        <div className="space-y-2">
          {achievements.map((a) => (
            <AchievementCard key={a.id} title={a.title} description={a.description} icon={a.icon} points={a.points} />
          ))}
        </div>
      )}
      {achievements && achievements.length === 0 && <p className="text-center text-muted-foreground py-12">No achievements for this game.</p>}
    </div>
  );
}