"use client";

import React, { useState, useEffect } from "react";
import { Globe, Check, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export const LANGUAGES = [
  { code: "en", name: "English (UK)", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" }
];

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelectorModal({ isOpen, onClose }: LanguageSelectorModalProps) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(localStorage.getItem("civicpulse_lang") || "en");
    const handleLangChange = () => {
      setLang(localStorage.getItem("civicpulse_lang") || "en");
    };
    window.addEventListener("language-change", handleLangChange);
    return () => window.removeEventListener("language-change", handleLangChange);
  }, []);

  const selectLanguage = (code: string) => {
    setLang(code);
    localStorage.setItem("civicpulse_lang", code);
    window.dispatchEvent(new Event("language-change"));
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div translate="no" className="notranslate fixed inset-0 z-[9999] bg-slate-955/70 backdrop-blur-md flex justify-center items-center p-4">
          {/* Clickable backdrop overlay area */}
          <div
            onClick={onClose}
            className="absolute inset-0 z-0 cursor-default bg-transparent"
          />

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes modal-enter {
              from { opacity: 0; transform: scale(0.96) translateY(15px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-modal-enter {
              animation: modal-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 15s linear infinite;
            }
          `}} />

          {/* Modal Box */}
          <div
            className="notranslate relative bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.15)] rounded-[32px] p-6 sm:p-8 max-w-2xl w-full mx-auto overflow-hidden flex flex-col z-10 text-slate-800 animate-modal-enter"
          >
            {/* Decorative Background Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-slate-100 mb-6 shrink-0 relative z-10">
              <div className="space-y-1.5 text-left">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
                  <Globe className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Multilingual Mode</span>
                </div>
                <h3 translate="no" className="notranslate text-xl sm:text-2xl font-black font-outfit tracking-tight text-slate-800 mt-1">
                  Select Platform Language
                </h3>
                <p translate="no" className="notranslate text-xs sm:text-sm text-slate-500 font-medium">
                  अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి • Choose your preferred language
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 hover:rotate-90 transition-all duration-300 border border-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Languages */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1 pb-2 relative z-10 max-h-[55vh]">
              {LANGUAGES.map((language) => {
                const isActive = lang === language.code;
                return (
                  <button
                    key={language.code}
                    onClick={() => selectLanguage(language.code)}
                    className={`group relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[88px] overflow-hidden cursor-pointer ${
                      isActive 
                        ? "bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-500 shadow-[0_8px_20px_-4px_rgba(59,130,246,0.12)] ring-1 ring-blue-500/20" 
                        : "bg-slate-50/40 border-slate-200/60 hover:bg-slate-50 hover:border-slate-350 hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                  >
                    {/* Accent light on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Top Row: Language code & check indicator */}
                    <div className="flex items-center justify-between w-full relative z-10">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded font-mono ${
                        isActive 
                          ? "bg-blue-100 text-blue-750" 
                          : "bg-slate-200/65 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-650"
                      }`}>
                        {language.code}
                      </span>
                      
                      {isActive ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow shadow-blue-500/30">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-slate-350 transition-colors" />
                      )}
                    </div>

                    {/* Bottom Row: Name scripts */}
                    <div className="relative z-10 mt-auto">
                      <span className={`text-base font-black font-outfit block tracking-tight transition-colors ${
                        isActive ? "text-slate-900" : "text-slate-800 group-hover:text-blue-650"
                      }`}>
                        {language.native}
                      </span>
                      <span className={`text-xs font-bold block mt-0.5 transition-colors ${
                        isActive ? "text-slate-600" : "text-slate-400 group-hover:text-slate-500"
                      }`}>
                        {language.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
