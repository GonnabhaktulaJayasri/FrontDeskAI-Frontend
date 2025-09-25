import Link from "next/link";
import { Phone, PhoneCall, Zap, Check, Star, ArrowRight } from "lucide-react";
import PublicLayout from "../layouts/publicLayout";

export default function Pricing() {
    return (
        <>
            <PublicLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden pt-24 pb-20">
                    {/* Background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                                Choose Your Plan
                            </h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Start free and scale as your hospital grows. No hidden fees, no long-term contracts.
                            </p>
                        </div>

                        {/* Pricing Grid */}
                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Free Plan */}
                            <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-white/30 transition-all duration-300 p-8 flex flex-col">
                                    <div className="text-center mb-8">
                                        {/* <div className="w-11 h-11 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Phone className="w-7 h-7 text-white" />
                                        </div> */}
                                        <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
                                        <div className="text-4xl font-bold text-white mb-1">$0</div>
                                        <p className="text-gray-400">per month</p>
                                    </div>

                                    <div className="flex-grow">
                                        <ul className="space-y-4 mb-8">
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>1 inbound call handling</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>1 outbound call per day</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Basic usage analytics</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Email support</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>HIPAA compliance</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <button
                                        className="w-full bg-gray-600 text-gray-300 py-3 rounded-xl font-semibold cursor-not-allowed"
                                        disabled
                                    >
                                        Current Plan
                                    </button>
                                </div>
                            </div>

                            {/* Premium Plan - Popular */}
                            <div className="group relative lg:scale-105">
                                {/* Popular Badge */}
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                                        <Star className="w-4 h-4 mr-2" />
                                        Most Popular
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                <div className="relative h-full bg-white/15 backdrop-blur-xl rounded-3xl border-2 border-blue-400/50 hover:border-blue-400/70 transition-all duration-300 p-8 flex flex-col">
                                    <div className="text-center mb-8">
                                        {/* <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <PhoneCall className="w-8 h-8 text-white" />
                                        </div> */}
                                        <h3 className="text-2xl font-bold text-white mb-2">Premium Plan</h3>
                                        <div className="text-4xl font-bold text-white mb-1">$299</div>
                                        <p className="text-gray-400">per month</p>
                                    </div>

                                    <div className="flex-grow">
                                        <ul className="space-y-4 mb-8">
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Unlimited concurrent calls</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Unlimited outbound calls</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Advanced analytics & reporting</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Priority 24/7 support</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>EMR system integration</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Custom call workflows</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>White-label options</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 transform shadow-lg group">
                                        <span className="flex items-center justify-center">
                                            Upgrade Now
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                <div className="relative h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-white/30 transition-all duration-300 p-8 flex flex-col">
                                    <div className="text-center mb-8">
                                        {/* <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Zap className="w-8 h-8 text-white" />
                                        </div> */}
                                        <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                                        <div className="text-4xl font-bold text-white mb-1">Custom</div>
                                        <p className="text-gray-400">pricing</p>
                                    </div>

                                    <div className="flex-grow">
                                        <ul className="space-y-4 mb-8">
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Everything in Premium</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Multi-location support</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Dedicated account manager</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>Custom AI training</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>On-premise deployment</span>
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                                <span>99.99% SLA guarantee</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 hover:scale-105 transform shadow-lg">
                                        Contact Sales
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </PublicLayout>
        </>
    );
}