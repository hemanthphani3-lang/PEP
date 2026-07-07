"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DBService } from "@/services/db";

interface DemoConfig {
  geminiKey: string;
  mapsKey: string;
  sarvamKey: string;
  supabaseUrl: string;
  supabaseKey: string;
  isFirebaseActive: boolean;
  setGeminiKey: (key: string) => void;
  setMapsKey: (key: string) => void;
  setSarvamKey: (key: string) => void;
  setSupabaseConfig: (url: string, key: string) => void;
  resetDatabase: () => Promise<void>;
}

const DemoConfigContext = createContext<DemoConfig | undefined>(undefined);

export function DemoConfigProvider({ children }: { children: React.ReactNode }) {
  const [geminiKey, setGeminiKeyInternal] = useState("");
  const [mapsKey, setMapsKeyInternal] = useState("");
  const [sarvamKey, setSarvamKeyInternal] = useState("");
  const [supabaseUrl, setSupabaseUrlInternal] = useState("");
  const [supabaseKey, setSupabaseKeyInternal] = useState("");
  const [isFirebaseActive, setIsFirebaseActive] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const gKey = localStorage.getItem("civicpulse_gemini_key") || "";
      const mKey = localStorage.getItem("civicpulse_maps_key") || "";
      const svKey = localStorage.getItem("civicpulse_sarvam_key") || "";
      const sUrl = localStorage.getItem("civicpulse_supabase_url") || "";
      const sKey = localStorage.getItem("civicpulse_supabase_key") || "";
      setGeminiKeyInternal(gKey);
      setMapsKeyInternal(mKey);
      setSarvamKeyInternal(svKey);
      setSupabaseUrlInternal(sUrl);
      setSupabaseKeyInternal(sKey);
      
      // Auto seed database
      DBService.seedData(false).then(() => {
        setIsFirebaseActive(true); // Using Supabase instead, assume true for demo
      });
    }
  }, []);

  const setGeminiKey = (key: string) => {
    localStorage.setItem("civicpulse_gemini_key", key);
    setGeminiKeyInternal(key);
    window.location.reload();
  };

  const setMapsKey = (key: string) => {
    localStorage.setItem("civicpulse_maps_key", key);
    setMapsKeyInternal(key);
    window.location.reload();
  };

  const setSarvamKey = (key: string) => {
    localStorage.setItem("civicpulse_sarvam_key", key);
    setSarvamKeyInternal(key);
    window.location.reload();
  };

  const setSupabaseConfig = (url: string, key: string) => {
    localStorage.setItem("civicpulse_supabase_url", url);
    localStorage.setItem("civicpulse_supabase_key", key);
    setSupabaseUrlInternal(url);
    setSupabaseKeyInternal(key);
    window.location.reload();
  };

  const resetDatabase = async () => {
    await DBService.seedData(true);
    window.location.reload();
  };

  return (
    <DemoConfigContext.Provider
      value={{
        geminiKey,
        mapsKey,
        sarvamKey,
        supabaseUrl,
        supabaseKey,
        isFirebaseActive,
        setGeminiKey,
        setMapsKey,
        setSarvamKey,
        setSupabaseConfig,
        resetDatabase,
      }}
    >
      {children}
    </DemoConfigContext.Provider>
  );
}

export function useDemoConfig() {
  const context = useContext(DemoConfigContext);
  if (!context) {
    throw new Error("useDemoConfig must be used within a DemoConfigProvider");
  }
  return context;
}
