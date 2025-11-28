// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import {
//   Phone,
//   PhoneCall,
//   Zap,
//   Play,
//   ArrowRight,
//   Sparkles,
//   ShieldCheck,
//   MessageCircle,
//   X,
//   Send,
//   Loader2,
// } from "lucide-react";
// import PublicLayout from "./layouts/publicLayout";
// import FAQCTASection from "@/components/FAQCTASection";
// import api from "@/auth/baseInstance";

// export default function Landing() {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [sessionId, setSessionId] = useState(null);
//   const [appointmentInitiated, setAppointmentInitiated] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Initialize chat when opened
//   useEffect(() => {
//     if (isChatOpen && !sessionId) {
//       initializeChat();
//     }
//   }, [isChatOpen]);

//   // Initialize chat session with AI
//   const initializeChat = async () => {
//     setIsLoading(true);
//     try {
//       const res = await api.post("/chatbot/initialize");
//       const data = res.data;

//       if (data.success) {
//         setSessionId(data.sessionId);
//         setMessages([
//           { text: data.message, isBot: true, timestamp: new Date() }
//         ]);
//       } else {
//         setMessages([
//           {
//             text: "Sorry, I'm having trouble connecting. Please try again.",
//             isBot: true,
//             timestamp: new Date()
//           }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error initializing chat:', error);
//       setMessages([
//         {
//           text: "Sorry, I'm currently unavailable. Please try again later or call us directly.",
//           isBot: true,
//           timestamp: new Date()
//         }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Send message to AI
//   const handleSendMessage = async () => {
//     if (!inputMessage.trim() || isLoading || !sessionId) return;

//     const userMessage = inputMessage.trim();
//     setInputMessage("");

//     // Add user message to chat
//     setMessages(prev => [...prev, {
//       text: userMessage,
//       isBot: false,
//       timestamp: new Date()
//     }]);

//     setIsLoading(true);

//     try {
//       const res = await api.post("/chatbot/message", {
//         sessionId,
//         message: userMessage,
//       });

//       const data = res.data;

//       if (data.success) {
//         // Add AI response to chat
//         setMessages(prev => [...prev, {
//           text: data.message,
//           isBot: true,
//           timestamp: new Date()
//         }]);

