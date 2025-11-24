"use client";
import { useState } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";

// Specialty data for preview
const specialtyData = {
    primaryCare: {
        name: "Primary Care",
        firstMessage: "Hello! Thank you for calling Orion West Medical Group Primary Care. How may I help you today?",
        description: "Handles sick visits, physicals, chronic disease management, immunizations, and referrals."
    },
    mentalHealth: {
        name: "Mental Health",
        firstMessage: "Hello, thank you for calling Orion West Medical Group Mental Health Services. I'm here to help you. How may I assist you today?",
        description: "Handles therapy, psychiatric evaluations, counseling, and behavioral health with trauma-informed care."
    },
    sportsMedicine: {
        name: "Sports Medicine",
        firstMessage: "Hey there! Thanks for calling Orion West Medical Group Sports Medicine. How can I help you get back in the game today?",
        description: "Handles sports injuries, concussions, sports physicals, and return-to-play evaluations."
    },
    cardiology: {
        name: "Cardiology",
        firstMessage: "Hello, thank you for calling the Cardiology Department at Orion West Medical Group. I'm here to assist you with scheduling. How may I help you today?",
        description: "Handles heart consultations, EKGs, stress tests, echocardiograms, and cardiac clearances."
    },
    radiology: {
        name: "Radiology",
        firstMessage: "Hello, thank you for calling the Radiology Department at Orion West Medical Group. I'm here to help you schedule your imaging appointment. How may I assist you today?",
        description: "Handles X-rays, CT scans, MRIs, ultrasounds, mammograms, and other imaging services."
    }
};

