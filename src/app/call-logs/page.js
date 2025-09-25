"use client";
import React, { useState, useEffect } from "react";
import ProtectedLayout from "../layouts/protectedLayout";
import axios from "axios";
import api from "@/auth/baseInstance";

export default function CallLogsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [directionFilter, setDirectionFilter] = useState("all");
    const [callLogs, setCallLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCallLogs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/call-logs");
            if (res.data.success) {
                setCallLogs(res.data.callLogs);
            } else {
                console.error(res.data.message);
            }
        } catch (error) {
            console.error("Error fetching call logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCallLogs();
    }, []);

    const filteredCalls = callLogs.filter((call) => {
        const matchesSearch =
            !searchTerm ||
            call.from.includes(searchTerm) ||
            call.to.includes(searchTerm);

        const matchesDirection =
            directionFilter === "all" || call.type === directionFilter;

        const matchesStatus =
            statusFilter === "all" || call.status === statusFilter;

        return matchesSearch && matchesDirection && matchesStatus;
    });

    const formatDuration = (seconds) => {
        if (!seconds) return "N/A";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "forwarded":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <ProtectedLayout>
            <div className="p-6 space-y-6">
                {/* Filters */}
                <div className="bg-white p-4 rounded shadow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search phone numbers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-500 rounded px-3 py-2 w-full placeholder-gray-500"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border rounded px-3 py-2 w-full text-gray-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="failed">Failed</option>
                            <option value="forwarded">Forwarded</option>
                        </select>
                        <select
                            value={directionFilter}
                            onChange={(e) => setDirectionFilter(e.target.value)}
                            className="border rounded px-3 py-2 w-full text-gray-500"
                        >
                            <option value="all">All Directions</option>
                            <option value="inbound">Inbound</option>
                            <option value="outbound">Outbound</option>
                        </select>
                        <button className="border rounded px-3 py-2 w-full text-gray-600 hover:bg-gray-100">
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Call Logs */}
                {loading ? (
                    <div className="text-center text-gray-500 p-6">Loading call logs...</div>
                ) : filteredCalls.length === 0 ? (
                    <div className="bg-white p-6 rounded shadow text-center">
                        <p className="text-gray-500">No call logs found.</p>
                    </div>
                ) : (
                    filteredCalls.map((call) => {
                        const { date, time } = formatDateTime(call.startTime);

                        console.log(call.transcript,'call.transcript');
                        
                        return (
                            <div
                                key={call.id}
                                className="bg-white p-4 rounded shadow hover:shadow-md transition mb-4"
                            >
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex space-x-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${call.type === "inbound"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-blue-100 text-blue-800"
                                                    }`}
                                            >
                                                {call.type}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">From: </span>
                                                <span className="font-medium text-gray-500">{call.from}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">To: </span>
                                                <span className="font-medium text-gray-500">{call.to}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Duration: </span>
                                                <span className="font-medium text-gray-500">
                                                    {formatDuration(call.duration)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">{date} at {time}</span>
                                            </div>
                                        </div>

                                        {call.forwardedTo && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Forwarded to: </span>
                                                <span className="font-medium text-gray-500">{call.forwardedTo}</span>
                                            </div>
                                        )}

                                        {call.actionsTaken?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {call.actionsTaken.map((action, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                        {action}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {call.transcript && (
                                        <button
                                            onClick={() => alert(call.transcript)}
                                            className="border rounded px-3 py-1 mt-2 md:mt-0 hover:bg-gray-100 text-gray-500"
                                        >
                                            View Transcript
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </ProtectedLayout>
    );
}
