import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { DemoConfigProvider } from "@/components/DemoConfigContext";
import { GoogleTranslateProvider } from "@/components/GoogleTranslateProvider";
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
  authors: [{ name: "Pragathi Path Team" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 h-full min-h-screen flex flex-col`}
      >
        <DemoConfigProvider>
          <GoogleTranslateProvider />
          <div className="flex-1 flex flex-col relative">
            {children}
          </div>
        </DemoConfigProvider>
      </body>
    </html>
  );
}
