type Props = {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
};

export default function FormField({ label, type = "text", value, onChange, required }: Props) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="input"
            />
        </div>
    );
}