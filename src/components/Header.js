"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, User, MenuIcon } from "lucide-react";
import ProfileDropdown from "./profileDropdown";

export default function Header({ onToggleSidebar }) {
    const [notifications, setNotifications] = useState(3);
    const pathname = usePathname();

    const formatTitle = (path) => {
        if (path === "/dashboard") return "Dashboard";
        const lastSegment = path.split("/").filter(Boolean).pop();
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
                {/* Left side: collapse icon + title */}
                <div className="flex items-center space-x-4">
                    {/* Collapse Button */}
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>

                    {/* Title + Subtitle */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {formatTitle(pathname)}
                        </h1>
                        {/* <p className="text-gray-600">Welcome back</p> */}
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search patients, appointments..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <Bell className="w-6 h-6" />
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Profile */}
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
}
