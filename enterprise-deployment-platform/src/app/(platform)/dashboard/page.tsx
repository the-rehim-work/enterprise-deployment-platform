"use client";

import { useGames } from "@/hooks";
import StatsCard from "@/components/StatsCard";
import GameCard from "@/components/GameCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const { data: games, isLoading } = useGames();

  if (isLoading) return <LoadingSpinner />;

  const featured = games?.slice(0, 4) || [];
  const freeGames = games?.filter((g) => g.price === 0) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Your gaming overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Games" value={games?.length || 0} icon="🎮" />
        <StatsCard label="Free to Play" value={freeGames.length} icon="🆓" />
        <StatsCard label="Library Value" value={`$${(games?.reduce((sum, g) => sum + g.price, 0) || 0).toFixed(2)}`} icon="💰" />
        <StatsCard label="Genres" value={new Set(games?.map((g) => g.genre)).size} icon="📂" />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Featured Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((g) => (
            <GameCard key={g.id} id={g.id} title={g.title} genre={g.genre} price={g.price} headerImage={g.headerImage} developer={g.developer} />
          ))}
        </div>
      </div>
      {freeGames.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Free to Play</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {freeGames.map((g) => (
              <GameCard key={g.id} id={g.id} title={g.title} genre={g.genre} price={g.price} headerImage={g.headerImage} developer={g.developer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}