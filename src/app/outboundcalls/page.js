"use client";
import React, { useState, useEffect } from "react";
import { Phone, PhoneCall, Clock, User, Calendar, Loader2, CheckCircle, XCircle, Globe, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";

// ============================================
// COUNTRY CODES
// ============================================
const COUNTRY_CODES = [
    { code: "+91", country: "India", flag: "🇮🇳", format: "XXXXX XXXXX", digits: 10 },
    { code: "+1", country: "USA/Canada", flag: "🇺🇸", format: "(XXX) XXX-XXXX", digits: 10 },
    { code: "+44", country: "UK", flag: "🇬🇧", format: "XXXX XXXXXX", digits: 10 },
    { code: "+61", country: "Australia", flag: "🇦🇺", format: "XXX XXX XXX", digits: 9 },
    { code: "+971", country: "UAE", flag: "🇦🇪", format: "XX XXX XXXX", digits: 9 },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", format: "XX XXX XXXX", digits: 9 },
    { code: "+65", country: "Singapore", flag: "🇸🇬", format: "XXXX XXXX", digits: 8 },
];

export default function OutboundCallsPage() {
    const [callData, setCallData] = useState({
        countryCode: "+91",
        phoneNumber: "",
        purpose: "",
        date: "",
        time: "",
        patientName: "",
    });
    const [recentCalls, setRecentCalls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const currentCountry = COUNTRY_CODES.find(c => c.code === callData.countryCode) || COUNTRY_CODES[0];

    useEffect(() => {
        fetchScheduledCalls();
    }, []);

    // ============================================
    // FETCH SCHEDULED CALLS
    // ============================================
    const fetchScheduledCalls = async () => {
        try {
            // const response = await api.get("/scheduled-calls/upcoming?limit=10");
            if (response.data.success) {
                setRecentCalls(response.data.calls || []);
            }
        } catch (error) {
            console.error("Error fetching scheduled calls:", error);
        }
    };

    // ============================================
    // FORMAT PHONE NUMBER BASED ON COUNTRY
    // ============================================
    const handlePhoneChange = (value) => {
        const digits = value.replace(/\D/g, "");
        const limitedDigits = digits.substring(0, currentCountry.digits);
        let formatted = "";
        
        if (callData.countryCode === "+1") {
            if (limitedDigits.length > 0) {
                formatted = "(" + limitedDigits.substring(0, 3);
            }
            if (limitedDigits.length > 3) {
                formatted += ") " + limitedDigits.substring(3, 6);
            }
            if (limitedDigits.length > 6) {
                formatted += "-" + limitedDigits.substring(6, 10);
            }
        } else if (callData.countryCode === "+91") {
            if (limitedDigits.length > 0) {
                formatted = limitedDigits.substring(0, 5);
            }
            if (limitedDigits.length > 5) {
                formatted += " " + limitedDigits.substring(5, 10);
            }
        } else if (callData.countryCode === "+44") {
            if (limitedDigits.length > 0) {
                formatted = limitedDigits.substring(0, 4);
            }
            if (limitedDigits.length > 4) {
                formatted += " " + limitedDigits.substring(4, 10);
            }
        } else {
            formatted = limitedDigits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
        }

        setCallData((prev) => ({ ...prev, phoneNumber: formatted }));
    };

    // ============================================
    // HANDLE COUNTRY CODE CHANGE
    // ============================================
    const handleCountryChange = (newCode) => {
        setCallData((prev) => ({
            ...prev,
            countryCode: newCode,
            phoneNumber: "",
        }));
    };

    // ============================================
    // FORMAT PHONE FOR DISPLAY
    // ============================================
    const formatPhoneNumber = (phone) => {
        if (!phone) return "";
        return phone;
    };

    // ============================================
    // MAP PURPOSE TO CALL_REASON ENUM
    // ============================================
    const mapPurposeToCallReason = (purpose) => {
        const mapping = {
            "Appointment Reminder": "appointment_reminder",
            "Follow-up Call": "follow_up",
            "General Inquiry": "general",
            "Results Ready": "results_ready",
            "Reschedule": "reschedule",
            "Wellness Check": "wellness_check",
            "Prescription Refill": "prescription",
        };
        return mapping[purpose] || "general";
    };

    // ============================================
    // SCHEDULE OUTBOUND CALL - API CALL
    // ============================================
    const handleMakeCall = async () => {
        const phoneDigits = callData.phoneNumber.replace(/\D/g, "");
        
        if (!phoneDigits) {
            showNotification("error", "Phone number is required");
            return;
        }
        
        if (phoneDigits.length < currentCountry.digits) {
            showNotification("error", `Please enter a valid ${currentCountry.country} phone number (${currentCountry.digits} digits)`);
            return;
        }
        
        if (!callData.date || !callData.time) {
            showNotification("error", "Please select a date and time");
            return;
        }

        const scheduledDateTime = new Date(`${callData.date}T${callData.time}:00`);
        if (scheduledDateTime <= new Date()) {
            showNotification("error", "Scheduled time must be in the future");
            return;
        }

        setIsLoading(true);

        try {
            const formattedPhone = `${callData.countryCode}${phoneDigits}`;
            const scheduledTime = scheduledDateTime.toISOString();

            const payload = {
                phone_number: formattedPhone,
                scheduled_time: scheduledTime,
                reason: callData.purpose || "Outbound call",
                call_reason: mapPurposeToCallReason(callData.purpose),
                patient_name: callData.patientName || null,
            };

            console.log("📞 Scheduling call:", payload);

            const response = await api.post("/scheduled-calls/schedule", payload);

            if (response.data.success) {
                showNotification("success", `Call scheduled for ${scheduledDateTime.toLocaleString()}`);
                
                setCallData((prev) => ({
                    ...prev,
                    phoneNumber: "",
                    purpose: "",
                    date: "",
                    time: "",
                    patientName: "",
                }));

                fetchScheduledCalls();
            } else {
                showNotification("error", response.data.error || "Failed to schedule call");
            }
        } catch (error) {
            console.error("Error scheduling call:", error);
            const errorMessage = error.response?.data?.error || "Failed to schedule call";
            showNotification("error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================
    // CANCEL SCHEDULED CALL
    // ============================================
    const handleCancelCall = async (callId) => {
        try {
            const response = await api.delete(`/scheduled-calls/${callId}`);
            if (response.data.success) {
                showNotification("success", "Call cancelled");
                fetchScheduledCalls();
            }
        } catch (error) {
            console.error("Error cancelling call:", error);
            showNotification("error", "Failed to cancel call");
        }
    };

    // ============================================
    // SHOW NOTIFICATION
    // ============================================
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    // ============================================
    // GET STATUS BADGE
    // ============================================
    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-orange-50 text-orange-600 border-orange-200",
            completed: "bg-teal-50 text-teal-600 border-teal-200",
            failed: "bg-red-50 text-red-600 border-red-200",
            cancelled: "bg-gray-50 text-gray-500 border-gray-200",
        };
        return styles[status] || "bg-indigo-50 text-indigo-600 border-indigo-200";
    };

    // ============================================
    // GET MINIMUM DATE (today)
    // ============================================
    const getMinDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    return (
        <ProtectedLayout>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                
                .outbound-page {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: #ffffff;
                    min-height: 100vh;
                }
                
                .outbound-page * {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                
                .card-container {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
                }
                
                .input-field {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    transition: all 0.15s ease;
                }
                
                .input-field:hover {
                    border-color: #d1d5db;
                }
                
                .input-field:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                    outline: none;
                }
                
                .input-field::placeholder {
                    color: #9ca3af;
                }
                
                .btn-primary {
                    background: #6366f1;
                    border-radius: 10px;
                    transition: all 0.15s ease;
                }
                
                .btn-primary:hover:not(:disabled) {
                    background: #4f46e5;
                }
                
                .btn-primary:disabled {
                    background: #d1d5db;
                    cursor: not-allowed;
                }
                
                .call-item {
                    transition: all 0.15s ease;
                    border-radius: 12px;
                }
                
                .call-item:hover {
                    background: #f9fafb;
                }
                
                .notification-toast {
                    animation: slideIn 0.25s ease-out;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .icon-badge {
                    background: #eef2ff;
                }
                
                .divider {
                    height: 1px;
                    background: #f3f4f6;
                }
            `}</style>

            <div className="outbound-page p-6 lg:p-8">
                {/* Notification Toast */}
                {notification && (
                    <div className={`notification-toast fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
                        notification.type === "success" 
                            ? "bg-teal-50 text-teal-700 border border-teal-200" 
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                        {notification.type === "success" ? (
                            <CheckCircle className="h-5 w-5 text-teal-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium text-sm">{notification.message}</span>
                    </div>
                )}


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Schedule Form - Takes 3 columns */}
                    <div>
                        <div className="card-container">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="h-4 w-4 text-indigo-500" />
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">New Call</span>
                                </div>

                                <div className="space-y-5">
                                    {/* Phone Number Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-400">*</span>
                                        </label>
                                        <div className="flex gap-3">
                                            <div className="relative">
                                                <select
                                                    value={callData.countryCode}
                                                    onChange={(e) => handleCountryChange(e.target.value)}
                                                    className="input-field h-12 pl-3 pr-8 text-gray-700 appearance-none cursor-pointer font-medium text-sm"
                                                    style={{ minWidth: '120px' }}
                                                >
                                                    {COUNTRY_CODES.map((country) => (
                                                        <option key={country.code} value={country.code}>
                                                            {country.flag} {country.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Globe className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder={currentCountry.format}
                                                value={callData.phoneNumber}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                className="input-field flex-1 h-12 px-4 text-gray-700 font-medium tracking-wide"
                                            />
                                        </div>
                                    </div>

                                    {/* Patient Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Patient Name
                                            <span className="text-gray-400 font-normal ml-2 text-xs">(optional)</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Enter patient's name"
                                                value={callData.patientName}
                                                onChange={(e) => setCallData(prev => ({ ...prev, patientName: e.target.value }))}
                                                className="input-field w-full h-12 pl-10 pr-4 text-gray-700 text-sm"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1.5">
                                            The AI will use this to personalize the greeting
                                        </p>
                                    </div>

                                    {/* Call Purpose */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Call Purpose
                                        </label>
                                        <select
                                            value={callData.purpose}
                                            onChange={(e) => setCallData(prev => ({ ...prev, purpose: e.target.value }))}
                                            className="input-field w-full h-12 px-3 text-gray-700 appearance-none cursor-pointer text-sm"
                                        >
                                            <option value="">Select a purpose...</option>
                                            <option value="Appointment Reminder">📅 Appointment Reminder</option>
                                            <option value="Follow-up Call">🔄 Follow-up Call</option>
                                            <option value="Results Ready">📋 Results Ready</option>
                                            <option value="Reschedule">🗓️ Reschedule Appointment</option>
                                            <option value="Wellness Check">💚 Wellness Check</option>
                                            <option value="Prescription Refill">💊 Prescription Refill</option>
                                            <option value="General Inquiry">💬 General Inquiry</option>
                                        </select>
                                    </div>

                                    <div className="divider my-5" />

                                    {/* Date & Time */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Schedule <span className="text-red-400">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                               
                                                <input
                                                    type="date"
                                                    value={callData.date || ""}
                                                    min={getMinDate()}
                                                    onChange={(e) => setCallData(prev => ({ ...prev, date: e.target.value }))}
                                                    className="input-field w-full h-12 pl-10 pr-3 text-gray-700 cursor-pointer text-sm"
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    value={callData.time || ""}
                                                    onChange={(e) => setCallData(prev => ({ ...prev, time: e.target.value }))}
                                                    className="input-field w-full h-12 pl-10 pr-3 text-gray-700 cursor-pointer text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Card */}
                                    {callData.phoneNumber && (
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Preview</p>
                                            <p className="font-mono text-lg text-gray-800 font-semibold">
                                                {callData.countryCode} {callData.phoneNumber}
                                            </p>
                                            {callData.patientName && (
                                                <p className="text-sm text-gray-500 mt-0.5">Patient: {callData.patientName}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleMakeCall}
                                        disabled={!callData.phoneNumber.trim() || !callData.date || !callData.time || isLoading}
                                        className="btn-primary w-full h-12 text-white font-semibold flex items-center justify-center gap-2 text-sm"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Scheduling...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Schedule Call</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scheduled Calls List - Takes 2 columns */}
                    <div>
                        <div className="card-container h-full">
                            <div className="p-5 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Scheduled</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Upcoming calls</p>
                                    </div>
                                    <button 
                                        onClick={fetchScheduledCalls}
                                        className="p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <RefreshCw className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-3 overflow-y-auto" style={{ maxHeight: '520px' }}>
                                {recentCalls.length === 0 ? (
                                    <div className="text-center py-14">
                                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                            <Phone className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <p className="text-gray-600 font-medium text-sm">No scheduled calls</p>
                                        <p className="text-xs text-gray-400 mt-1">Schedule your first call to get started</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {recentCalls.map((call) => (
                                            <div key={call._id} className="call-item p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                                            <Phone className="h-4 w-4 text-gray-500" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-800 text-sm truncate">
                                                                {formatPhoneNumber(call.phoneNumber)}
                                                            </p>
                                                            {call.metadata?.personalization?.patient_name && (
                                                                <p className="text-xs text-gray-600 truncate">
                                                                    {call.metadata.personalization.patient_name}
                                                                </p>
                                                            )}
                                                            {call.reason && (
                                                                <p className="text-xs text-gray-400 mt-0.5 truncate">{call.reason}</p>
                                                            )}
                                                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(call.scheduledTime).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusBadge(call.status)}`}>
                                                            {call.status}
                                                        </span>
                                                        {call.status === "pending" && (
                                                            <button
                                                                onClick={() => handleCancelCall(call._id)}
                                                                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}