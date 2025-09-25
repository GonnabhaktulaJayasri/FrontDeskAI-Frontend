"use client";

import Link from "next/link";
import {
  Phone,
  PhoneCall,
  Zap,
  Play,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import PublicLayout from "./layouts/publicLayout";
import FAQCTASection from "@/components/FAQCTASection";

export default function Landing() {
  return (
    <PublicLayout>
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
        {/* Background animated gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-24">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-white/20 rounded-full text-blue-200 text-sm mb-8 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Always-On Virtual Front Desk
            </div>

            <h1 className="text-6xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              CareConnect
              <br />
              <span className="text-4xl md:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                The Future of Patient Experience
              </span>
            </h1>


            <p className="text-md md:text-lg text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Transform hospital front desks with AI that answers, routes, and manages calls—
              delivering instant, intelligent support while freeing staff for real care.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
              <Link
                href="/signup"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105"
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>

              <button className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors duration-300 backdrop-blur-md">
                  <Play className="w-5 h-5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { value: "99.8%", label: "Call Success Rate" },
                { value: "<15s", label: "Avg. Response Time" },
                { value: "24/7", label: "Always Available" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-xl md:text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-24">
            {[
              {
                icon: <Phone className="w-6 h-6 text-white" />,
                title: "Smart Inbound Calls",
                desc: "AI instantly answers patient calls with natural conversation, appointment scheduling, and intelligent routing.",
                gradient: "from-blue-500 to-blue-700",
              },
              {
                icon: <PhoneCall className="w-6 h-6 text-white" />,
                title: "Proactive Outreach",
                desc: "Automated reminders, follow-up calls, and patient check-ins reduce no-shows and improve care continuity.",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: <Zap className="w-6 h-6 text-white" />,
                title: "Enterprise Scale",
                desc: "Handle thousands of calls with advanced routing, real-time analytics, and seamless EHR integrations.",
                gradient: "from-emerald-500 to-teal-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-md`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                <div className="mt-6 flex items-center text-blue-300 text-sm font-semibold">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>

          <FAQCTASection />
        </div>
      </section>
    </PublicLayout>
  );
}
