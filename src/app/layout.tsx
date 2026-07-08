import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { DemoConfigProvider } from "@/components/DemoConfigContext";
import { GoogleTranslateProvider } from "@/components/GoogleTranslateProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pragathi Path - MP Citizen Demand Intelligence Platform",
  description:
    "An AI-powered multilingual platform helping Members of Parliament identify, analyze, and prioritize development projects using citizen input, public records, and explainable scoring.",
  keywords: ["civic tech", "MP constituency development", "public demand intelligence", "explainable AI priority scoring", "Gemini 2.5 Flash", "Google Maps Heatmap"],
  authors: [{ name: "Pragathi Path Team" }],
  manifest: "/manifest.json",
  themeColor: "#1e40af",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pragathi Path",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
    icon: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pragathi Path" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 h-full min-h-screen flex flex-col`}
      >
        <DemoConfigProvider>
          <GoogleTranslateProvider />
          <div className="flex-1 flex flex-col relative">
            {children}
          </div>
          <PWAInstallPrompt />
        </DemoConfigProvider>
      </body>
    </html>
  );
}
