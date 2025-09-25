"use client";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Phone } from "lucide-react";
import { Routes } from "@/auth/routes";

export default function AppSidebar({ collapsed }) {
  const pathname = usePathname();

  // function for partial match
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <Sidebar
      breakPoint="md"
      collapsed={collapsed}
      backgroundColor="white"
      className="h-screen shadow-lg border-r border-gray-200 flex flex-col"
    >
      {/* Sidebar Header */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Phone className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900">CareConnect</h2>
            <p className="text-xs text-gray-600">Hospital Dashboard</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <Menu className="flex-1 py-2 m-1">
        {Routes.map((route) => (
          <MenuItem
            key={route.text}
            icon={route.icon}
            title={collapsed ? route.text : undefined}
            component={<Link href={route.href} />}
            active={isActive(route.href)}
            className={`flex items-center space-x-3 rounded-lg py-1 text-sm font-medium transition-colors ${isActive(route.href)
              ? "bg-blue-200 text-blue-800/70 shadow"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-700"
              }`}
          >
            {!collapsed && route.text}

          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
}
