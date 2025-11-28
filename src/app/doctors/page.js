"use client";

import React, { useState, useEffect } from "react";
import ProtectedLayout from "../layouts/protectedLayout";
import api from "@/auth/baseInstance";

// ============ API FUNCTIONS ============
/*
// Fetch all doctors
const fetchDoctorsAPI = async () => {
  const response = await api.get("/doctors");
  if (response.data.success) {
    return response.data.doctors || [];
  }
  return [];
};

// Add a new doctor
const addDoctorAPI = async (doctorData) => {
  const response = await api.post("/doctors", doctorData);
  return response.data;
};

// Update a doctor
const updateDoctorAPI = async (id, doctorData) => {
  const response = await api.put(`/doctors/${id}`, doctorData);
  return response.data;
};

// Delete a doctor
const deleteDoctorAPI = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};
*/

// Simulated API functions for demo (remove these when using real API)
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));
const fetchDoctorsAPI = async () => { await simulateDelay(); return []; };
const addDoctorAPI = async (data) => { await simulateDelay(); return { success: true, doctor: { ...data, id: Date.now().toString() } }; };
const updateDoctorAPI = async (id, data) => { await simulateDelay(); return { success: true, doctor: { ...data, id } }; };
const deleteDoctorAPI = async (id) => { await simulateDelay(); return { success: true }; };

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEPARTMENTS = ["Primary care", "Mental Health", "Sports Medicine", "Cardiology", "Radiology"];
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

// Time Picker Component
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
        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-blue-400 hover:shadow-sm transition-all min-w-36"
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

