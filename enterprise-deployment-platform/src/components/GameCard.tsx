import Link from "next/link";
import type { Game } from "@prisma/client";

type Props = Pick<Game, "id" | "title" | "genre" | "price" | "headerImage" | "developer">;

const GENRE_COLORS: Record<string, string> = {
  FPS: "#e74c3c",
  Strategy: "#3498db",
  Action: "#e67e22",
  Sports: "#2ecc71",
  Simulation: "#9b59b6",
  Racing: "#f39c12",
  RPG: "#1abc9c",
  MOBA: "#e74c3c",
  Casual: "#f1c40f",
  "Battle Royale": "#e74c3c",
  Survival: "#27ae60",
  Sandbox: "#e67e22",
  Puzzle: "#3498db",
  Horror: "#8e44ad",
  Adventure: "#2980b9",
  Platformer: "#d35400",
};

export default function GameCard({ id, title, genre, price, headerImage, developer }: Props) {
  const color = GENRE_COLORS[genre] || "#66c0f4";

  return (
    <Link href={`/games/${id}`} className="group block bg-card rounded-sm overflow-hidden transition-all duration-150 hover:shadow-lg hover:scale-[1.02]">
      <div className="aspect-[460/215] overflow-hidden relative">
        {headerImage ? (
          <img src={headerImage} alt={title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center" style={{ background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)` }}>
            <div className="w-10 h-10 rounded-sm mb-2 flex items-center justify-center text-lg" style={{ backgroundColor: `${color}22`, color }}>
              🎮
            </div>
            <p className="text-sm font-medium text-foreground leading-tight">{title}</p>
            <p className="text-xs mt-1" style={{ color }}>{genre}</p>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-foreground text-sm truncate">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{developer}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{genre}</span>
          {price === 0 ? (
            <span className="text-xs font-medium text-accent">Free to Play</span>
          ) : (
            <span className="text-xs font-medium bg-accent/90 text-accent-foreground px-2 py-0.5 rounded-sm">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}