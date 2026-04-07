"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    displayName: string | null;
    avatar: string | null;
    bio: string | null;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                setUser(await res.json());
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);