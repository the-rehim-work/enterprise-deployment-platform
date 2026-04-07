type Props = {
    label: string;
    value: string | number;
    icon: string;
};

export default function StatsCard({ label, value, icon }: Props) {
    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className="text-lg">{icon}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
    );
}