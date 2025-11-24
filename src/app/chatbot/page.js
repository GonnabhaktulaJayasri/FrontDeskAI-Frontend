// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import {
//   Sparkles,
//   X,
//   Send,
//   Loader2,
//   MessageCircle,
//   ArrowLeft,
// } from "lucide-react";
// import api from "@/auth/baseInstance";

// export default function ChatbotPage() {
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

//   // Initialize chat when component mounts
//   useEffect(() => {
//     initializeChat();
//   }, []);

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
//               text: "Appointment request received! Our scheduling team will contact you shortly to confirm the details.",
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
//   const handleReset = () => {
//     setMessages([]);
//     setSessionId(null);
//     setAppointmentInitiated(false);
//     initializeChat();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center p-4 relative">
//       {/* Background animated gradient blobs */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
//         <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Back Button */}
//       <Link
//         href="/"
//         className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         <span>Back to Home</span>
//       </Link>

//       <div className="w-full max-w-4xl relative z-10">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl">
//             <MessageCircle className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-extrabold text-white mb-2">
//             CareConnect AI Assistant
//           </h1>
//           <p className="text-gray-300">
//             24/7 support for appointments, inquiries, and more
//           </p>
//         </div>

//         {/* Chat Container */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           {/* Chat Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-md">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-white font-bold text-lg">CareConnect AI</h2>
//                 <p className="text-blue-100 text-sm">
//                   {isLoading ? 'Typing...' : 'Online • Always here to help'}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleReset}
//               className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//               title="Reset conversation"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Messages Area */}
//           <div className="h-96 md:h-[500px] overflow-y-auto bg-gray-50 p-6 space-y-4">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
//               >
//                 <div
//                   className={`max-w-[80%] rounded-2xl px-6 py-3 ${
//                     msg.isAlert
//                       ? "bg-green-100 text-green-800 border-2 border-green-300"
//                       : msg.isBot
//                       ? "bg-white text-gray-800 shadow-md border border-gray-200"
//                       : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
//                   }`}
//                 >
//                   {msg.isBot && !msg.isAlert && (
//                     <div className="flex items-center mb-1">
//                       <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
//                       <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
//                     </div>
//                   )}
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
//                   <span className="text-xs opacity-60 mt-1 block">
//                     {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl px-6 py-3">
//                   <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-6 bg-white border-t-2 border-gray-200">
//             <div className="flex items-center gap-3">
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type your message..."
//                 disabled={isLoading || !sessionId}
//                 className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={isLoading || !inputMessage.trim() || !sessionId}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//               >
//                 <Send className="w-6 h-6" />
//               </button>
//             </div>
//             {appointmentInitiated && (
//               <p className="text-sm text-green-600 mt-3 text-center font-semibold">
//                 ✓ Appointment request received. We'll call you shortly!
//               </p>
//             )}
//             <p className="text-xs text-gray-500 mt-3 text-center">
//               Powered by CareConnect AI • Available 24/7
//             </p>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-6 flex flex-wrap gap-3 justify-center">
//           {[
//             "Book an appointment",
//             "Check hours",
//             "Insurance information",
//             "Emergency services"
//           ].map((action, i) => (
//             <button
//               key={i}
//               onClick={() => {
//                 setInputMessage(action);
//               }}
//               disabled={isLoading || !sessionId}
//               className="px-4 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {action}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  MessageCircle,
  ArrowLeft,
  Phone,
  User,
  Mail,
  FileText,
} from "lucide-react";
import api from "@/auth/baseInstance";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Form state
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    reason: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.reason.trim()) {
      errors.reason = "Reason for call is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle form submission and initiate AI call
  const handleTalkToAI = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsInitiatingCall(true);

    try {
      // Make API call to initiate outbound call using existing service
      const res = await api.post("/chatbot/initiate-outbound-call", {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        reason: formData.reason,
      });

      const data = res.data;

      if (data.success) {
        // Hide form and show success message
        setShowForm(false);
        setSessionId(data.sessionId);
        
        setMessages([
          {
            text: `Hello ${formData.name}! Our AI assistant is calling you now at ${formData.phoneNumber}. Please answer your phone.`,
            isBot: true,
            timestamp: new Date(),
            isAlert: true
          },
          {
            text: `We'll be discussing: ${formData.reason}`,
            isBot: true,
            timestamp: new Date()
          }
        ]);

        if (data.callSid) {
          console.log('Call initiated with SID:', data.callSid);
        }
      } else {
        alert(data.message || "Failed to initiate call. Please try again.");
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      const errorMessage = error.response?.data?.message || "Sorry, we couldn't initiate the call. Please try again or call us directly.";
      alert(errorMessage);
    } finally {
      setIsInitiatingCall(false);
    }
  };

  // Send message to AI (for chat after call)
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    setMessages(prev => [...prev, {
      text: userMessage,
      isBot: false,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const res = await api.post("/chatbot/message", {
        sessionId,
        message: userMessage,
      });

      const data = res.data;

      if (data.success) {
        setMessages(prev => [...prev, {
          text: data.message,
          isBot: true,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          text: "Sorry, I couldn't process that. Could you please try again?",
          isBot: true,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, there was an error. Please try again.",
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Reset to form
  const handleReset = () => {
    setShowForm(true);
    setMessages([]);
    setSessionId(null);
    setFormData({
      name: "",
      phoneNumber: "",
      email: "",
      reason: "",
    });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center p-4 relative">
      {/* Background animated gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            CareConnect AI Assistant
          </h1>
          <p className="text-gray-300">
            {showForm ? "Get a personalized AI call in seconds" : "24/7 support for appointments, inquiries, and more"}
          </p>
        </div>

        {/* Form or Chat Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {showForm ? (
            /* Contact Form */
            <>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-md">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">Talk to Our AI Assistant</h2>
                    <p className="text-blue-100 text-sm">
                      We'll call you instantly
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleTalkToAI} className="p-8 space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john.doe@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Reason Field */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Reason for Call *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleFormChange}
                    placeholder="e.g., Book an appointment, Ask about services, Insurance inquiry..."
                    rows="4"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                      formErrors.reason ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.reason && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.reason}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isInitiatingCall}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {isInitiatingCall ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <Phone className="w-6 h-6" />
                      Talk to AI
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By clicking "Talk to AI", you consent to receive an automated call from CareConnect
                </p>
              </form>
            </>
          ) : (
            /* Chat Interface After Call */
            <>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">CareConnect AI</h2>
                    <p className="text-blue-100 text-sm">
                      {isLoading ? 'Typing...' : 'Call in progress'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  title="Start new call"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="h-96 md:h-[500px] overflow-y-auto bg-gray-50 p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-6 py-3 ${
                        msg.isAlert
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : msg.isBot
                          ? "bg-white text-gray-800 shadow-md border border-gray-200"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      }`}
                    >
                      {msg.isBot && !msg.isAlert && (
                        <div className="flex items-center mb-1">
                          <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl px-6 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading || !sessionId}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim() || !sessionId}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Currently on call with {formData.name} • {formData.phoneNumber}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Quick Info */}
        {showForm && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">
                Our AI will call you within seconds • Available 24/7
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}