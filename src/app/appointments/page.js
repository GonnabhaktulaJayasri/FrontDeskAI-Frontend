"use client";

import React, { useState, useEffect } from "react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";

// ============ API FUNCTIONS ============
/*
// Fetch all appointments
const fetchAppointmentsAPI = async () => {
  const response = await api.get("/appointments");
  if (response.data.success) {
    return response.data.appointments || [];
  }
  return [];
};

// Add a new appointment
const addAppointmentAPI = async (appointmentData) => {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
};

// Reschedule an appointment
const rescheduleAppointmentAPI = async (id, newDateTime) => {
  const response = await api.put(`/appointments/${id}/reschedule`, newDateTime);
  return response.data;
};

// Cancel an appointment
const cancelAppointmentAPI = async (id) => {
  const response = await api.put(`/appointments/${id}/cancel`);
  return response.data;
};
*/

// Simulated API functions for demo (remove when using real API)
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));
const fetchAppointmentsAPI = async () => { await simulateDelay(); return []; };
const addAppointmentAPI = async (data) => { await simulateDelay(); return { success: true, appointment: { ...data, id: Date.now().toString(), status: "scheduled" } }; };
const rescheduleAppointmentAPI = async (id, data) => { await simulateDelay(); return { success: true }; };
const cancelAppointmentAPI = async (id) => { await simulateDelay(); return { success: true }; };

