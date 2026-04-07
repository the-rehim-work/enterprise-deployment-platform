"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/games", label: "Store", icon: "🎮" },
  { href: "/achievements", label: "Achievements", icon: "🏆" },
  { href: "/leaderboard", label: "Leaderboard", icon: "📈" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="w-56 bg-surface flex flex-col h-screen sticky top-0 border-r border-border">
      <Link href="/dashboard" className="p-4 border-b border-border block">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#66c0f4] to-[#1a44c2] flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-xl font-black tracking-widest text-foreground">STEAM</span>
        </div>
      </Link>
      <nav className="flex-1 py-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${pathname === l.href
                ? "bg-primary/10 text-primary border-r-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
          >
            <span className="text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}
        {user?.role === "admin" && (
          <Link
            href="/monitoring"
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${pathname === "/monitoring"
                ? "bg-primary/10 text-primary border-r-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
          >
            <span className="text-base">🔍</span>
            Monitoring
          </Link>
        )}
      </nav>
      {user && (
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {(user.displayName || user.username).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{user.displayName || user.username}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-error transition-colors">
              Sign out
            </button>
            <button onClick={toggle} className="text-muted-foreground hover:text-foreground transition-colors text-sm" title={theme === "dark" ? "Light mode" : "Dark mode"}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}