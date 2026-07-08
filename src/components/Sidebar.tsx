"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Layers, 
  Map, 
  Sparkles, 
  Database, 
  FileText, 
  ArrowLeft, 
  Menu, 
  X,
  Vote,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGES, LanguageSelectorModal } from "@/components/LanguageSelector";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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

  const menuItems = [
    { name: "Overview Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Demand Clusters", href: "/dashboard/clusters", icon: Layers },
    { name: "Spatial Demand Heatmap", href: "/dashboard/maps", icon: Map },
    { name: "Priority Decisions", href: "/dashboard/priorities", icon: Sparkles },
    { name: "Public Data Evidence", href: "/dashboard/evidence", icon: Database },
    { name: "Intelligence Reports", href: "/dashboard/reports", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sticky top-0 z-30 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Pragathi Path Logo"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
          <span className="font-outfit font-bold text-sm tracking-tight text-slate-800">
            Pragathi Path <span className="text-blue-600">MP</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/50 md:hidden" onClick={() => setIsOpen(false)}>
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-72 h-full bg-white p-5 flex flex-col border-r border-slate-255"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="Pragathi Path Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                  <span className="font-outfit font-bold text-base text-slate-800">
                    Pragathi Path <span className="text-blue-600">MP</span>
                  </span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 mt-6 space-y-1.5">
                {/* Mobile Language Selector trigger */}
                <div className="pb-4 border-b border-slate-100">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsLangModalOpen(true);
                    }}
                    className="flex w-full items-center justify-between bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all border border-slate-200 font-outfit"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span>Language</span>
                    </span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-extrabold uppercase font-mono">
                      {LANGUAGES.find(l => l.code === lang)?.native}
                    </span>
                  </button>
                </div>

                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className="w-4.5 h-4.5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer Links */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Hub
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Pragathi Path Logo"
              width={40}
              height={40}
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <span className="font-outfit font-black text-base leading-none text-slate-800 flex items-center gap-1">
                Pragathi Path <span className="text-blue-600">MP</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">MP Intelligence Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "text-blue-600 bg-blue-50/70 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                }`} />
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Back Link */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Hub
          </Link>
        </div>
      </aside>

      <LanguageSelectorModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
    </>
  );
}
