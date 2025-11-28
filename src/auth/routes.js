import { LayoutDashboard, Calendar, Users, User, Settings, Pill, UsersIcon, Home, PhoneCall, FileText, PlayCircle, UserCircle } from "lucide-react";

export const Routes = [
    // { text: "Demo", href: "/demo", icon: <PlayCircle className="h-4 w-4" /> },
    { text: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> },
    { text: "Doctors", href: "/doctors", icon: <UsersIcon className="h-4 w-4" /> },
    { text: "Appointments", href: "/appointments", icon: <Calendar className="h-4 w-4" /> },
    // { text: "Call logs", href: "/call-logs", icon: <FileText className="h-4 w-4" /> },
    { text: "Outbound Calls", href: "/outboundcalls", icon: <PhoneCall className="h-4 w-4" /> },
    { text: "Human Receptionist", href: "/humanreceptionist", icon: <UserCircle className="h-4 w-4" /> },
    { text: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
];
