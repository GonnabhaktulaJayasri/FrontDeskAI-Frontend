"use client";
import { useState } from "react";
import { Settings, Check, Stethoscope, Brain, Activity, Heart, Scan } from "lucide-react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";

const specialtyData = {
    primaryCare: {
        name: "Primary Care",
        icon: Stethoscope,
        description: "Sick visits, physicals, chronic disease management"
    },
    mentalHealth: {
        name: "Mental Health",
        icon: Brain,
        description: "Therapy, psychiatric evaluations, counseling"
    },
    sportsMedicine: {
        name: "Sports Medicine",
        icon: Activity,
        description: "Sports injuries, concussions, physicals"
    },
    cardiology: {
        name: "Cardiology",
        icon: Heart,
        description: "Heart consultations, EKGs, stress tests"
    },
    radiology: {
        name: "Radiology",
        icon: Scan,
        description: "X-rays, CT scans, MRIs, ultrasounds"
    }
};

export default function DashboardPage() {
    let ws;
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [isConfigured, setIsConfigured] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(false);

    const handleSpecialtyToggle = (key) => {
        if (selectedSpecialties.includes(key)) {
            setSelectedSpecialties(selectedSpecialties.filter(s => s !== key));
        } else {
            setSelectedSpecialties([...selectedSpecialties, key]);
        }
        setIsConfigured(false);
    };

    const configureAgent = async () => {
        if (selectedSpecialties.length === 0) {
            alert("Please select at least one specialty");
            return;
        }
        setIsConfiguring(true);
        try {
            const res = await api.post("/agent/configure", { specialties: selectedSpecialties });
            setSelectedSpecialties([]);
            setIsConfigured(true);
        } catch (error) {
            alert("Configuration failed. Please try again.");
        } finally {
            setIsConfiguring(false);
        }
    };

    return (
        <ProtectedLayout>
            <div className="p-6">
                {/* Main Card */}
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Settings className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800">Agent Configuration</h1>
                                <p className="text-sm text-gray-500">Select specialties for your AI agent</p>
                            </div>
                        </div>
                        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConfigured
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? "bg-green-500" : "bg-gray-400"}`}></span>
                            {isConfigured ? "Configured" : "Not Configured"}
                        </span>
                    </div>

                    {/* Specialties Grid */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(specialtyData).map(([key, specialty]) => {
                                const Icon = specialty.icon;
                                const isSelected = selectedSpecialties.includes(key);

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleSpecialtyToggle(key)}
                                        disabled={isConfiguring}
                                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            } ${isConfiguring ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
                                            <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`font-medium text-sm ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                                                    {specialty.name}
                                                </h3>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? "bg-blue-500" : "border border-gray-300"
                                                    }`}>
                                                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{specialty.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                {selectedSpecialties.length === 0
                                    ? "No specialties selected"
                                    : `${selectedSpecialties.map(s => specialtyData[s]?.name).join(", ")} selected`
                                }
                            </p>

                            {!isConfigured ? (
                                <button
                                    onClick={configureAgent}
                                    disabled={selectedSpecialties.length === 0 || isConfiguring}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSpecialties.length === 0 || isConfiguring
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {isConfiguring ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Configuring...
                                        </>
                                    ) : (
                                        <>
                                            <Settings className="w-4 h-4" />
                                            Configure Agent
                                        </>
                                    )}
                                </button>
                            ) : (
                                <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                    <Check className="w-4 h-4" />
                                    Agent Ready
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}