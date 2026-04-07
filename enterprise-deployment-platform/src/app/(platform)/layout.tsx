import Sidebar from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <ErrorBoundary>
                <main className="flex-1 p-6 min-w-0">{children}</main>
            </ErrorBoundary>
        </div>
    );
}