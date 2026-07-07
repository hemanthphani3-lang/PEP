"use client";

import React, { useState } from "react";
import { useDemoConfig } from "./DemoConfigContext";
import { Settings, Key, Database, Sparkles, CheckCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    geminiKey, 
    sarvamKey,
    supabaseUrl, 
    supabaseKey, 
    isFirebaseActive, 
    setGeminiKey, 
    setSarvamKey,
    setSupabaseConfig, 
    resetDatabase 
  } = useDemoConfig();

  const [gInput, setGInput] = useState(geminiKey);
  const [sarInput, setSarInput] = useState(sarvamKey);
  const [sUrlInput, setSUrlInput] = useState(supabaseUrl);
  const [sKeyInput, setSKeyInput] = useState(supabaseKey);
  const [isResetting, setIsResetting] = useState(false);
  const [forceMock, setForceMock] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("civicpulse_force_mock") === "true";
    }
    return false;
  });

  const handleSave = () => {
    localStorage.setItem("civicpulse_force_mock", forceMock ? "true" : "false");
    setGeminiKey(gInput);
    setSarvamKey(sarInput);
    setSupabaseConfig(sUrlInput, sKeyInput);
    setIsOpen(false);
  };

  const handleReset = async () => {
    setIsResetting(true);
    await resetDatabase();
    setIsResetting(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="Developer Demo Settings"
        id="dev-settings-btn"
      >
        <Settings className="w-6 h-6 animate-spin-slow group-hover:rotate-45 transition-transform duration-500" />
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between border-l border-slate-200"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-slate-800">Demo Configuration Panel</h2>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* API Key Configurations */}
                <div className="mt-6 space-y-5">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
                    <p className="font-semibold flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Hackathon Judge Note
                    </p>
                    By default, the platform runs an intelligent simulated engine so you can test all features instantly. Input keys below to activate live APIs.
                  </div>

                  {/* Gemini API Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Gemini API Key
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={gInput}
                        onChange={(e) => setGInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      />
                      <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Used for translating Hindi/Telugu to English, request summary, categorisation, and explainable AI logic.
                    </p>
                  </div>

                  {/* Sarvam AI API Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Sarvam AI API Key
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="sk_..."
                        value={sarInput}
                        onChange={(e) => setSarInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      />
                      <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Used for high-fidelity Indic Speech-to-Text (STT), Text-to-Speech (TTS), and native back-translations (Telugu/Hindi).
                    </p>
                  </div>

                  {/* Supabase Config Group */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Supabase Connection Parameters</h3>
                    
                    {/* Supabase URL */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-blue-600" />
                        Supabase Project URL
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="https://your-project.supabase.co"
                          value={sUrlInput}
                          onChange={(e) => setSUrlInput(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        />
                        <Database className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Supabase Anon Key */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-blue-600" />
                        Supabase Anon Key
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="eyJhbGciOi..."
                          value={sKeyInput}
                          onChange={(e) => setSKeyInput(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        />
                        <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Environment Statuses */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700">Platform Integrations</h3>
                    
                    {/* Supabase Status */}
                    <div className="flex items-center justify-between text-xs p-2.5 border border-slate-150 rounded-lg bg-slate-50">
                      <span className="text-slate-600 font-medium">Supabase PostgreSQL DB</span>
                      {isFirebaseActive ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          <AlertCircle className="w-3.5 h-3.5" /> Local Fallback
                        </span>
                      )}
                    </div>

                    {/* Gemini Status */}
                    <div className="flex items-center justify-between text-xs p-2.5 border border-slate-150 rounded-lg bg-slate-50">
                      <span className="text-slate-600 font-medium">Gemini 2.5 Flash</span>
                      {geminiKey ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Live API
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          <AlertCircle className="w-3.5 h-3.5" /> Simulated
                        </span>
                      )}
                    </div>

                    {/* Sarvam AI Status */}
                    <div className="flex items-center justify-between text-xs p-2.5 border border-slate-150 rounded-lg bg-slate-50">
                      <span className="text-slate-600 font-medium">Sarvam AI API</span>
                      {sarvamKey ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Live API
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          <AlertCircle className="w-3.5 h-3.5" /> Simulated
                        </span>
                      )}
                    </div>

                    {/* Force Local Storage Toggle */}
                    <div className="flex items-center justify-between text-xs p-2.5 border border-slate-150 rounded-lg bg-slate-50">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-bold">Force Offline Demo Mode</span>
                        <span className="text-[9px] text-slate-400">Bypass Firebase Cloud completely</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={forceMock}
                        onChange={(e) => setForceMock(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-350 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3 pb-2">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                  Save Configuration
                </button>
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg text-sm transition-colors border border-slate-200"
                >
                  {isResetting ? "Reseeding..." : "Reset & Seed Demo Data"}
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  Resets database to 50+ fresh complaints across Roads, Water, Education, and Healthcare.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
