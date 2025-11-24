"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

// Mock API - replace with your actual API
const api = {
  post: async (url, data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (url === "/chatbot/initialize") {
      return {
        data: {
          success: true,
          sessionId: "session_" + Date.now(),
          message: "Hi! I'm CareConnect AI. I can help you book appointments, answer questions about our services, or connect you with the right department. How can I assist you today?"
        }
      };
    }
    
    if (url === "/chatbot/message") {
      const message = data.message.toLowerCase();
      let response = "I understand you need help. Could you provide more details?";
      let appointmentInitiated = false;
      
      if (message.includes("appointment") || message.includes("booking") || message.includes("schedule")) {
        response = "I'd be happy to help you schedule an appointment! What type of appointment are you looking for, and do you have a preferred date and time?";
        appointmentInitiated = true;
      } else if (message.includes("emergency") || message.includes("urgent")) {
        response = "For medical emergencies, please call 911 immediately or visit your nearest emergency room. For urgent but non-emergency care, I can help you schedule a same-day appointment. Would you like me to do that?";
      } else if (message.includes("hours") || message.includes("open")) {
        response = "We're open Monday-Friday: 8am-6pm, Saturday: 9am-2pm. Closed Sundays. Our emergency services are available 24/7. Is there anything specific I can help you with?";
      } else if (message.includes("insurance")) {
        response = "We accept most major insurance plans including Medicare, Medicaid, and private insurance. Would you like me to verify your specific insurance coverage?";
      }
      
      return {
        data: {
          success: true,
          message: response,
          appointmentInitiated
        }
      };
    }
  }
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [appointmentInitiated, setAppointmentInitiated] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/chatbot/initialize");
      const data = res.data;

      if (data.success) {
        setSessionId(data.sessionId);
        setMessages([
          { text: data.message, isBot: true, timestamp: new Date() }
        ]);
      } else {
        setMessages([
          {
            text: "Sorry, I'm having trouble connecting. Please try again.",
            isBot: true,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      setMessages([
        {
          text: "Sorry, I'm currently unavailable. Please try again later or call us directly.",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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

        if (data.appointmentInitiated) {
          setAppointmentInitiated(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: "Appointment request received! Our scheduling team will contact you shortly to confirm the details.",
              isBot: true,
              timestamp: new Date(),
              isAlert: true
            }]);
          }, 1000);
        }
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setSessionId(null);
    setAppointmentInitiated(false);
    initializeChat();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center p-4">
      {/* Background animated gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            CareConnect AI Assistant
          </h1>
          <p className="text-gray-300">
            24/7 support for appointments, inquiries, and more
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">CareConnect AI</h2>
                <p className="text-blue-100 text-sm">
                  {isLoading ? 'Typing...' : 'Online • Always here to help'}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              title="Reset conversation"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-96 md:h-[500px] overflow-y-auto bg-gray-50 p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"} animate-in slide-in-from-bottom-2 duration-300`}
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
            {appointmentInitiated && (
              <p className="text-sm text-green-600 mt-3 text-center font-semibold">
                ✓ Appointment request received. We'll call you shortly!
              </p>
            )}
            <p className="text-xs text-gray-500 mt-3 text-center">
              Powered by CareConnect AI • Available 24/7
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {[
            "Book an appointment",
            "Check hours",
            "Insurance information",
            "Emergency services"
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => {
                setInputMessage(action);
                setTimeout(() => handleSendMessage(), 100);
              }}
              disabled={isLoading || !sessionId}
              className="px-4 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}