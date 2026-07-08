"use client";

import { useEffect } from "react";

// Maps our language codes to Google Translate language codes
const GT_CODE_MAP: Record<string, string> = {
  en: "en",
  hi: "hi",
  te: "te",
  ta: "ta",
  kn: "kn",
  mr: "mr",
  bn: "bn",
  gu: "gu",
  ml: "ml",
  or: "or",
  pa: "pa",
};

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateProvider() {
  useEffect(() => {
    // Prevent React from crashing when Google Translate modifies the DOM (adds <font> tags)
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          return child;
        }
        return originalRemoveChild.apply(this, arguments as any) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          return newNode;
        }
        return originalInsertBefore.apply(this, arguments as any) as T;
      };
    }

    // Inject Google Translate script only once
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: Object.values(GT_CODE_MAP).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    // Listen for our custom language-change event and trigger Google Translate
    const handleLangChange = () => {
      const code = localStorage.getItem("civicpulse_lang") || "en";
      const gtCode = GT_CODE_MAP[code] || "en";
      triggerGoogleTranslate(gtCode);
    };

    window.addEventListener("language-change", handleLangChange);
    return () => window.removeEventListener("language-change", handleLangChange);
  }, []);

  return (
    // Hidden div required by Google Translate widget
    <div id="google_translate_element" className="hidden" />
  );
}

function triggerGoogleTranslate(langCode: string) {
  // If English, restore original
  if (langCode === "en") {
    // Try to find the restore original link and click it
    const iframe = document.querySelector(".goog-te-banner-frame") as HTMLIFrameElement;
    if (iframe) {
      const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
      const restoreLink = innerDoc?.querySelector(".goog-te-button button") as HTMLElement;
      if (restoreLink) {
        restoreLink.click();
        return;
      }
    }
    // Fallback: reset cookie and reload
    const cookieParts = document.cookie.split(";");
    for (const part of cookieParts) {
      if (part.trim().startsWith("googtrans=")) {
        document.cookie = "googtrans=/en/en; path=/";
        document.cookie = "googtrans=/en/en; path=/; domain=." + location.hostname;
      }
    }
    window.location.reload();
    return;
  }

  // Set the Google Translate cookie and trigger the combo box change
  document.cookie = `googtrans=/en/${langCode}; path=/`;
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${location.hostname}`;

  // Trigger via the hidden select element that Google Translate injects
  const tryTrigger = () => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    }
  };

  // Try immediately and retry after a short delay (in case script isn't loaded yet)
  tryTrigger();
  setTimeout(tryTrigger, 800);
  setTimeout(tryTrigger, 2000);
}
