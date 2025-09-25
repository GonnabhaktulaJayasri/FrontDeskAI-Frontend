import React from "react";
import { Phone, Calendar, Users, Activity, Clock, PhoneCall } from "lucide-react";
import ProtectedLayout from "../layouts/protectedLayout";

export default function Dashboard() {
  // Mock Data
  const hospital = {
    name: "City Hospital",
    twilioPhoneNumber: "+1 234 567 8901",
  };

  const appointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      doctorName: "Dr. Smith",
      appointmentType: "Consultation",
      appointmentDate: new Date(),
      status: "confirmed",
    },
    {
      id: 2,
      patientName: "Michael Chen",
      doctorName: "Dr. Lee",
      appointmentType: "Check-up",
      appointmentDate: new Date(new Date().getTime() + 3600000),
      status: "pending",
    },
  ];

  const callLogs = [
    { id: 1, startedAt: new Date(), status: "in_progress", patient: "Sarah Johnson" },
    { id: 2, startedAt: new Date(), status: "completed", patient: "Michael Chen" },
  ];

  const doctors = [
    { id: 1, name: "Dr. Smith" },
    { id: 2, name: "Dr. Lee" },
  ];

  const stats = [
    {
      title: "Total Calls Today",
      value: callLogs.filter(
        (call) =>
          new Date(call.startedAt).toDateString() === new Date().toDateString()
      ).length,
      icon: Phone,
      description: "Calls handled by AI",
      trend: "+12%",
    },
    {
      title: "Today's Appointments",
      value: appointments.filter(
        (apt) =>
          new Date(apt.appointmentDate).toDateString() ===
          new Date().toDateString()
      ).length,
      icon: Calendar,
      description: "Scheduled for today",
      trend: "+8%",
    },
    {
      title: "Active Doctors",
      value: doctors.length,
      icon: Users,
      description: "Available doctors",
      trend: "stable",
    },
    {
      title: "System Status",
      value: "Online",
      icon: Activity,
      description: "All systems operational",
      trend: "healthy",
    },
  ];

  const activeCalls = callLogs.filter((call) => call.status === "in_progress");

  return (
    <>
      <ProtectedLayout>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-sm font-medium text-gray-700">{stat.title}</p>
                  <stat.icon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="text-2xl font-bold  text-gray-700">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.description}</p>
                <div className="pt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded ${stat.trend === "healthy"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Live Calls and Recent Calls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Calls */}
            <div className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-gray-700" />
                <h2 className="font-semibold text-gray-700">Live Calls</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {activeCalls.length} active call
                {activeCalls.length !== 1 ? "s" : ""}
              </p>
              <ul className="space-y-2">
                {activeCalls.length > 0 ? (
                  activeCalls.map((call) => (
                    <li key={call.id} className="text-sm text-gray-600">
                      {call.patient} - <span className="text-blue-600">In Progress</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No active calls</p>
                )}
              </ul>
            </div>

            {/* Recent Calls */}
            <div className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="h-5 w-5 text-gray-700" />
                <h2 className="font-semibold text-gray-700">Recent Calls</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">Latest call activity</p>
              <ul className="space-y-2">
                {callLogs.slice(0, 5).map((call) => (
                  <li key={call.id} className="text-sm text-gray-700">
                    {call.patient} - {call.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-700" />
              <h2 className="font-semibold text-gray-700">Today's Schedule</h2>
            </div>
            <p className="text-sm text-gray-500 mb-3">Upcoming appointments</p>
            <div className="space-y-3">
              {appointments.filter(
                (apt) =>
                  new Date(apt.appointmentDate).toDateString() ===
                  new Date().toDateString()
              ).length > 0 ? (
                appointments
                  .filter(
                    (apt) =>
                      new Date(apt.appointmentDate).toDateString() ===
                      new Date().toDateString()
                  )
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-600">{apt.patientName}</p>
                        <p className="text-sm text-gray-500">
                          {apt.doctorName} • {apt.appointmentType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(apt.appointmentDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${apt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No upcoming appointments today
                </p>
              )}
            </div>
          </div>
        </div>
      </ProtectedLayout>
    </>
  );
}
