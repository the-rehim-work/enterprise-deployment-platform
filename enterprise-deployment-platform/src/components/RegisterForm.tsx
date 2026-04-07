"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import FormField from "./FormField";

export default function RegisterForm() {
    const [form, setForm] = useState({ username: "", email: "", password: "", displayName: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { refresh } = useAuth();
    const router = useRouter();

    function update(field: string, value: string) {
        setForm((p) => ({ ...p, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await registerAction(form);
            if (result.error) { setError(result.error); return; }
            await refresh();
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm">
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded bg-gradient-to-br from-[#66c0f4] to-[#1a44c2] flex items-center justify-center">
                        <span className="text-white font-black text-base">S</span>
                    </div>
                    <span className="text-2xl font-black tracking-widest text-foreground">STEAM</span>
                </div>
                <p className="text-muted-foreground text-sm">Create your account</p>
            </div>
            <div className="card p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-error-muted text-error text-sm px-3 py-2 rounded-sm">{error}</div>}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Username" value={form.username} onChange={(v) => update("username", v)} required />
                        <FormField label="Display Name" value={form.displayName} onChange={(v) => update("displayName", v)} />
                    </div>
                    <FormField label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
                    <FormField label="Password" type="password" value={form.password} onChange={(v) => update("password", v)} required />
                    <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Creating..." : "Create Account"}</button>
                </form>
                <div className="divider my-5" />
                <p className="text-sm text-muted-foreground text-center">
                    Have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}