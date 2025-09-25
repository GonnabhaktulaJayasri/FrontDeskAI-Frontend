"use client";
import React, { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Loader from "./Loader";
import AppSidebar from "./Sidebar";

const noLayoutRoutes = ["/signup", "/", "/login", "/pricing"];

export default function AppLayout({ children }) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading on route change
    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => setIsLoading(false), 200);
        return () => clearTimeout(timeout);
    }, [pathname]);

    // Render minimal layout for noLayoutRoutes
    if (noLayoutRoutes.includes(pathname)) {
        return (
            <div className="flex flex-1 overflow-hidden bg-white">
                <main className="flex-1 overflow-hidden p-4">{children}</main>
            </div>
        );
    }

    // Render full dashboard layout
    return isLoading ? (
        <Loader />
    ) : (
        <div className="flex h-screen">
            <Suspense fallback={<Loader />}>
                <AppSidebar collapsed={sidebarCollapsed} />
                <div className="flex flex-col flex-1">
                    <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
                    <main className="flex-1 overflow-auto bg-white p-6">
                        {children}
                    </main>
                </div>
            </Suspense>
        </div>
    );
}
