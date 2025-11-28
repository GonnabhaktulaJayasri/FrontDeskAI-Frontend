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
            <h2 className="text-xl font-semibold text-gray-900">Frontdesk AI</h2>
            <p className="text-xs text-gray-600">Hospital Dashboard</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <Menu
        className="flex-1 py-2 m-1"
        menuItemStyles={{
          button: ({ active }) => ({
            backgroundColor: active ? '#DBEAFE' : 'transparent',
            color: active ? '#1E40AF' : '#4B5563',
            borderRadius: '8px',
            margin: '2px 8px',
            '&:hover': {
              backgroundColor: active ? '#DBEAFE' : '#EFF6FF',
              color: '#1E40AF',
            },
          }),
        }}
      >
        {Routes.map((route) => (
          <MenuItem
            key={route.text}
            icon={route.icon}
            title={collapsed ? route.text : undefined}
            component={<Link href={route.href} />}
            active={isActive(route.href)}
          >
            {!collapsed && route.text}
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
}