"use client";

import React, { useState } from "react";
import ProtectedLayout from "../layouts/protectedLayout";

export default function HumanReceptionistPage() {
  const [receptionists, setReceptionists] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      phone: "+1-555-123-4567",
      timingFrom: "09:00",
      timingTo: "17:00",
    },
    {
      id: "2",
      name: "Michael Brown",
      phone: "+1-555-987-6543",
      timingFrom: "13:00",
      timingTo: "21:00",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReceptionist, setEditingReceptionist] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    timingFrom: "",
    timingTo: "",
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this receptionist?")) {
      setReceptionists(receptionists.filter((receptionist) => receptionist.id !== id));
      alert("Receptionist removed successfully");
    }
  };

  const handleAdd = () => {
    if (!formData.name || !formData.phone || !formData.timingFrom || !formData.timingTo) {
      alert("Please fill in all required fields");
      return;
    }

    const newReceptionist = {
      id: Date.now().toString(),
      ...formData,
    };

    setReceptionists([...receptionists, newReceptionist]);
    setFormData({ name: "", phone: "", timingFrom: "", timingTo: "" });
    setShowAddModal(false);
    alert("Receptionist added successfully");
  };

  const handleEdit = () => {
    if (!formData.name || !formData.phone || !formData.timingFrom || !formData.timingTo) {
      alert("Please fill in all required fields");
      return;
    }

    setReceptionists(
      receptionists.map((receptionist) =>
        receptionist.id === editingReceptionist.id ? { ...receptionist, ...formData } : receptionist
      )
    );
    setFormData({ name: "", phone: "", timingFrom: "", timingTo: "" });
    setEditingReceptionist(null);
    alert("Receptionist updated successfully");
  };

  const openEditModal = (receptionist) => {
    setEditingReceptionist(receptionist);
    setFormData({
      name: receptionist.name,
      phone: receptionist.phone,
      timingFrom: receptionist.timingFrom || "",
      timingTo: receptionist.timingTo || "",
    });
  };

  return (
    <ProtectedLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-end space-y-4 sm:space-y-0">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
            onClick={() => {
              setFormData({ name: "", phone: "", timingFrom: "", timingTo: "" });
              setShowAddModal(true);
            }}
          >
            <span className="font-bold">+</span>
            <span>Add Receptionist</span>
          </button>
        </div>

        {/* Receptionists Grid */}
        {receptionists.length === 0 ? (
          <div className="border rounded p-6 text-center">
            <p className="text-gray-500 mb-4">No receptionists added yet.</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => setShowAddModal(true)}
            >
              Add Receptionist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receptionists.map((receptionist) => (
              <div
                key={receptionist.id}
                className="border rounded shadow p-4 hover:shadow-lg transition-shadow"
              >
                <div className="mb-2">
                  <h2 className="font-bold text-lg text-gray-800">{receptionist.name}</h2>
                </div>

                <div className="text-sm text-gray-500 mb-3">
                  <p className="mb-1">
                    <span className="font-medium">Phone:</span> {receptionist.phone}
                  </p>
                  <p>
                    <span className="font-medium">Timings:</span>{" "}
                    {receptionist.timingFrom && receptionist.timingTo
                      ? `${receptionist.timingFrom} - ${receptionist.timingTo}`
                      : "Not specified"}
                  </p>
                </div>

                <div className="flex space-x-2 mt-2">
                  <button
                    className="flex-1 border rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                    onClick={() => openEditModal(receptionist)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 border rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(receptionist.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Receptionist Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Add Receptionist
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter receptionist name"
                    className="w-full border rounded px-3 py-2 text-gray-700"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full border rounded px-3 py-2 text-gray-700"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timings *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">From</label>
                      <input
                        type="time"
                        className="w-full border rounded px-3 py-2 text-gray-700"
                        value={formData.timingFrom}
                        onChange={(e) => setFormData({ ...formData, timingFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">To</label>
                      <input
                        type="time"
                        className="w-full border rounded px-3 py-2 text-gray-700"
                        value={formData.timingTo}
                        onChange={(e) => setFormData({ ...formData, timingTo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: "", phone: "", timingFrom: "", timingTo: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={handleAdd}
                >
                  Add Receptionist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Receptionist Modal */}
        {editingReceptionist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Edit Receptionist
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter receptionist name"
                    className="w-full border rounded px-3 py-2 text-gray-700"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full border rounded px-3 py-2 text-gray-700"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timings *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">From</label>
                      <input
                        type="time"
                        className="w-full border rounded px-3 py-2 text-gray-700"
                        value={formData.timingFrom}
                        onChange={(e) => setFormData({ ...formData, timingFrom: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">To</label>
                      <input
                        type="time"
                        className="w-full border rounded px-3 py-2 text-gray-700"
                        value={formData.timingTo}
                        onChange={(e) => setFormData({ ...formData, timingTo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => {
                    setEditingReceptionist(null);
                    setFormData({ name: "", phone: "", timingFrom: "", timingTo: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={handleEdit}
                >
                  Update Receptionist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}