import Image from "next/image";
import type { Game } from "@prisma/client";

type Props = Omit<Game, "id" | "createdAt">;

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

export default function GameDetail({ title, description, genre, price, releaseDate, developer, publisher, headerImage }: Props) {
    const color = GENRE_COLORS[genre] || "#66c0f4";

    return (
        <div className="animate-fade-in">
            <div className="aspect-[16/5] rounded-sm overflow-hidden mb-6 relative">
                {headerImage ? (
                    <Image
                        src={headerImage}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}44 0%, ${color}11 100%)` }}>
                        <div className="text-center">
                            <p className="text-4xl mb-2">🎮</p>
                            <p className="text-2xl font-bold text-foreground">{title}</p>
                            <p className="text-sm mt-1" style={{ color }}>{genre}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="badge-primary">{genre}</span>
                        {releaseDate && <span className="text-xs text-muted-foreground">{releaseDate}</span>}
                    </div>
                    <p className="text-foreground/80 mt-4 leading-relaxed text-sm">{description}</p>
                    <div className="divider my-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Developer</span>
                            <p className="text-primary">{developer}</p>
                        </div>
                        {publisher && (
                            <div>
                                <span className="text-muted-foreground">Publisher</span>
                                <p className="text-primary">{publisher}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-64 card p-4 shrink-0">
                    {price === 0 ? (
                        <p className="text-xl font-bold text-accent">Free to Play</p>
                    ) : (
                        <p className="text-xl font-bold text-foreground">${price.toFixed(2)}</p>
                    )}
                    <button className="btn-green w-full mt-3 text-sm">Add to Library</button>
                </div>
            </div>
        </div>
    );
}