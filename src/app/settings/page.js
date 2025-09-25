"use client";
import { useState } from "react";
import ProtectedLayout from "../layouts/protectedLayout";
import { Save, Mic, Volume2, Phone, PhoneCall } from "lucide-react";

export default function SettingsPage() {
    const [hospital, setHospital] = useState({
        name: "City Hospital",
        contactPerson: "Dr. John Doe",
        phone: "+1 555 123 4567",
        email: "info@cityhospital.com",
        address: "123 Main Street, Cityville",
        specialties: ["Cardiology", "Neurology"],
        emrType: "Epic"
    });

    const [voiceSettings, setVoiceSettings] = useState({
        gender: "female",
        tone: "professional",
        customVoiceUrl: ""
    });

    const [isSavingVoice, setIsSavingVoice] = useState(false);

    const handleChange = (field, value) => {
        setHospital(prev => ({ ...prev, [field]: value }));
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

                        <div>
                            <label className="text-sm font-medium text-gray-800">Specialties</label>
                            <input
                                type="text"
                                value={hospital.specialties.join(", ")}
                                onChange={(e) => handleChange("specialties", e.target.value.split(",").map(s => s.trim()))}
                                placeholder="Comma separated specialties"
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-800">EMR Type</label>
                            <input
                                type="text"
                                value={hospital.emrType}
                                onChange={(e) => handleChange("emrType", e.target.value)}
                                className="mt-1 w-full border rounded px-3 py-2 text-gray-700"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSaveHospital}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Information
                    </button>
                </div>

                {/* AI Voice Assistant */}
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
                    </div>

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

                    <div className="flex items-center space-x-3 pt-4 border-t">
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
                </div>

                {/* Forwarding Call */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
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
                        </div>

                        <div className="pt-4 mt-4 border-t">
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
                </div>

            </div>
        </ProtectedLayout>
    );
}