export default function DemoPage() {
    let ws;
    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [transcript, setTranscript] = useState([]);
    const [callSid, setCallSid] = useState(null);

    // Phone number and call config
    const [phoneNumber, setPhoneNumber] = useState("");
    const [reason, setReason] = useState("Test results available");
    const [callType, setCallType] = useState("test_results");
    const [isLoading, setIsLoading] = useState(false);

    // Configuration flow state
    const [specialty, setSpecialty] = useState("");
    const [isConfigured, setIsConfigured] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(false);

    const handleSpecialtyChange = (e) => {
        setSpecialty(e.target.value);
        setIsConfigured(false);
    };

    const configureAgent = async () => {
        if (!specialty) {
            alert("Please select a specialty");
            return;
        }

        setIsConfiguring(true);

        try {
            // Simulate API call for configuration (replace with actual API call)
            // const res = await api.post("/api/agent/configure", { specialty });
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsConfigured(true);
        } catch (error) {
            alert("Configuration failed. Please try again.");
        } finally {
            setIsConfiguring(false);
        }
    };

    const startRealtimeSession = async () => {
        try {
            console.log("Starting realtime session...");
            console.log("API Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

            if (!phoneNumber.trim()) {
                alert("Please enter a phone number");
                return;
            }

            setIsLoading(true);
            setIsConnected(false);
            setCallSid(null);
            setTranscript([]);

            const res = await api.post("/calls/outbound", {
                phoneNumber: phoneNumber.trim(),
                reason: reason.trim() || "Test results available",
                callType: callType,
                specialty: specialty
            });
            const data = res.data;

            console.log("Outbound call response:", data);

            if (!data.success) {
                throw new Error(data.error || "Call failed");
            }

            if (!data.call || !data.call.sid) {
                throw new Error("No call SID received from server");
            }

            setCallSid(data.call.sid);
            setIsConnected(true);
            setSessionId(Math.random().toString(36).substring(2, 8));

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            if (!baseUrl) {
                console.error("NEXT_PUBLIC_BASE_URL is not defined!");
                throw new Error("WebSocket base URL not configured");
            }

            const wsUrl = baseUrl.replace(/^http/, "ws") + `/api/calls/stream?callSid=${data.call.sid}`;
            console.log("Connecting to WebSocket:", wsUrl);

            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connected successfully");
            };

            ws.onmessage = (event) => {
                console.log("WebSocket message received:", event.data);
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === "transcript") {
                        setTranscript(prev => [...prev, {
                            speaker: message.speaker,
                            text: message.text,
                            timestamp: new Date(message.timestamp),
                        }]);
                    }
                } catch (parseError) {
                    console.error("Error parsing WebSocket message:", parseError);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            ws.onclose = (event) => {
                console.log("WebSocket closed:", event.code, event.reason);
                setIsConnected(false);
            };

        } catch (err) {
            console.error("Error starting call:", err);
            setIsConnected(false);
            alert(`Failed to start call: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const endRealtimeSession = async () => {
        if (callSid) {
            await api.post("/calls/end", { callSid });
        }
        if (ws) ws.close();
        setIsConnected(false);
        setIsRecording(false);
        setSessionId(null);
        setTranscript([]);
    };

    return (
        <ProtectedLayout>
            <div className="p-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-4">
                    <Phone className="mr-2 h-5 w-5 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-700">Agent Configuration Panel</h1>
                </div>

                {/* Configuration Form */}
                {!isConnected && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <div className="space-y-4">
                            {/* Specialty Select */}
                            <div>
                                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Specialty Department
                                </label>
                                <select
                                    id="specialty"
                                    value={specialty}
                                    onChange={handleSpecialtyChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 bg-white"
                                    disabled={isConfiguring || isLoading}
                                >
                                    <option value="">-- Choose a Specialty --</option>
                                    <option value="primaryCare">Primary Care</option>
                                    <option value="mentalHealth">Mental Health</option>
                                    <option value="sportsMedicine">Sports Medicine</option>
                                    <option value="cardiology">Cardiology</option>
                                    <option value="radiology">Radiology</option>
                                </select>
                            </div>

                            {/* Preview Section */}
                            {specialty && specialtyData[specialty] && (
                                <div className="p-3 bg-white border rounded-md">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        📞 Agent First Message:
                                    </h4>
                                    <p className="text-sm text-gray-600 italic border-l-4 border-blue-500 pl-3">
                                        {specialtyData[specialty].firstMessage}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {specialtyData[specialty].description}
                                    </p>
                                </div>
                            )}

                            {/* Configure Agent Button */}
                            {!isConfigured && (
                                <button
                                    onClick={configureAgent}
                                    disabled={!specialty || isConfiguring}
                                    className={`flex items-center px-3 py-2 rounded text-white ${
                                        !specialty || isConfiguring
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {isConfiguring ? "Configuring..." : "Configure Agent"}
                                </button>
                            )}

                            {/* Phone Number Section - Shows after configuration */}
                            {isConfigured && (
                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="+1234567890"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                                            disabled={isLoading}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Enter phone number with country code (e.g., +1234567890)
                                        </p>
                                    </div>

                                    {/* Talk with AI Button */}
                                    <button
                                        onClick={startRealtimeSession}
                                        disabled={isLoading || !phoneNumber.trim()}
                                        className={`flex items-center px-3 py-2 rounded text-white ${
                                            isLoading || !phoneNumber.trim()
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >
                                        <Phone className="mr-2 h-4 w-4" />
                                        {isLoading ? "Talking with AI..." : "Talk with AI"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Active Call Controls */}
                {isConnected && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={endRealtimeSession}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            <PhoneOff className="mr-2 h-4 w-4" />
                            End Call
                        </button>

                        <button
                            onClick={() => setIsRecording(!isRecording)}
                            className={`flex items-center px-3 py-2 rounded text-white ${
                                isRecording
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-400 hover:bg-gray-500"
                            }`}
                        >
                            {isRecording ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
                            {isRecording ? "Mic On" : "Mic Off"}
                        </button>
                    </div>
                )}

                {/* Session Info */}
                {sessionId && (
                    <div className="p-3 mb-4 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">
                            Session ID: <code className="bg-white px-1 py-0.5 rounded">{sessionId}</code>
                        </p>
                        <p className="text-sm text-gray-600">
                            Phone: <code className="bg-white px-1 py-0.5 rounded">{phoneNumber}</code>
                        </p>
                        <p className="text-sm text-gray-600">
                            Specialty: <code className="bg-white px-1 py-0.5 rounded">{specialtyData[specialty]?.name}</code>
                        </p>
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );
}