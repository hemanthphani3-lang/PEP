"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone, Star } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as any).standalone === true) return;

    // Don't show if user dismissed within the last 7 days
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < sevenDays) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a 3-second delay for a smoother first impression
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered:", reg.scope))
        .catch((err) => console.warn("SW registration failed:", err));
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setTimeout(() => setShowPrompt(false), 2000);
      } else {
        setShowPrompt(false);
      }
    } catch (err) {
      console.warn("Install prompt error:", err);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa_install_dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:max-w-sm"
          role="dialog"
          aria-label="Install Pragathi Path app"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
          >
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

            <div className="relative p-5">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5 text-white/70" />
              </button>

              {isInstalled ? (
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-2xl bg-green-400/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-400 fill-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Installed Successfully!</p>
                    <p className="text-blue-200 text-xs">Pragathi Path is now on your home screen.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3.5 pr-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src="/icons/icon-96x96.png" alt="App icon" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">Install Pragathi Path</p>
                      <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">
                        Add to your home screen for instant access — report issues, track progress, anytime.
                      </p>
                    </div>
                  </div>

                  {/* Feature pills */}
                  <div className="flex gap-2 mt-3.5 flex-wrap">
                    {["Works Offline", "Home Screen", "Instant Access"].map((feat) => (
                      <span key={feat} className="text-[10px] font-semibold text-blue-200 bg-white/10 rounded-full px-2.5 py-1 border border-white/10">
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleDismiss}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      Not Now
                    </button>
                    <button
                      onClick={handleInstall}
                      disabled={isInstalling}
                      className="flex-[2] py-2.5 rounded-xl text-sm font-bold bg-white text-blue-900 hover:bg-blue-50 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isInstalling ? (
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 animate-bounce" />
                          Installing…
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Download className="w-4 h-4" />
                          Install App
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
