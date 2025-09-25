"use client";
import { useState } from "react";
import Header from "@/components/Header";
import AppSidebar from "@/components/Sidebar";

export default function ProtectedLayout({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen">
            <AppSidebar collapsed={sidebarCollapsed} />
            <div className="flex flex-col flex-1">
                <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <main className="flex-1 overflow-auto bg-white">{children}</main>
            </div>
        </div>
    );
}