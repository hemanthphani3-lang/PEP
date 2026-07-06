"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  UserCircle,
  PlusCircle, 
  List, 
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Megaphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "My Submissions", href: "/citizen/my-submissions", icon: UserCircle },
  { name: "Add Suggestion", href: "/citizen/submit", icon: PlusCircle },
  { name: "Review Public Feed", href: "/citizen/suggestions", icon: List },
];

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem("civicpulse_citizen_phone");
    if (!savedPhone) {
      router.push("/login/citizen");
    } else {
      setPhone(savedPhone);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("civicpulse_citizen_phone");
    router.push("/");
  };

  if (!phone) return null; // Wait for redirect or load

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-extrabold text-xl text-slate-800 tracking-tight">
              CivicPulse <span className="text-blue-600">Citizen</span>
            </span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 font-medium hover:text-slate-900"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
              {phone.slice(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">+91 {phone}</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Verified Citizen
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 justify-between lg:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-outfit font-extrabold text-xl text-slate-800 tracking-tight">
              Citizen Portal
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
