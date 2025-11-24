"use client";
import { useState } from "react";
import ProtectedLayout from "../layouts/protectedLayout";
import { Save, Mic, Volume2, Phone, PhoneCall, X } from "lucide-react";

export default function SettingsPage() {
    const [hospital, setHospital] = useState({
        name: "City Hospital",
        contactPerson: "Dr. John Doe",
        phone: "+1 555 123 4567",
        email: "info@cityhospital.com",
        address: "123 Main Street, Cityville",
        weekdayHours: "8:00 AM - 8:00 PM",
        weekendHours: "9:00 AM - 5:00 PM",
        specialties: ["Primary Care", "Mental Health"],
        emrType: "Epic"
    });

    const [voiceSettings, setVoiceSettings] = useState({
        gender: "female",
        tone: "professional",
        customVoiceUrl: ""
    });

    const [isSavingVoice, setIsSavingVoice] = useState(false);
    const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
    // Predefined specialties list
    const availableSpecialties = [
        "Primary Care",
        "Mental Health",
        "Cardiology",
        "Sports Medicine",
        "Radiology",
        // "Neurology",
        // "Orthopedics",
        // "Pediatrics",
        // "Oncology",
        // "Dermatology",
        // "Gastroenterology",
        // "Ophthalmology",
        // "Psychiatry",
        // "Pulmonology",
        // "Nephrology",
        // "Endocrinology",
        // "Urology",
        // "ENT (Otolaryngology)",
        // "General Surgery",
        // "Emergency Medicine",
        // "Anesthesiology",
        // "Pathology",
        // "Internal Medicine"
    ];

    const handleChange = (field, value) => {
        setHospital(prev => ({ ...prev, [field]: value }));
    };
    const handleSpecialtyToggle = (specialty) => {
        setHospital(prev => {
            const isSelected = prev.specialties.includes(specialty);
            if (isSelected) {
                return {
                    ...prev,
                    specialties: prev.specialties.filter(s => s !== specialty)
                };
            } else {
                return {
                    ...prev,
                    specialties: [...prev.specialties, specialty]
                };
            }
        });
    };

    const handleRemoveSpecialty = (specialty) => {
        setHospital(prev => ({
            ...prev,
            specialties: prev.specialties.filter(s => s !== specialty)
        }));
    };

    const handleSaveHospital = () => {
        alert("Hospital information saved!");
    };

    const handleSaveVoiceSettings = () => {
        setIsSavingVoice(true);
        setTimeout(() => {
            alert("Voice settings saved!");
            setIsSavingVoice(false);
        }, 1000);
    };

    const handleTestVoice = () => {
        alert(`Testing voice: ${voiceSettings.gender}, ${voiceSettings.tone}`);
    };

    return (
        <ProtectedLayout>
            <div className="p-6 space-y-6">

                {/* Hospital Information */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">Hospital Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-800">Hospital Name</label>
                            <input
                                type="text"
                                value={hospital.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">Contact Person</label>
                            <input
                                type="text"
                                value={hospital.contactPerson}
                                onChange={(e) => handleChange("contactPerson", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">Phone Number</label>
                            <input
                                type="text"
                                value={hospital.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">Email</label>
                            <input
                                type="email"
                                value={hospital.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-800">Address</label>
                            <textarea
                                rows={2}
                                value={hospital.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            ></textarea>
                        </div>

                        {/* Timings Section */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-800 mb-2 block">Timings</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 ">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Weekday Hours</label>
                                    <input
                                        type="text"
                                        placeholder="8:00 AM - 8:00 PM"
                                        value={hospital.weekdayHours}
                                        onChange={(e) => handleChange("weekdayHours", e.target.value)}
                                        className="mt-1 w-full border rounded px-3 py-2 text-gray-700 bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Weekend Hours</label>
                                    <input
                                        type="text"
                                        placeholder="9:00 AM - 5:00 PM"
                                        value={hospital.weekendHours}
                                        onChange={(e) => handleChange("weekendHours", e.target.value)}
                                        className="mt-1 w-full border rounded px-3 py-2 text-gray-700 bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specialties Multi-Select Dropdown */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-800">Specialties</label>

                            {/* Dropdown with selected specialties inside */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowSpecialtyDropdown(!showSpecialtyDropdown)}
                                    className="mt-1 w-full border rounded px-3 py-2 text-left text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-between min-h-[42px]"
                                >
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {hospital.specialties.length > 0 ? (
                                            hospital.specialties.map((specialty) => (
                                                <span
                                                    key={specialty}
                                                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {specialty}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveSpecialty(specialty);
                                                        }}
                                                        className="ml-2 hover:text-blue-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">Select specialties</span>
                                        )}
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showSpecialtyDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {availableSpecialties.map((specialty) => (
                                            <label
                                                key={specialty}
                                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={hospital.specialties.includes(specialty)}
                                                    onChange={() => handleSpecialtyToggle(specialty)}
                                                    className="mr-3 h-4 w-4"
                                                />
                                                <span className="text-gray-700">{specialty}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div>
                            <label className="text-sm font-medium text-gray-800">Specialties</label>
                            <input
                                type="text"
                                value={hospital.specialties.join(", ")}
                                onChange={(e) => handleChange("specialties", e.target.value.split(",").map(s => s.trim()))}
                                placeholder="Comma separated specialties"
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            />
                        </div> */}

                        {/* <div>
                                <label className="text-sm font-medium text-gray-800">EMR Type</label>
                                <input
                                    type="text"
                                    value={hospital.emrType}
                                    onChange={(e) => handleChange("emrType", e.target.value)}
                                    className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                                />
                            </div> */}
                    </div>

                    <button
                        onClick={handleSaveHospital}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Information
                    </button>
                </div>

                {/* AI Voice Assistant
                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    <div className="flex items-center space-x-2">
                        <Volume2 className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-800">AI Voice Assistant</h2>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Customize the voice and tone of your AI assistant
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-800">Voice Gender</label>
                            <select
                                value={voiceSettings.gender}
                                onChange={(e) => setVoiceSettings(prev => ({ ...prev, gender: e.target.value }))}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            >
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">Voice Tone</label>
                            <select
                                value={voiceSettings.tone}
                                onChange={(e) => setVoiceSettings(prev => ({ ...prev, tone: e.target.value }))}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            >
                                <option value="professional">Professional</option>
                                <option value="empathetic">Empathetic</option>
                                <option value="friendly">Friendly</option>
                                <option value="calm">Calm</option>
                                <option value="authoritative">Authoritative</option>
                            </select>
                        </div>
                    </div> */}

                {/* <div>
            <label className="text-sm font-medium text-gray-800">Custom Voice URL (Optional)</label>
            <input
              type="text"
              value={voiceSettings.customVoiceUrl}
              onChange={(e) => setVoiceSettings(prev => ({ ...prev, customVoiceUrl: e.target.value }))}
              placeholder="https://your-custom-voice-url.com"
              className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a URL to your custom voice model for a personalized assistant voice
            </p>
          </div> */}

                {/* <div className="flex items-center space-x-3 pt-4 border-t">
                        <button
                            onClick={handleSaveVoiceSettings}
                            disabled={isSavingVoice}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
                        >
                            <Save className="h-4 w-4" />
                            <span>{isSavingVoice ? "Saving..." : "Save Voice Settings"}</span>
                        </button>

                        <button
                            onClick={handleTestVoice}
                            className="border border-gray-300 px-4 py-2 text-gray-600 rounded hover:bg-gray-100 flex items-center space-x-2"
                        >
                            <Mic className="h-4 w-4" />
                            <span>Test Voice</span>
                        </button>
                    </div>
                </div> */}

                {/* Forwarding Call */}
                {/* <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Phone System</h2>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Your assigned Twilio phone number and configuration
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-800">Assigned Phone Number</label>
                            {hospital?.twilioPhoneNumber ? (
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-lg px-3 py-1 border rounded">{hospital.twilioPhoneNumber}</span>
                                    <span className="px-2 py-1 bg-green-200 text-green-800 rounded">Active</span>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mt-1">No phone number assigned</p>
                            )}
                        </div>

                        <div className="text-sm text-gray-500">
                            <p>This is your hospital's dedicated AI phone line. Patients can call this number to:</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Schedule appointments</li>
                                <li>Get information about services</li>
                                <li>Reschedule or cancel appointments</li>
                                <li>Be transferred to human staff when needed</li>
                            </ul>
                        </div> */}

                {/* <div className="pt-4 mt-4 border-t">
                            <label className="text-sm font-medium text-gray-800">Test Your Phone System</label>
                            <p className="text-xs text-gray-500 mt-1 mb-2">
                                Initiate a demo call to your Twilio number to test the AI assistant.
                            </p>
                            <button
                                // onClick={handleDemoCall}
                                // disabled={demoCallMutation?.isPending}
                                className="flex items-center space-x-2 border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
                            >
                                <PhoneCall className="h-4 w-4" />
                                <span>{'Make a Test Call'}</span>
                            </button>
                        </div>
                    </div>
                </div> */}

            </div>
        </ProtectedLayout>
    );
}
