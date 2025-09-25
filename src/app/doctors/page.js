"use client";

import React, { useState } from "react";
import ProtectedLayout from "../layouts/protectedLayout";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([
    {
      id: "1",
      name: "John Doe",
      specialization: "Cardiology",
      email: "john@example.com",
      phone: "+1234567890",
      isActive: true,
      schedule: {
        Monday: { start: "09:00", end: "17:00" },
        Tuesday: { start: "10:00", end: "16:00" },
      },
    },
    {
      id: "2",
      name: "Jane Smith",
      specialization: "Neurology",
      email: "jane@example.com",
      phone: "+0987654321",
      isActive: false,
      schedule: {},
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this doctor?")) {
      setDoctors(doctors.filter((doc) => doc.id !== id));
      alert("Doctor removed successfully");
    }
  };

  const formatSchedule = (schedule) => {
    if (!schedule || typeof schedule !== "object") return "Not set";
    const days = Object.keys(schedule);
    if (days.length === 0) return "Not set";
    return days
      .map((day) => `${day}: ${schedule[day]?.start || "N/A"} - ${schedule[day]?.end || "N/A"}`)
      .join(", ");
  };

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-end space-y-4 sm:space-y-0">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
            onClick={() => setShowAddModal(true)}
          >
            <span className="font-bold">+</span>
            <span>Add Doctor</span>
          </button>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="border rounded p-6 text-center">
            <p className="text-gray-500 mb-4">No doctors added yet.</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => setShowAddModal(true)}
            >
              Add Doctor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border rounded shadow p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">Dr. {doctor.name}</h2>
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      doctor.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {doctor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-1">
                  <p>Email: {doctor.email}</p>
                  {doctor.phone && <p>Phone: {doctor.phone}</p>}
                  <p>Schedule: {formatSchedule(doctor.schedule)}</p>
                </div>

                <div className="flex space-x-2 mt-2">
                  <button
                    className="flex-1 border rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                    onClick={() => setEditingDoctor(doctor)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 border rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(doctor.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Doctor (dummy modal)</h2>
              <p>This is a placeholder. Integrate your form here.</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Doctor Modal */}
        {editingDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Doctor (dummy modal)</h2>
              <p>Editing: Dr. {editingDoctor.name}</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setEditingDoctor(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
