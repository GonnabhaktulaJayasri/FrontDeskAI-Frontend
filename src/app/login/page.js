"use client";
import Link from "next/link";
import { Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PublicLayout from "../layouts/publicLayout";
import { setCookies } from "@/utils/cookies";
import api from "@/auth/baseInstance";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
                email, password
            });

            const data = res.data;
            setSuccess("Login successful!");

            setCookies('token', data.token);
            setCookies('hospital', JSON.stringify(data.hospital));

            router.push("/dashboard");
        } catch (err) {
            const apiMessage = err.response?.data?.message;
            setError(apiMessage || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-xl mx-auto p-6">
                        {/* Card */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                                <p className="text-gray-400">Sign in to view all your call logs</p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full bg-white/5 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="w-full bg-white/5 border border-gray-600 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white/5 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                                        <span className="ml-2 text-sm text-gray-300">Remember me</span>
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Error/Success messages */}
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                {/* {success && <p className="text-green-400 text-sm">{success}</p>} */}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 transform shadow-lg"
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-8 flex items-center">
                                <div className="flex-1 border-t border-gray-600"></div>
                                <span className="px-4 text-gray-400 text-sm">or</span>
                                <div className="flex-1 border-t border-gray-600"></div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center">
                                <p className="text-gray-400">
                                    Don't have an account?{" "}
                                    <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold">
                                        Register now
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
