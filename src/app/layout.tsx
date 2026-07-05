import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { DemoConfigProvider } from "@/components/DemoConfigContext";
import DemoSettings from "@/components/DemoSettings";
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
  title: "CivicPulse AI - MP Citizen Demand Intelligence Platform",
  description: 
    "An AI-powered multilingual platform helping Members of Parliament identify, analyze, and prioritize development projects using citizen input, public records, and explainable scoring.",
  keywords: ["civic tech", "MP constituency development", "public demand intelligence", "explainable AI priority scoring", "Gemini 2.5 Flash", "Google Maps Heatmap"],
  authors: [{ name: "CivicPulse AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 h-full min-h-screen flex flex-col`}
      >
        <DemoConfigProvider>
          <div className="flex-1 flex flex-col relative">
            {children}
            <DemoSettings />
          </div>
        </DemoConfigProvider>
      </body>
    </html>
  );
}
