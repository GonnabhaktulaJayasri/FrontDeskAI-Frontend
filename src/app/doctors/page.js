"use client";

import React, { useState, useEffect } from "react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";
import { Plus, X, Clock, Mail, Phone, Calendar, Check, AlertCircle, Users, Edit3, Trash2, Loader2 } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEPARTMENTS = ["Primary care", "Mental Health", "Sports Medicine", "Cardiology", "Radiology"];
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const TimePicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("hour");
  const [hour, setHour] = useState(value?.hour || "09");
  const [minute, setMinute] = useState(value?.minute || "00");
  const [period, setPeriod] = useState(value?.period || "AM");

  const handleConfirm = () => { onChange({ hour, minute, period }); setShowPicker(false); };
  const displayTime = value ? `${value.hour}:${value.minute} ${value.period}` : "--:-- --";

  return (
    <div className="relative">
      <button type="button" onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-blue-400 hover:shadow-sm transition-all min-w-36">
        <Clock className="w-4 h-4 text-blue-500" />
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

const initialFormState = { name: "", specialization: "", phone: "", email: "", isActive: false, schedule: {} };

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [commonStartTime, setCommonStartTime] = useState({ hour: "09", minute: "00", period: "AM" });
  const [commonEndTime, setCommonEndTime] = useState({ hour: "05", minute: "00", period: "PM" });

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    setFetchingDoctors(true);
    try {
      const response = await api.get("/staff/doctors");
      if (response.data.success) setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      showNotification("error", error.response?.data?.error || "Failed to fetch doctors");
    } finally { setFetchingDoctors(false); }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openAddModal = () => { setFormData(initialFormState); setEditingDoctor(null); setErrors({}); setSelectedDays([]); setCommonStartTime({ hour: "09", minute: "00", period: "AM" }); setCommonEndTime({ hour: "05", minute: "00", period: "PM" }); setShowAddModal(true); };
  const openEditModal = (doctor) => {
    setFormData({ name: doctor.name, specialization: doctor.specialization, phone: doctor.phone, email: doctor.email, isActive: doctor.isActive, schedule: JSON.parse(JSON.stringify(doctor.schedule || {})) });
    setEditingDoctor(doctor); setErrors({}); setSelectedDays(Object.keys(doctor.schedule || {}));
    const existingDays = Object.keys(doctor.schedule || {});
    if (existingDays.length > 0) {
      const firstDay = doctor.schedule[existingDays[0]];
      if (firstDay?.start) setCommonStartTime(firstDay.start);
      if (firstDay?.end) setCommonEndTime(firstDay.end);
    }
  };
  const closeModal = () => { setShowAddModal(false); setEditingDoctor(null); setFormData(initialFormState); setErrors({}); setSelectedDays([]); };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (selectedDays.length === 0) newErrors.schedule = "At least one day must be selected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const schedule = {};
    selectedDays.forEach(day => { schedule[day] = { start: { ...commonStartTime }, end: { ...commonEndTime } }; });
    const submitData = { ...formData, schedule };
    setLoading(true);
    try {
      if (editingDoctor) {
        const response = await api.put(`/staff/doctors/${editingDoctor.id}`, submitData);
        if (response.data.success) { setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? response.data.doctor : d))); showNotification("success", "Doctor updated successfully"); }
      } else {
        const response = await api.post("/staff/doctors", submitData);
        if (response.data.success) { setDoctors([...doctors, response.data.doctor]); showNotification("success", "Doctor added successfully"); }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving doctor:", error);
      showNotification("error", error.response?.data?.error || "Failed to save doctor");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this doctor?")) {
      setLoading(true);
      try {
        const response = await api.delete(`/staff/doctors/${id}`);
        if (response.data.success) { setDoctors(doctors.filter((doc) => doc.id !== id)); showNotification("success", "Doctor removed successfully"); }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        showNotification("error", error.response?.data?.error || "Failed to delete doctor");
      } finally { setLoading(false); }
    }
  };

  const toggleDay = (day) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  const selectAllDays = () => setSelectedDays([...DAYS]);
  const selectWeekdays = () => setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const selectWeekends = () => setSelectedDays(["Saturday", "Sunday"]);
  const clearDays = () => setSelectedDays([]);

  const formatTime = (time) => (time ? `${time.hour}:${time.minute} ${time.period}` : "N/A");
  const formatSchedule = (schedule) => {
    if (!schedule || typeof schedule !== "object") return "Not set";
    const days = Object.keys(schedule);
    if (days.length === 0) return "Not set";
    return days.map(d => d.slice(0, 3)).join(", ");
  };
  const formatScheduleTime = (schedule) => {
    if (!schedule || typeof schedule !== "object") return "";
    const days = Object.keys(schedule);
    if (days.length === 0) return "";
    const first = schedule[days[0]];
    return `${formatTime(first?.start)} - ${formatTime(first?.end)}`;
  };

  const getStatusBadge = (isActive) => isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";

  const isModalOpen = showAddModal || editingDoctor;

  return (
    <ProtectedLayout>
      <div className="p-6">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${notification.type === "success" ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {notification.type === "success" ? <Check className="h-5 w-5 text-teal-500" /> : <X className="h-5 w-5 text-red-500" />}
            <span className="font-medium text-sm">{notification.message}</span>
          </div>
        )}

        {/* Add Button */}
        <div className="flex justify-end mb-4">
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {fetchingDoctors ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500">Loading doctors...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">S.No</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Schedule</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium mb-1">No doctors found</p>
                        <p className="text-gray-400 text-sm mb-4">Get started by adding your first doctor</p>
                        <button onClick={openAddModal} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                          <Plus className="w-4 h-4" /> Add Doctor
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor, index) => (
                    <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Dr. {doctor.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {doctor.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">{doctor.specialization}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {doctor.phone || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-sm text-gray-800">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            {formatSchedule(doctor.schedule)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {formatScheduleTime(doctor.schedule)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(doctor.isActive)}`}>
                          {doctor.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => openEditModal(doctor)} className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors flex items-center gap-1">
                            <Edit3 className="w-4 h-4" /> Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => handleDelete(doctor.id)} disabled={loading} className="text-red-500 hover:text-red-600 text-sm font-medium hover:underline transition-colors disabled:opacity-50 flex items-center gap-1">
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Doctor Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 shadow-2xl border border-gray-200">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl text-gray-800 font-bold">{editingDoctor ? "Edit Doctor" : "Add Doctor"}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {/* Doctor's Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor's Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`} placeholder="Enter doctor's name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                  <select value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.specialization ? "border-red-500" : "border-gray-300"} ${!formData.specialization ? "text-gray-400" : ""}`}>
                    <option value="" className="text-gray-400">Select Department</option>
                    {DEPARTMENTS.map((dept) => <option key={dept} value={dept} className="text-gray-900">{dept}</option>)}
                  </select>
                  {errors.specialization && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.specialization}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="+1234567890" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="doctor@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                </div>

                {/* Select Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Days <span className="text-red-500">*</span></label>
                  {errors.schedule && <p className="text-red-500 text-xs mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.schedule}</p>}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button type="button" onClick={selectAllDays} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">All Days</button>
                    <button type="button" onClick={selectWeekdays} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">Weekdays</button>
                    <button type="button" onClick={selectWeekends} className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">Weekends</button>
                    <button type="button" onClick={clearDays} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {DAYS.map((day) => (
                      <button key={day} type="button" onClick={() => toggleDay(day)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${selectedDays.includes(day) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {selectedDays.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-3">Set timing for: <span className="font-medium text-blue-600">{selectedDays.map(d => d.slice(0, 3)).join(", ")}</span></p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                          <TimePicker value={commonStartTime} onChange={setCommonStartTime} />
                        </div>
                        <span className="text-gray-400 mt-5">to</span>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">End Time</label>
                          <TimePicker value={commonEndTime} onChange={setCommonEndTime} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded text-blue-600 w-4 h-4" />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Doctor is currently active</label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" disabled={loading}>Cancel</button>
                <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : editingDoctor ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}