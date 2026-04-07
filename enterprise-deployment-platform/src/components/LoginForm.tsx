"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import FormField from "./FormField";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { refresh } = useAuth();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await loginAction({ username, password });
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
                <p className="text-muted-foreground text-sm">Sign in to your account</p>
            </div>
            <div className="card p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-error-muted text-error text-sm px-3 py-2 rounded-sm">{error}</div>}
                    <FormField label="Username" value={username} onChange={setUsername} required />
                    <FormField label="Password" type="password" value={password} onChange={setPassword} required />
                    <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Signing in..." : "Sign In"}</button>
                </form>
                <div className="divider my-5" />
                <p className="text-sm text-muted-foreground text-center">
                    New here? <Link href="/register" className="text-primary hover:underline">Create an account</Link>
                </p>
            </div>
        </div>
    );
}