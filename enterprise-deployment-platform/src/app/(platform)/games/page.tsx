"use client";

import { useState, useMemo } from "react";
import { useGames } from "@/hooks";
import GameCard from "@/components/GameCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function GamesPage() {
  const { data: games, isLoading } = useGames();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const genres = useMemo(() => {
    if (!games) return [];
    return Array.from(new Set(games.map((g) => g.genre))).sort();
  }, [games]);

  const filtered = useMemo(() => {
    if (!games) return [];
    return games.filter((g) => {
      if (selectedGenre && g.genre !== selectedGenre) return false;
      if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [games, selectedGenre, search]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} games available</p>
        </div>
        <input type="text" placeholder="Search games..." value={search} onChange={(e) => setSearch(e.target.value)} className="input w-64" />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedGenre(null)} className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${!selectedGenre ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>All</button>
        {genres.map((g) => (
          <button key={g} onClick={() => setSelectedGenre(g)} className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${selectedGenre === g ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{g}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((g) => (
          <GameCard key={g.id} id={g.id} title={g.title} genre={g.genre} price={g.price} headerImage={g.headerImage} developer={g.developer} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No games found.</p>}
    </div>
  );
}