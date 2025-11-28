// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Frontdesk AI | 24/7 Intelligent Phone Assistant for Hospitals",
  description:
    "Frontdesk AI transforms hospital communication with an intelligent phone assistant that manages patient calls, appointments, and support—anytime, anywhere.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
