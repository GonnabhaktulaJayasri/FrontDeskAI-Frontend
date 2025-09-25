"use client";
import { useState } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";

export default function DemoPage() {
    let ws;
    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [transcript, setTranscript] = useState([]);
    const [callSid, setCallSid] = useState(null);
    
    // New state for phone number input
    const [phoneNumber, setPhoneNumber] = useState("+917989338432");
    const [reason, setReason] = useState("Test results available");
    const [callType, setCallType] = useState("test_results");
    const [isLoading, setIsLoading] = useState(false);

    const startRealtimeSession = async () => {
        try {
            console.log("Starting realtime session...");
            console.log("API Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

            // Validate phone number
            if (!phoneNumber.trim()) {
                alert("Please enter a phone number");
                return;
            }

            setIsLoading(true);
            setIsConnected(false);
            setCallSid(null);
            setTranscript([]);

            // Make API call with phone number - let backend handle patient lookup
            const res = await api.post("/calls/outbound", {
                phoneNumber: phoneNumber.trim(),
                reason: reason.trim() || "Test results available",
                callType: callType
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

            // Open WebSocket to backend to receive live transcripts
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
            console.error("Full error object:", err);
            setIsConnected(false);

            // Show user-friendly error message
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

    const startRecording = () => setIsRecording(true);
    const stopRecording = () => setIsRecording(false);

    return (
        <ProtectedLayout>
            <div className="p-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-4">
                    <Phone className="mr-2 h-5 w-5 text-gray-700" />
                    <h1 className="text-2xl font-bold text-gray-700">Outbound Call Demo</h1>
                    <span
                        className={`ml-2 text-sm px-2 py-1 rounded ${isConnected ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                            }`}
                    >
                        {isConnected ? "Connected" : "Disconnected"}
                    </span>
                </div>

                {/* Call Configuration Form */}
                {!isConnected && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Call Configuration</h3>
                        
                        <div className="space-y-4">
                            {/* Phone Number Input */}
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

                            {/* Call Reason */}
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Call Reason
                                </label>
                                <input
                                    id="reason"
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Test results available"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Call Type */}
                            <div>
                                <label htmlFor="callType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Call Type
                                </label>
                                <select
                                    id="callType"
                                    value={callType}
                                    onChange={(e) => setCallType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                                    disabled={isLoading}
                                >
                                    <option value="test_results">Test Results</option>
                                    <option value="appointment_reminder">Appointment Reminder</option>
                                    <option value="follow_up">Follow Up</option>
                                    <option value="prescription_reminder">Prescription Reminder</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Connection Controls */}
                <div className="flex gap-2 mb-4">
                    {!isConnected ? (
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
                            {isLoading ? "Starting Call..." : "Start Call"}
                        </button>
                    ) : (
                        <button
                            onClick={endRealtimeSession}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            <PhoneOff className="mr-2 h-4 w-4" />
                            End Call
                        </button>
                    )}

                    {/* Recording Controls */}
                    {isConnected && (
                        <button
                            onClick={() => setIsRecording(!isRecording)}
                            className={`flex items-center px-3 py-2 rounded text-white ${isRecording
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 hover:bg-gray-500"
                                }`}
                        >
                            {isRecording ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
                            {isRecording ? "Mic On" : "Mic Off"}
                        </button>
                    )}
                </div>

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
                            Reason: <code className="bg-white px-1 py-0.5 rounded">{reason}</code>
                        </p>
                    </div>
                )}

                {/* Transcript */}
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3 mb-4">
                    <h4 className="font-semibold mb-2 text-gray-700">Conversation</h4>
                    {transcript.length === 0 ? (
                        <p className="text-gray-500 text-sm">No conversation yet...</p>
                    ) : (
                        <div className="space-y-2">
                            {transcript.map((entry, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${entry.speaker === "User"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        {entry.speaker}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm">{entry.text}</p>
                                        <p className="text-xs text-gray-400">
                                            {entry.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedLayout>
    );
}