"use client";

import Link from "next/link";
import { Plus, Minus, Sparkles } from "lucide-react";
import { useState } from "react";

export default function FAQCTASection() {
    const [open, setOpen] = useState(null);

    const faqs = [
        {
            q: "How does the free trial work?",
            a: "Enjoy full access to all Premium features for 30 days—no credit card required.",
        },
        {
            q: "Is my patient data secure?",
            a: "Yes. We’re HIPAA compliant, SOC 2 Type II certified, and use end-to-end encryption.",
        },
        {
            q: "Can I cancel anytime?",
            a: "Of course. There are no long-term contracts—cancel with one click anytime.",
        },
        {
            q: "Do you offer custom integrations?",
            a: "Yes, our Enterprise plans include tailored EHR integrations and priority support.",
        },
    ];

    return (
        <>
            {/* FAQ Section */}
            <div className="mt-24 max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <div
                            key={i}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:shadow-lg transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="flex justify-between items-center w-full text-left"
                            >
                                <h4 className="text-white font-semibold text-lg">{item.q}</h4>
                                {open === i ? (
                                    <Minus className="w-5 h-5 text-purple-400" />
                                ) : (
                                    <Plus className="w-5 h-5 text-blue-400" />
                                )}
                            </button>
                            {open === i && (
                                <p className="mt-3 text-gray-300 text-sm leading-relaxed">{item.a}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
                <div className="relative backdrop-blur-xl rounded-3xl border border-white/20 p-12 max-w-4xl mx-auto shadow-2xl">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to Elevate Patient Communication?
                    </h3>
                    <p className="text-gray-300 text-md mb-8">
                        Join leading hospitals already using{" "}
                        <span className="text-blue-300 font-semibold">MediDesk AI</span> to
                        simplify patient calls and boost satisfaction.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/signup"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl text-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/contact"
                            className="border border-white/30 text-white px-6 py-3 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-colors duration-300"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