//         // Check if appointment was initiated
//         if (data.appointmentInitiated) {
//           setAppointmentInitiated(true);
//           // Add confirmation message
//           setTimeout(() => {
//             setMessages(prev => [...prev, {
//               // text: "Appointment request received! Our scheduling team will contact you shortly to confirm the details.",
//               isBot: true,
//               timestamp: new Date(),
//               isAlert: true
//             }]);
//           }, 1000);
//         }
//       } else {
//         setMessages(prev => [...prev, {
//           text: "Sorry, I couldn't process that. Could you please try again?",
//           isBot: true,
//           timestamp: new Date()
//         }]);
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setMessages(prev => [...prev, {
//         text: "Sorry, there was an error. Please try again.",
//         isBot: true,
//         timestamp: new Date()
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Reset chat
//   const handleCloseChat = () => {
//     setIsChatOpen(false);
//     setMessages([]);
//     setSessionId(null);
//     setAppointmentInitiated(false);
//   };

//   return (
//     <PublicLayout>
//       <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
//         {/* Background animated gradient blobs */}
//         <div className="absolute inset-0 -z-10">
//           <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
//           <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
//           <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
//         </div>

//         <div className="relative z-10 container mx-auto px-6 py-24">
//           {/* Hero Section */}
//           <div className="text-center max-w-4xl mx-auto">
//             <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-white/20 rounded-full text-blue-200 text-sm mb-8 backdrop-blur-md shadow-lg">
//               <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
//               Always-On Virtual Front Desk
//             </div>

//             <h1 className="text-6xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight drop-shadow-lg">
//               CareConnect
//               <br />
//               <span className="text-4xl md:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                 The Future of Patient Experience
//               </span>
//             </h1>

//             <p className="text-md md:text-lg text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
//               Transform hospital front desks with AI that answers, routes, and manages calls—
//               delivering instant, intelligent support while freeing staff for real care.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//               <Link
//                 href="/auth/signup"
//                 className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
//               >
//                 Start Free Trial
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Link>
//               <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
//                 <Play className="w-5 h-5" />
//                 Watch Demo
//               </button>
//             </div>

//             {/* Demo Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
//               {[
//                 { value: "10K+", label: "Calls Handled" },
//                 { value: "99%", label: "Uptime" },
//                 { value: "24/7", label: "Availability" },
//                 { value: "50%", label: "Cost Savings" },
//               ].map((stat, i) => (
//                 <div
//                   key={i}
//                   className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg"
//                 >
//                   <div className="text-3xl font-bold text-white mb-2">
//                     {stat.value}
//                   </div>
//                   <div className="text-gray-300 text-sm">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Features Grid */}
//           <div className="grid md:grid-cols-3 gap-8 mb-20">
//             {[
//               {
//                 icon: <Phone className="w-6 h-6 text-white" />,
//                 title: "Smart Call Routing",
//                 desc: "AI instantly understands caller intent and routes to the right department or automates appointment bookings.",
//                 gradient: "from-blue-500 to-blue-700",
//               },
//               {
//                 icon: <PhoneCall className="w-6 h-6 text-white" />,
//                 title: "Proactive Outreach",
//                 desc: "Automated reminders, follow-up calls, and patient check-ins reduce no-shows and improve care continuity.",
//                 gradient: "from-purple-500 to-pink-600",
//               },
//               {
//                 icon: <Zap className="w-6 h-6 text-white" />,
//                 title: "Enterprise Scale",
//                 desc: "Handle thousands of calls with advanced routing, real-time analytics, and seamless EHR integrations.",
//                 gradient: "from-emerald-500 to-teal-600",
//               },
//             ].map((feature, i) => (
//               <div
//                 key={i}
//                 className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:scale-105 transition-all duration-300"
//               >
//                 <div
//                   className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-md`}
//                 >
//                   {feature.icon}
//                 </div>
//                 <h3 className="font-bold text-2xl mb-4 text-white">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
//                 <div className="mt-6 flex items-center text-blue-300 text-sm font-semibold">
//                   Learn more
//                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <FAQCTASection />

//           {/* Chatbot Widget */}
//           <div className="fixed bottom-6 right-6 z-50">
//             {/* Chat Window */}
//             {isChatOpen && (
//               <div className="mb-4 w-80 md:w-100 h-150 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
//                 {/* Header */}
//                 <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-4 flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-md">
//                       <Sparkles className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-white font-semibold">CareConnect AI</h3>
//                       <p className="text-blue-100 text-xs">
//                         {isLoading ? 'Typing...' : 'Online • Always here to help'}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleCloseChat}
//                     className="text-white hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Messages */}
//                 <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
//                   {messages.map((msg, idx) => (
//                     <div
//                       key={idx}
//                       className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
//                     >
//                       <div
//                         className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.isAlert
//                             ? "bg-green-100 text-green-800 border border-green-300"
//                             : msg.isBot
//                               ? "bg-white text-gray-800 shadow-sm"
//                               : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
//                           }`}
//                       >
//                         <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
//                       </div>
//                     </div>
//                   ))}
//                   {isLoading && (
//                     <div className="flex justify-start">
//                       <div className="bg-white text-gray-800 shadow-sm rounded-2xl px-4 py-2">
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                       </div>
//                     </div>
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input */}
//                 <div className="p-4 bg-white border-t border-gray-200">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="text"
//                       value={inputMessage}
//                       onChange={(e) => setInputMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type your message..."
//                       disabled={isLoading || !sessionId}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     />
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={isLoading || !inputMessage.trim() || !sessionId}
//                       className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white p-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                     >
//                       <Send className="w-5 h-5" />
//                     </button>
//                   </div>
//                   {appointmentInitiated && (
//                     <p className="text-xs text-green-600 mt-2 text-center">
//                       ✓ Appointment request received. We'll call you shortly!
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Chat Button */}
//             {!isChatOpen && (
//               <button
//                 onClick={() => setIsChatOpen(true)}
//                 className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
//               >
//                 {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div> */}
//                 <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
//               </button>
//             )}
//           </div>
//         </div>
//       </section>
//     </PublicLayout>
//   );
// }

"use client";

import Link from "next/link";
import {
  Phone,
  PhoneCall,
  Zap,
  Play,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import PublicLayout from "./layouts/publicLayout";
import FAQCTASection from "@/components/FAQCTASection";

export default function Landing() {
  return (
    <PublicLayout>
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
        {/* Background animated gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-24">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            {/* <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-white/20 rounded-full text-blue-200 text-sm mb-8 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Always-On Virtual Front Desk
            </div> */}

            <h1 className="text-6xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight drop-shadow-lg">
              Frontdesk AI
              <br />
              <span className="text-4xl md:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                The Future of Patient Experience
              </span>
            </h1>

            <p className="text-md md:text-lg text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Transform hospital front desks with AI that answers, routes, and manages calls—
              delivering instant, intelligent support while freeing staff for real care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button> */}
            </div>

            {/* Demo Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {[
                { value: "10K+", label: "Calls Handled" },
                { value: "99%", label: "Uptime" },
                { value: "24/7", label: "Availability" },
                { value: "50%", label: "Cost Savings" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg"
                >
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Phone className="w-6 h-6 text-white" />,
                title: "Smart Call Routing",
                desc: "AI instantly understands caller intent and routes to the right department or automates appointment bookings.",
                gradient: "from-blue-500 to-blue-700",
              },
              {
                icon: <PhoneCall className="w-6 h-6 text-white" />,
                title: "Proactive Outreach",
                desc: "Automated reminders, follow-up calls, and patient check-ins reduce no-shows and improve care continuity.",
                gradient: "from-purple-500 to-pink-600",
              },
              {
                icon: <Zap className="w-6 h-6 text-white" />,
                title: "Enterprise Scale",
                desc: "Handle thousands of calls with advanced routing, real-time analytics, and seamless EHR integrations.",
                gradient: "from-emerald-500 to-teal-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-md`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                <div className="mt-6 flex items-center text-blue-300 text-sm font-semibold">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>

          <FAQCTASection />

          {/* Floating Chat Button */}
          {/* <Link
            href="/chatbot"
            className="fixed bottom-6 right-6 z-50 group"
          >
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center">
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Chat with AI Assistant
                <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            </div>
          </Link> */}
        </div>
      </section>
    </PublicLayout>
  );
}