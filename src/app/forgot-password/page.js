import PublicLayout from "../layouts/publicLayout";

export default function ForgotPassword() {
    return (
        <>
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                    {/* Background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    </div>
                    <div className="relative z-10 w-full max-w-md mx-auto p-6">
                        {/* Card */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
                                <p className="text-gray-400">Enter your email to reset your password</p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6">

                                {/* Email Field */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <div className="relative">
                                        <input

                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full bg-white/5 border border-gray-600 rounded-xl pl-4 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                {/* Submit Button */}
                                <button

                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-300"
                                >
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}