type Props = {
    title: string;
    description: string;
    icon: string | null;
    points: number;
    unlocked?: boolean;
};

export default function AchievementCard({ title, description, icon, points, unlocked }: Props) {
    return (
        <div className={`flex items-center gap-4 p-3 rounded-sm border transition-colors ${unlocked ? "bg-accent-muted border-accent/30" : "bg-card border-border"
            }`}>
            <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xl ${unlocked ? "bg-accent/20" : "bg-muted grayscale opacity-50"
                }`}>
                {icon || "🏆"}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>{title}</h4>
                <p className="text-xs text-muted-foreground truncate">{description}</p>
            </div>
            <span className={`text-xs font-medium ${unlocked ? "text-accent" : "text-muted-foreground"}`}>{points} pts</span>
        </div>
    );
}