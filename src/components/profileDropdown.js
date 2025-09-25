"use client";

import { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { removeCookies } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import api from "@/auth/baseInstance";

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsOpen(false);
        try {
            const res = await api.post("/auth/logout");

            if (res.data?.status) {
                removeCookies("token");
                removeCookies("hospital");
                router.push("/");
            } else {
                console.error("Logout failed: unexpected response", res.data);
            }
        } catch (err) {
            console.error("Logout failed:", err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="relative ">
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-gray-200 cursor-pointer rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
                <User className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="flex flex-col gap-4 absolute right-1 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <button
                        className="w-full flex items-center px-4 py-2 mt-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Account
                    </button>
                    <button
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 mb-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
