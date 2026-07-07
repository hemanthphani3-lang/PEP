"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { User, Calendar, Globe } from "lucide-react";
import { LANGUAGES, LanguageSelectorModal } from "@/components/LanguageSelector";
import PrajaChatbot from "@/components/PrajaChatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState("en");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  useEffect(() => {
    setLang(localStorage.getItem("civicpulse_lang") || "en");
    const handleLangChange = () => {
      setLang(localStorage.getItem("civicpulse_lang") || "en");
    };
    window.addEventListener("language-change", handleLangChange);
    return () => window.removeEventListener("language-change", handleLangChange);
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 relative">
      {/* Sidebar Drawer */}
      <Sidebar />

      {/* Main administrative viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dashboard Top Header bar */}
        <header className="hidden md:flex h-16 border-b border-slate-200 bg-white items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{currentDate}</span>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Language Selector Trigger */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-all border border-slate-200 focus:outline-none cursor-pointer font-outfit shadow-sm hover:shadow"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{LANGUAGES.find(l => l.code === lang)?.native || "Language"}</span>
            </button>

            {/* Quick Status pills */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 font-mono">LIVE CONNECTIVITY</span>
            </div>

            <div className="flex items-center gap-2.5 pl-6 border-l border-slate-150">
              <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <User className="w-4.5 h-4.5" />
              </div>
              <div className="text-left leading-none">
                <span className="text-xs font-bold text-slate-800">Hon. Sri Mathukumilli Bharat</span>
                <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Visakhapatnam (AP-04)</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route Contents */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <LanguageSelectorModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
      
      {/* Floating MP AI Assistant */}
      <PrajaChatbot />
    </div>
  );
}
