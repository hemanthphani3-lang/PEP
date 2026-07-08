"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, PlusCircle, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGES, LanguageSelectorModal } from "@/components/LanguageSelector";

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLang(localStorage.getItem("civicpulse_lang") || "en");
    const handleLangChange = () => {
      setLang(localStorage.getItem("civicpulse_lang") || "en");
    };
    window.addEventListener("language-change", handleLangChange);
    return () => window.removeEventListener("language-change", handleLangChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Submit Suggestion", href: "/submit" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Transparent (over dark bg) vs default (white) style tokens
  // We disable transparency if the user has scrolled down.
  const isTransparent = transparent && !isScrolled;
  const headerBg   = isTransparent ? "bg-transparent border-transparent"        : "bg-white/90 border-slate-200/80 backdrop-blur-md shadow-sm";
  const logoText   = isTransparent ? "text-white"                             : "text-slate-800";
  const subText    = isTransparent ? "text-white/60"                          : "text-slate-400";
  const linkBase   = isTransparent ? "text-white/80 hover:text-white"         : "text-slate-500 hover:text-slate-800";
  const linkActive = isTransparent ? "text-white font-extrabold"              : "text-blue-600";
  const langBtn    = isTransparent
    ? "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm hover:shadow";
  const globeColor = isTransparent ? "text-emerald-300"                       : "text-blue-500";
  const suggBtn    = isTransparent ? "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm" : "bg-slate-100 hover:bg-slate-200 text-slate-700";
  const hamburger  = isTransparent ? "text-white hover:bg-white/10"           : "text-slate-500 hover:bg-slate-100";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] w-full border-b transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Pragathi Path Logo"
                width={40}
                height={40}
                priority
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <span className={`font-outfit font-black text-base leading-tight tracking-tight flex items-center gap-1.5 ${logoText}`}>
                  Pragathi Path
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </span>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${subText}`}>Your Voice. Our Priority.</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors font-outfit ${
                      isActive ? linkActive : linkBase
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Selector */}
              <button
                onClick={() => setIsLangModalOpen(true)}
                className={`flex items-center gap-1.5 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all border focus:outline-none cursor-pointer font-outfit active:scale-95 duration-200 ${langBtn}`}
              >
                <Globe className={`w-3.5 h-3.5 ${globeColor}`} />
                <span>{LANGUAGES.find(l => l.code === lang)?.native || "Language"}</span>
              </button>

              <Link
                href="/submit"
                className={`flex items-center gap-1.5 font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-300 ${suggBtn}`}
              >
                <PlusCircle className="w-4 h-4" /> Suggestion
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-300 shadow-md shadow-blue-900/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Contact Us <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-xl focus:outline-none transition-colors ${hamburger}`}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu — always solid white for readability */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-lg overflow-hidden"
            >
              <div className="space-y-1.5 px-4 pt-3 pb-4">
                {links.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-outfit transition-colors ${
                        isActive
                          ? "bg-white/10 text-white font-bold"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <div className="pt-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => { setIsOpen(false); setIsLangModalOpen(true); }}
                    className="flex w-full items-center justify-between bg-white/10 hover:bg-white/15 text-white font-bold px-4 py-3 rounded-xl text-sm transition-all border border-white/10 font-outfit backdrop-blur-sm"
                  >
                    <span className="flex items-center gap-2 text-left">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>Language / भाषा / భాష / மொழி</span>
                    </span>
                    <span className="text-xs text-emerald-400 bg-white/10 px-2.5 py-0.5 rounded-full font-bold">
                      {LANGUAGES.find(l => l.code === lang)?.native}
                    </span>
                  </button>

                  <Link
                    href="/submit"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl text-sm border border-white/10"
                  >
                    <PlusCircle className="w-4 h-4" /> Submit Suggestion
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm"
                  >
                    Contact Us <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Language Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />

      {/* Spacer for fixed header on standard pages */}
      {!transparent && <div className="h-[65px]" />}
    </>
  );
}