// ============ TIME PICKER COMPONENT ============
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const TimePicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("hour");
  const [hour, setHour] = useState(value?.hour || "09");
  const [minute, setMinute] = useState(value?.minute || "00");
  const [period, setPeriod] = useState(value?.period || "AM");

  const handleConfirm = () => {
    onChange({ hour, minute, period });
    setShowPicker(false);
  };

  const displayTime = value ? `${value.hour}:${value.minute} ${value.period}` : "--:-- --";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-blue-400 transition-all w-full"
      >
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={value ? "text-gray-800 font-medium" : "text-gray-400"}>{displayTime}</span>
      </button>

      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 w-72">
            <div className="flex items-center justify-center gap-1 mb-4 pb-3 border-b">
              <button onClick={() => setActiveTab("hour")} className={`text-3xl font-bold px-2 py-1 rounded-lg transition-colors ${activeTab === "hour" ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"}`}>{hour}</button>
              <span className="text-3xl font-bold text-gray-300">:</span>
              <button onClick={() => setActiveTab("minute")} className={`text-3xl font-bold px-2 py-1 rounded-lg transition-colors ${activeTab === "minute" ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"}`}>{minute}</button>
              <div className="flex flex-col gap-1 ml-3">
                <button onClick={() => setPeriod("AM")} className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${period === "AM" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>AM</button>
                <button onClick={() => setPeriod("PM")} className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${period === "PM" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>PM</button>
              </div>
            </div>

            <div className="flex mb-2">
              <button onClick={() => setActiveTab("hour")} className={`flex-1 text-xs font-medium py-1 ${activeTab === "hour" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}>HOUR</button>
              <button onClick={() => setActiveTab("minute")} className={`flex-1 text-xs font-medium py-1 ${activeTab === "minute" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}>MINUTE</button>
            </div>

            {activeTab === "hour" && (
              <div className="grid grid-cols-4 gap-1 mb-4">
                {HOURS.map((h) => (
                  <button key={h} onClick={() => { setHour(h); setActiveTab("minute"); }} className={`p-2 text-sm rounded-lg transition-all ${hour === h ? "bg-blue-500 text-white font-semibold" : "bg-gray-50 text-gray-700 hover:bg-blue-100"}`}>{h}</button>
                ))}
              </div>
            )}

            {activeTab === "minute" && (
              <div className="grid grid-cols-6 gap-1 mb-4 max-h-48 overflow-y-auto">
                {MINUTES.map((m) => (
                  <button key={m} onClick={() => setMinute(m)} className={`p-2 text-sm rounded-lg transition-all ${minute === m ? "bg-blue-500 text-white font-semibold" : "bg-gray-50 text-gray-700 hover:bg-blue-100"}`}>{m}</button>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => setShowPicker(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleConfirm} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-sm">Confirm</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============ SAMPLE DOCTORS LIST ============
const DOCTORS = [
  "Dr. John Doe",
  "Dr. Jane Smith",
  "Dr. Michael Johnson",
  "Dr. Sarah Williams",
  "Dr. Robert Brown",
];

const initialFormState = {
  patientName: "",
  phoneNumber: "",
  doctorName: "",
  date: "",
  time: null,
  reason: "",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([
    { id: "1", patientName: "Alice Johnson", phoneNumber: "+1234567890", doctorName: "Dr. John Doe", date: "2025-01-15", time: { hour: "10", minute: "00", period: "AM" }, reason: "Regular checkup", status: "scheduled" },
    { id: "2", patientName: "Bob Smith", phoneNumber: "+0987654321", doctorName: "Dr. Jane Smith", date: "2025-01-16", time: { hour: "02", minute: "30", period: "PM" }, reason: "Follow-up visit", status: "scheduled" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: null, reason: "" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ============ FETCH APPOINTMENTS ============
  const fetchAppointments = async () => {
    try {
      // const response = await api.get("/appointments");
      // if (response.data.success) {
      //   setAppointments(response.data.appointments || []);
      // }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      showNotification("error", "Failed to fetch appointments");
    }
  };

  // ============ SHOW NOTIFICATION ============
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ============ VALIDATE FORM ============
  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.doctorName) newErrors.doctorName = "Doctor is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ ADD APPOINTMENT ============
  const handleAddAppointment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await addAppointmentAPI(formData);
      // Uncomment when using real API:
      // const response = await api.post("/appointments", formData);
      // if (response.data.success) {
      //   setAppointments([...appointments, response.data.appointment]);
      //   showNotification("success", "Appointment added successfully");
      // }

      if (response.success) {
        setAppointments([...appointments, response.appointment]);
        showNotification("success", "Appointment added successfully");
        closeAddModal();
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
      const errorMessage = error.response?.data?.error || "Failed to add appointment";
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============ RESCHEDULE APPOINTMENT ============
  const handleReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      showNotification("error", "Please select date and time");
      return;
    }

    setLoading(true);
    try {
      const response = await rescheduleAppointmentAPI(selectedAppointment.id, rescheduleData);
      if (response.success) {
        setAppointments(appointments.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, date: rescheduleData.date, time: rescheduleData.time }
            : apt
        ));
        showNotification("success", "Appointment rescheduled successfully");
        closeRescheduleModal();
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      const errorMessage = error.response?.data?.error || "Failed to reschedule appointment";
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============ CANCEL APPOINTMENT ============
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      showNotification("error", "Please provide a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      const response = await cancelAppointmentAPI(selectedAppointment.id);
      if (response.success) {
        setAppointments(appointments.map(apt => 
          apt.id === selectedAppointment.id ? { ...apt, status: "cancelled" } : apt
        ));
        showNotification("success", "Appointment cancelled successfully");
        closeCancelModal();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      const errorMessage = error.response?.data?.error || "Failed to cancel appointment";
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============ OPEN CANCEL MODAL ============
  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason("");
    setShowCancelModal(true);
  };

  // ============ CLOSE CANCEL MODAL ============
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
    setCancelReason("");
  };

  // ============ MODAL HANDLERS ============
  const openAddModal = () => {
    setFormData(initialFormState);
    setErrors({});
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData(initialFormState);
    setErrors({});
  };

  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({ date: appointment.date, time: appointment.time, reason: "" });
    setShowRescheduleModal(true);
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setRescheduleData({ date: "", time: null, reason: "" });
  };

  // ============ FORMAT TIME ============
  const formatTime = (time) => {
    if (!time) return "N/A";
    return `${time.hour}:${time.minute} ${time.period}`;
  };

  // ============ GET STATUS BADGE ============
  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700",
      confirmed: "bg-green-100 text-green-700",
      completed: "bg-teal-100 text-teal-700",
      cancelled: "bg-red-100 text-red-700",
      no_show: "bg-gray-100 text-gray-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  // ============ GET MIN DATE ============
  const getMinDate = () => new Date().toISOString().split("T")[0];

  return (
    <ProtectedLayout>
      <div className="p-6">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
            notification.type === "success" 
              ? "bg-teal-50 text-teal-700 border border-teal-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {notification.type === "success" ? (
              <svg className="h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium text-sm">{notification.message}</span>
          </div>
        )}

        {/* Add Button - Top Right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Appointment</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">S.No</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Patient Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Doctor's Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium mb-1">No appointments found</p>
                      <p className="text-gray-400 text-sm mb-4">Get started by adding your first appointment</p>
                      <button onClick={openAddModal} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        + Add Appointment
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((appointment, index) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-800">{appointment.patientName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{appointment.doctorName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-800">{appointment.date}</span>
                        <span className="text-xs text-gray-500">{formatTime(appointment.time)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {appointment.status !== "cancelled" && appointment.status !== "completed" ? (
                          <>
                            <button
                              onClick={() => openRescheduleModal(appointment)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
                            >
                              Reschedule
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => openCancelModal(appointment)}
                              className="text-red-500 hover:text-red-600 text-sm font-medium hover:underline transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Appointment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 shadow-2xl border border-gray-200">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-800">Add Appointment</h2>
                <button onClick={closeAddModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>

              <div className="p-6 space-y-4">
                {/* Patient Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.patientName ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter patient name"
                  />
                  {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                    placeholder="+1234567890"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>

                {/* Doctor's Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor's Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.doctorName ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select Doctor</option>
                    {DOCTORS.map((doctor) => (
                      <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                  {errors.doctorName && <p className="text-red-500 text-xs mt-1">{errors.doctorName}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    min={getMinDate()}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={formData.time}
                    onChange={(time) => setFormData({ ...formData, time })}
                  />
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Enter reason for appointment..."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button onClick={closeAddModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" disabled={loading}>
                  Cancel
                </button>
                <button onClick={handleAddAppointment} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
                  {loading ? "Adding..." : "Add Appointment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedAppointment && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-2xl border border-gray-200">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Reschedule Appointment</h2>
                <button onClick={closeRescheduleModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">Patient: <span className="font-medium text-gray-800">{selectedAppointment.patientName}</span></p>
                  <p className="text-sm text-gray-600">Doctor: <span className="font-medium text-gray-800">{selectedAppointment.doctorName}</span></p>
                </div>

                {/* New Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    min={getMinDate()}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* New Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    value={rescheduleData.time}
                    onChange={(time) => setRescheduleData({ ...rescheduleData, time })}
                  />
                </div>

                {/* Reason for Reschedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reschedule</label>
                  <textarea
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Enter reason for rescheduling..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button onClick={closeRescheduleModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" disabled={loading}>
                  Cancel
                </button>
                <button onClick={handleReschedule} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
                  {loading ? "Rescheduling..." : "Reschedule"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Appointment Modal */}
        {showCancelModal && selectedAppointment && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-2xl border border-gray-200">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Cancel Appointment</h2>
                <button onClick={closeCancelModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700 font-medium mb-1">Are you sure you want to cancel this appointment?</p>
                  <p className="text-sm text-red-600">Patient: {selectedAppointment.patientName}</p>
                  <p className="text-sm text-red-600">Doctor: {selectedAppointment.doctorName}</p>
                  <p className="text-sm text-red-600">Date: {selectedAppointment.date} at {formatTime(selectedAppointment.time)}</p>
                </div>

                {/* Reason for Cancellation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation <span className="text-red-500">*</span></label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={3}
                    placeholder="Please provide a reason for cancellation..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button onClick={closeCancelModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" disabled={loading}>
                  Go Back
                </button>
                <button onClick={handleCancel} disabled={loading || !cancelReason.trim()} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50">
                  {loading ? "Cancelling..." : "Cancel Appointment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}