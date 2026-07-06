"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, Menu, X, BarChart3, ChevronRight, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const pathname = usePathname();

  useEffect(() => {
    setLang(localStorage.getItem("civicpulse_lang") || "en");
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setLang(selected);
    localStorage.setItem("civicpulse_lang", selected);
    window.dispatchEvent(new Event("language-change"));
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Submit Suggestion", href: "/newsubmit" },
    { name: "MP Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              <Vote className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="font-outfit font-bold text-lg leading-tight tracking-tight text-slate-800 flex items-center gap-1.5">
                CivicPulse <span className="text-blue-600 font-extrabold">AI</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">MP Demand Prioritization</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 relative py-1.5 ${
                    isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <select
                value={lang}
                onChange={handleLangChange}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 pr-7 rounded-xl text-xs transition-colors border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-outfit"
              >
                <option value="en">English (UK)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <Link
              href="/submit"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-300"
            >
              <PlusCircle className="w-4 h-4" /> Suggestion
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-300 shadow-sm shadow-blue-100 hover:shadow-md hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              MP Dashboard <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="space-y-1.5 px-4 pt-3 pb-4">
              {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 font-bold" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="pt-4 flex flex-col gap-2.5">
                {/* Mobile Language Selector */}
                <div className="relative w-full">
                  <select
                    value={lang}
                    onChange={handleLangChange}
                    className="appearance-none w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2.5 pr-8 rounded-xl text-sm transition-colors border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-outfit"
                  >
                    <option value="en">English (UK)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>

                <Link
                  href="/submit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 bg-slate-150 text-slate-700 font-semibold py-2.5 rounded-xl text-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Submit Suggestion
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md shadow-blue-200"
                >
                  Enter MP Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