const initialFormState = { name: "", specialization: "", phone: "", email: "", isActive: true, schedule: {} };

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([
    { id: "1", name: "John Doe", specialization: "Cardiology", email: "john@example.com", phone: "+1234567890", isActive: true,
      schedule: { Monday: { start: { hour: "09", minute: "00", period: "AM" }, end: { hour: "05", minute: "00", period: "PM" } }, Tuesday: { start: { hour: "10", minute: "00", period: "AM" }, end: { hour: "04", minute: "00", period: "PM" } } } },
    { id: "2", name: "Jane Smith", specialization: "Neurology", email: "jane@example.com", phone: "+0987654321", isActive: false, schedule: {} },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  
  // Multi-day selection state
  const [selectedDays, setSelectedDays] = useState([]);
  const [commonStartTime, setCommonStartTime] = useState({ hour: "09", minute: "00", period: "AM" });
  const [commonEndTime, setCommonEndTime] = useState({ hour: "05", minute: "00", period: "PM" });

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // ============ FETCH DOCTORS ============
  const fetchDoctors = async () => {
    try {
      // const response = await api.get("/doctors");
      // if (response.data.success) {
      //   setDoctors(response.data.doctors || []);
      // }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      showNotification("error", "Failed to fetch doctors");
    }
  };

  // ============ SHOW NOTIFICATION ============
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const openAddModal = () => { setFormData(initialFormState); setEditingDoctor(null); setErrors({}); setSelectedDays([]); setShowAddModal(true); };
  const openEditModal = (doctor) => {
    setFormData({ name: doctor.name, specialization: doctor.specialization, phone: doctor.phone, email: doctor.email, isActive: doctor.isActive, schedule: JSON.parse(JSON.stringify(doctor.schedule)) });
    setEditingDoctor(doctor); setErrors({}); setSelectedDays(Object.keys(doctor.schedule));
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
    
    // Build schedule from selected days
    const schedule = {};
    selectedDays.forEach(day => {
      schedule[day] = { start: { ...commonStartTime }, end: { ...commonEndTime } };
    });
    
    const submitData = { ...formData, schedule };
    
    setLoading(true);
    try {
      if (editingDoctor) {
        // ============ UPDATE DOCTOR ============
        const response = await updateDoctorAPI(editingDoctor.id, submitData);
        // Uncomment below when using real API:
        // const response = await api.put(`/doctors/${editingDoctor.id}`, submitData);
        // if (response.data.success) {
        //   setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? response.data.doctor : d)));
        //   showNotification("success", "Doctor updated successfully");
        // }
        
        // Demo code - remove when using real API
        if (response.success) {
          setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? response.doctor : d)));
          showNotification("success", "Doctor updated successfully");
        }
      } else {
        // ============ ADD DOCTOR ============
        const response = await addDoctorAPI(submitData);
        // Uncomment below when using real API:
        // const response = await api.post("/doctors", submitData);
        // if (response.data.success) {
        //   setDoctors([...doctors, response.data.doctor]);
        //   showNotification("success", "Doctor added successfully");
        // }
        
        // Demo code - remove when using real API
        if (response.success) {
          setDoctors([...doctors, response.doctor]);
          showNotification("success", "Doctor added successfully");
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving doctor:", error);
      const errorMessage = error.response?.data?.error || "Failed to save doctor";
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this doctor?")) {
      setLoading(true);
      try {
        // ============ DELETE DOCTOR ============
        const response = await deleteDoctorAPI(id);
        // Uncomment below when using real API:
        // const response = await api.delete(`/doctors/${id}`);
        // if (response.data.success) {
        //   setDoctors(doctors.filter((doc) => doc.id !== id));
        //   showNotification("success", "Doctor removed successfully");
        // }
        
        // Demo code - remove when using real API
        if (response.success) {
          setDoctors(doctors.filter((doc) => doc.id !== id));
          showNotification("success", "Doctor removed successfully");
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        const errorMessage = error.response?.data?.error || "Failed to delete doctor";
        showNotification("error", errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const selectAllDays = () => setSelectedDays([...DAYS]);
  const selectWeekdays = () => setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const selectWeekends = () => setSelectedDays(["Saturday", "Sunday"]);
  const clearDays = () => setSelectedDays([]);

  const formatTime = (time) => (time ? `${time.hour}:${time.minute} ${time.period}` : "N/A");
  const formatSchedule = (schedule) => {
    if (!schedule || typeof schedule !== "object") return "Not set";
    const days = Object.keys(schedule);
    if (days.length === 0) return "Not set";
    return days.map((day) => `${day}: ${formatTime(schedule[day]?.start)} - ${formatTime(schedule[day]?.end)}`).join(", ");
  };

  const isModalOpen = showAddModal || editingDoctor;

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-pulse ${
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

        <div className="flex items-center justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2" onClick={openAddModal}>
            <span className="font-bold">+</span><span>Add Doctor</span>
          </button>
        </div>

        {doctors.length === 0 ? (
          <div className="border rounded p-6 text-center">
            <p className="text-gray-500 mb-4">No doctors added yet.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={openAddModal}>Add Doctor</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border rounded shadow p-4 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">Dr. {doctor.name}</h2>
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${doctor.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                    {doctor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  <p>Email: {doctor.email}</p>
                  {doctor.phone && <p>Phone: {doctor.phone}</p>}
                  <p>Timing: {formatSchedule(doctor.schedule)}</p>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button className="flex-1 border rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100" onClick={() => openEditModal(doctor)}>Edit</button>
                  <button className="flex-1 border rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50" onClick={() => handleDelete(doctor.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4 shadow-2xl border border-gray-200">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold">{editingDoctor ? "Edit Doctor" : "Add Doctor"}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor's Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`} placeholder="Enter doctor's name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                  <select value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.specialization ? "border-red-500" : "border-gray-300"}`}>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                  {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="+1234567890" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="doctor@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Days <span className="text-red-500">*</span></label>
                  {errors.schedule && <p className="text-red-500 text-xs mb-2">{errors.schedule}</p>}
                  
                  {/* Quick Selection Buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button type="button" onClick={selectAllDays} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">All Days</button>
                    <button type="button" onClick={selectWeekdays} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">Weekdays</button>
                    <button type="button" onClick={selectWeekends} className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">Weekends</button>
                    <button type="button" onClick={clearDays} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">Clear</button>
                  </div>

                  {/* Days Selection */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          selectedDays.includes(day)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  {/* Common Time Selection */}
                  {selectedDays.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-3">
                        Set timing for: <span className="font-medium text-blue-600">{selectedDays.map(d => d.slice(0, 3)).join(", ")}</span>
                      </p>
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

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded text-blue-600 w-4 h-4" />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Doctor is currently active</label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100" disabled={loading}>Cancel</button>
                <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50">
                  {loading ? "Saving..." : editingDoctor ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}