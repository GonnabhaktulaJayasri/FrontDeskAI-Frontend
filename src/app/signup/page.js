"use client";
import Link from "next/link";
import { Phone, Mail, Lock, Building, Eye, EyeOff, Check, PhoneCall, Stethoscope, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PublicLayout from "../layouts/publicLayout";
import api from "@/auth/baseInstance";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const router = useRouter();
    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [hospitalAddress, setHospitalAddress] = useState("");
    const [speciality, setSpeciality] = useState("");
    // const [hospitalWebsite, setHospitalWebsite] = useState("");
    // const [weekdayHours, setWeekdayHours] = useState("");
    // const [weekendHours, setWeekendHours] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Speciality options
    const specialities = [
        "Primary Care",
        "Mental Health",
        "Cardiology",
        "Sports Medicine",
        // "Neurology",
        "Radiology",
        // "Orthopedics",
        // "Pediatrics",
        // "Gynecology",
        // "Dermatology",
        // "Oncology",
        // "Psychiatry",
        // "Ophthalmology",
        // "ENT",
        // "Gastroenterology",
        // "Nephrology",
        // "Endocrinology",
        // "Pulmonology",
        // "Urology",
        // "Anesthesiology",
        // "Emergency Medicine",
        // "Multi-Specialty"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await api.post("/auth/signup", {
                name,
                email,
                phonenumber,
                password,
                hospitalAddress,
                // hospitalWebsite,
                // weekdayHours,
                // weekendHours,
            });

            const data = res.data;
            setSuccess(data.message || "Signup successful!");
            setName("");
            setEmail("");
            setPhonenumber("");
            setPassword("");
            setHospitalAddress("");
            setSpeciality("");
            setAgreedToTerms(false);

            router.push("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden py-12">
                    {/* Background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10 w-full max-w-2xl mx-auto p-6">
                        {/* Card */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Get Started for Free</h2>
                                <p className="text-gray-400">Get your AI receptionist up in just 5 minutes</p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Hospital Name Field */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Hospital Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter hospital name"
                                            className="w-full bg-white/5 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

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

                                {/* Hospital Address */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Hospital Address</label>
                                    <input
                                        type="text"
                                        placeholder="123 Medical Center Drive"
                                        className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                        value={hospitalAddress}
                                        onChange={(e) => setHospitalAddress(e.target.value)}
                                    />
                                </div>
                                {/* Speciality Select Menu */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Speciality</label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                        <select
                                            value={speciality}
                                            onChange={(e) => setSpeciality(e.target.value)}
                                            className={`w-full bg-white/5 border border-gray-600 rounded-xl pl-12 pr-10 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${speciality === "" ? "text-gray-400" : "text-white"
                                                }`}
                                        >
                                            <option value="" disabled>
                                                Select a speciality
                                            </option>
                                            {specialities.map((spec) => (
                                                <option key={spec} value={spec}>
                                                    {spec}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                {/* Hospital Website */}
                                {/* <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Hospital Website</label>
                                    <input
                                        type="url"
                                        placeholder="https://www.example.com"
                                        className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                        value={hospitalWebsite}
                                        onChange={(e) => setHospitalWebsite(e.target.value)}
                                    />
                                </div> */}

                                {/* Hospital Hours */}
                                {/* <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Weekday Hours</label>
                                        <input
                                            type="text"
                                            placeholder="8:00 AM - 8:00 PM"
                                            className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                            value={weekdayHours}
                                            onChange={(e) => setWeekdayHours(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Weekend Hours</label>
                                        <input
                                            type="text"
                                            placeholder="9:00 AM - 5:00 PM"
                                            className="w-full bg-white/5 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                            value={weekendHours}
                                            onChange={(e) => setWeekendHours(e.target.value)}
                                        />
                                    </div>
                                </div> */}

                                {/* Phone Number */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <PhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            className="w-full bg-white/5 border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                            value={phonenumber}
                                            onChange={(e) => setPhonenumber(e.target.value)}
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
                                            placeholder="Create a strong password"
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
                                    <p className="text-xs text-gray-400 mt-2">Must be at least 8 characters with letters and numbers</p>
                                </div>

                                {/* Terms Agreement */}
                                <div className="flex items-start space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setAgreedToTerms(!agreedToTerms)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${agreedToTerms
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-600 hover:border-gray-500'
                                            }`}
                                    >
                                        {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </div>

                                {/* Error/Success messages */}
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                {/* {success && <p className="text-green-400 text-sm">{success}</p>} */}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!agreedToTerms || loading}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${agreedToTerms
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 transform shadow-lg'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? "Building AI agent..." : "Build AI agent"}
                                </button>
                            </form>

                            {/* Divider */}
                            {/* <div className="my-8 flex items-center">
                                <div className="flex-1 border-t border-gray-600"></div>
                                <span className="px-4 text-gray-400 text-sm">or</span>
                                <div className="flex-1 border-t border-gray-600"></div>
                            </div> */}

                            {/* Login Link */}
                            {/* <div className="text-center">
                                <p className="text-gray-400">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold">
                                        Sign in here
                                    </Link>
                                </p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
