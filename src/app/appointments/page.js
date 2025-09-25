"use client";
import React, { useState, useEffect } from "react";
import ProtectedLayout from "../layouts/protectedLayout";
import { Filter, Search } from "lucide-react";
import api from "@/auth/baseInstance";

export default function AppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await api.get("/appointments");
            if (res.data.success) {
                setAppointments(res.data.appointments.map(a => ({
                    id: a.appointmentId,
                    patientName: a.patient.name,
                    patientPhone: a.patient.phone,
                    doctorName: a.doctor.name,
                    appointmentDate: a.dateTime,
                    status: a.status,
                    appointmentType: a.reason,
                    durationMinutes: a.durationMinutes || 30,
                    notes: a.notes || "",
                })));
            } else {
                console.error(res.data.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch =
            !searchTerm ||
            appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patientPhone.includes(searchTerm) ||
            appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

        const now = new Date();
        const appointmentDate = new Date(appointment.appointmentDate);

        let matchesDate = true;
        if (dateFilter === "today") {
            matchesDate = appointmentDate.toDateString() === now.toDateString();
        } else if (dateFilter === "upcoming") {
            matchesDate = appointmentDate > now;
        } else if (dateFilter === "past") {
            matchesDate = appointmentDate < now;
        }

        const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;

        return matchesSearch && matchesDate && matchesStatus;
    });

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
    };

    return (
        <ProtectedLayout>
            <div className="p-6 space-y-6">
                {/* Filters Card */}
                <div className="border rounded shadow-sm bg-white">
                    <div className="flex items-center space-x-2 p-4 border-b">
                        <Filter className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold text-gray-700">Filters</span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search patients, doctors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-3 py-2 border rounded text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                            >
                                <option value="all">All Statuses</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="no_show">No Show</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                {loading ? (
                    <div className="border rounded p-6 text-center text-gray-500">Loading...</div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="border rounded p-6 text-center text-gray-500">
                        No appointments found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => {
                            const { date, time } = formatDateTime(appointment.appointmentDate);
                            return (
                                <div
                                    key={appointment.id}
                                    className="border rounded p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {appointment.patientName}
                                        </h3>
                                        <span className="px-2 py-1 rounded bg-gray-200 text-sm text-gray-700">
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-2 text-sm text-gray-600">
                                        <div>Phone: {appointment.patientPhone}</div>
                                        <div>Doctor: {appointment.doctorName}</div>
                                        <div>Date: {date}</div>
                                        <div>Time: {time}</div>
                                    </div>
                                    <div className="flex gap-4 mt-2 text-sm">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-500">
                                            {appointment.appointmentType}
                                        </span>
                                        <span className="text-gray-500">
                                            {appointment.durationMinutes} minutes
                                        </span>
                                    </div>
                                    {appointment.notes && (
                                        <p className="text-gray-500 text-sm mt-2 bg-gray-100 p-2 rounded">
                                            {appointment.notes}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );
}
