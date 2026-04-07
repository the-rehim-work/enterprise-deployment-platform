type Entry = {
    username: string;
    displayName: string | null;
    avatar: string | null;
    score: number;
};

export default function LeaderboardTable({ entries }: { entries: Entry[] }) {
    return (
        <div className="card overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-muted-foreground border-b border-border bg-surface">
                        <th className="px-4 py-3 w-16">Rank</th>
                        <th className="px-4 py-3">Player</th>
                        <th className="px-4 py-3 text-right">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((e, i) => (
                        <tr key={e.username} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">
                                {i < 3 ? (
                                    <span className={`text-base ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-amber-600"}`}>
                                        {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">{i + 1}</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-sm bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                        {(e.displayName || e.username).charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-foreground">{e.displayName || e.username}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right text-primary font-medium">{e.score.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}