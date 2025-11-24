"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Frontdesk AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8"> */}
            {/* Products Dropdown */}
            {/* <div className="relative">
              <button
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                className="flex items-center text-gray-300 hover:text-white font-medium transition-colors"
              >
                Products */}
                {/* <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                    isProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button> */}

              {/* {isProductsOpen && (
                <div
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                  className="absolute top-full left-0 mt-3 w-60 rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl"
                >
                  <div className="p-2">
                    {[
                      {
                        href: "/inbound",
                        title: "Inbound Calls",
                        desc: "AI-powered call handling",
                      },
                      {
                        href: "/outbound",
                        title: "Outbound Calls",
                        desc: "Automated patient outreach",
                      },
                      {
                        href: "/enterprise",
                        title: "Enterprise",
                        desc: "Scale across your network",
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block p-3 rounded-xl hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="text-white font-medium">
                          {item.title}
                        </div>
                        <div className="text-gray-400 text-sm">{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              About
            </Link>
          </nav> */}

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg font-large"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          {/* <button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button> */}
        </div>
      </div>

      {/* Mobile Menu */}
      {/* {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 space-y-4">
          <Link href="/inbound" className="block text-gray-300 hover:text-white">
            Inbound Calls
          </Link>
          <Link href="/outbound" className="block text-gray-300 hover:text-white">
            Outbound Calls
          </Link>
          <Link
            href="/enterprise"
            className="block text-gray-300 hover:text-white"
          >
            Enterprise
          </Link>
          <Link href="/pricing" className="block text-gray-300 hover:text-white">
            Pricing
          </Link>
          <Link href="/docs" className="block text-gray-300 hover:text-white">
            Documentation
          </Link>
          <Link href="/about" className="block text-gray-300 hover:text-white">
            About
          </Link>
          <div className="flex flex-col space-y-2 pt-4 border-t border-slate-700">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )} */}
    </header>
  );
}
