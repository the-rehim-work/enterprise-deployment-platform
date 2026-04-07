import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = { title: "STEAM Platform", description: "Steam-style gaming platform" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <GlobalErrorHandler />
                <PerformanceMonitor />
                <ThemeProvider>
                    <AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
                <SpeedInsights />
            </body>
        </html>
    );
}