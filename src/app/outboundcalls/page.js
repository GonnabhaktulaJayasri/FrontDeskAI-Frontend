"use client";
import React from "react";
import { useState } from "react";
import { Phone, PhoneCall, Clock, User, Calendar } from "lucide-react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";

export default function OutboundCallsPage() {
    const [callData, setCallData] = useState({ to: "", purpose: "" });
    const [recentCalls, setRecentCalls] = useState([]);

    let ws = null;
    const handlePhoneChange = (value) => {
        const cleaned = value.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length >= 6) {
            formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        } else if (cleaned.length >= 3) {
            formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        }
        setCallData(prev => ({ ...prev, to: formatted }));
    };


    const handleMakeCall = async () => {
        if (!callData.to.trim()) return;

        const formattedNumber = "+1" + callData.to.replace(/\D/g, "");

        try {
            // 🔍 Step 1: Lookup patient by phone
            const lookupRes = await api.get(`/patients/lookup/${formattedNumber}`);
            let patientId = null;

            if (lookupRes.data?.found) {
                patientId = lookupRes.data.patient._id;
                console.log("Patient found:", lookupRes.data.patient.name, patientId);
            } else {
                console.log("No patient record found for this number");
            }

            // 📞 Step 2: Start outbound call with both id + phone
            await startRealtimeSession({
                patientId, // may be null if not found
                phoneNumber: formatPhoneNumber(callData.to),
                reason: callData.purpose || "General inquiry",
                callType: "outbound",
            });

            // ✅ Step 3: Update local UI recent calls
            const newCall = {
                id: Date.now(),
                to: callData.to,
                purpose: callData.purpose,
                status: "Pending",
                startedAt: new Date().toISOString(),
            };
            setRecentCalls([newCall, ...recentCalls.slice(0, 9)]);
            setCallData({ to: "", purpose: "" });
        } catch (err) {
            console.error("Error making outbound call:", err);
            alert("Failed to start call: " + err.message);
        }
    };


    /**
     * Start outbound call + realtime stream
     */
    const startRealtimeSession = async ({ patientId, phoneNumber, reason, callType }) => {
        try {
            console.log("Starting realtime session...");
            console.log("API Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

            setIsConnected(false);
            setCallSid(null);
            setTranscript([]);

            // Step 1: Start outbound call
            const res = await api.post("/calls/outbound", {
                patientId,
                phoneNumber,
                reason,
                callType,
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

            // Step 2: Open WebSocket to backend
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not defined!");

            const wsUrl = baseUrl.replace(/^http/, "ws") + `/api/calls/stream?callSid=${data.call.sid}`;
            console.log("Connecting to WebSocket:", wsUrl);

            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connected successfully");
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === "transcript") {
                        setTranscript((prev) => [
                            ...prev,
                            {
                                speaker: message.speaker,
                                text: message.text,
                                timestamp: new Date(message.timestamp),
                            },
                        ]);
                    } else {
                        console.log("WS message:", message);
                    }
                } catch (err) {
                    console.error("Error parsing WS message:", err);
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
            alert(`Failed to start call: ${err.message}`);
            setIsConnected(false);
        }
    };



    // Utility to format Indian numbers to E.164
    const formatPhoneNumber = (raw) => {
        const cleaned = raw.replace(/\D/g, ""); // remove non-digits
        if (cleaned.startsWith("91")) {
            return `+${cleaned}`; // already has country code
        }
        return `+91${cleaned}`; // prepend India code
    };

    return (
        <>
            <ProtectedLayout>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Make Call Form */}
                        <div className="border rounded shadow-sm bg-white">
                            <div className="flex items-center space-x-2 p-4 border-b">
                                <PhoneCall className="h-5 w-5 text-gray-600" />
                                <span className="font-semibold text-gray-800">Make Outbound Call</span>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="(555) 123-4567"
                                        value={callData.to}
                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                        maxLength={14}
                                        className="w-full border rounded text-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Call Purpose</label>
                                    <select
                                        value={callData.purpose}
                                        onChange={(e) => setCallData(prev => ({ ...prev, purpose: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 bg-white"
                                    >
                                        <option value="">Select a purpose...</option>
                                        <option value="Appointment Reminder">Appointment Reminder</option>
                                        <option value="Follow-up Call">Follow-up Call</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleMakeCall}
                                    disabled={!callData.to.trim()}
                                    className="w-full bg-gray-600 text-white px-4 py-2 rounded flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
                                >
                                    <Phone className="h-4 w-4" />
                                    <span>Schedule Call</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Outbound Calls */}
                        <div className="border rounded shadow-sm bg-white">
                            <div className="flex items-center space-x-2 p-4 border-b">
                                <Clock className="h-5 w-5 text-gray-600" />
                                <span className="font-semibold text-gray-800">Recent Outbound Calls</span>
                            </div>
                            <div className="p-4">
                                {recentCalls.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No recent calls</p>
                                        <p className="text-sm text-gray-400">Your outbound calls will appear here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentCalls.map((call) => (
                                            <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Phone className="h-4 w-4 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{formatPhoneNumber(call.to)}</p>
                                                        {call.purpose && <p className="text-sm text-gray-600">{call.purpose}</p>}
                                                        <p className="text-xs text-gray-500">{new Date(call.startedAt).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-blue-600 font-medium">{call.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    {/* <div className="border rounded shadow-sm bg-white">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
                            <p className="text-sm text-gray-600">Common outbound call scenarios</p>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setCallData(prev => ({ ...prev, purpose: 'Appointment reminder' }))}
                                className="border rounded p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 transition"
                            >
                                <Calendar className="h-6 w-6 text-gray-600" />
                                <span className="text-gray-800 text-sm">Appointment Reminder</span>
                            </button>
                            <button
                                onClick={() => setCallData(prev => ({ ...prev, purpose: 'Follow-up call' }))}
                                className="border rounded p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 transition"
                            >
                                <User className="h-6 w-6 text-gray-600" />
                                <span className="text-gray-800 text-sm">Follow-up Call</span>
                            </button>
                            <button
                                onClick={() => setCallData(prev => ({ ...prev, purpose: 'General inquiry' }))}
                                className="border rounded p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 transition"
                            >
                                <Phone className="h-6 w-6 text-gray-600" />
                                <span className="text-gray-800 text-sm">General Inquiry</span>
                            </button>
                        </div>
                    </div> */}
                </div>
            </ProtectedLayout>
        </>

    );
}
