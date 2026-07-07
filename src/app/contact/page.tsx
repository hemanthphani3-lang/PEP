"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  User, 
  Mail, 
  Send, 
  CheckCircle, 
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
    page: "General",
    steps: "",
    userAgent: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData(prev => ({
        ...prev,
        userAgent: navigator.userAgent
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.issue) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Save to local issues cache as fallback/offline record
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("civicpulse_technical_issues");
      const current = stored ? JSON.parse(stored) : [];
      current.push({
        id: Math.random().toString(36).substr(2, 9),
        submittedAt: new Date().toISOString(),
        ...formData
      });
      localStorage.setItem("civicpulse_technical_issues", JSON.stringify(current));
    }

    try {
      // Connect to Google Sheets webhook if configured
      const sheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
      if (sheetsUrl) {
        await fetch(sheetsUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
      }
      
      // Artificial minor delay for beautiful UX feel
      await new Promise(r => setTimeout(r, 800));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        issue: "",
        page: "General",
        steps: "",
        userAgent: typeof window !== "undefined" ? navigator.userAgent : ""
      });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contacts = [
    { name: "Bhimavarapu Hemanth", email: "hemanthphani3@gmail.com" },
    { name: "Sananth Kumar", email: "sananthkumar3@gmail.com" },
    { name: "Nanda kishore", email: "nandalaala99@gmail.com" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-grow w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-800 tracking-tight">Contact Technical Support</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Report any bugs, issues, or suggestions regarding the Pragathi Path interface.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form container */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 font-outfit flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" /> Report an Issue
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email or Phone (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Contact details"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="page" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Page Location of Issue</label>
                <select
                  id="page"
                  name="page"
                  value={formData.page}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="General">General / Other</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Submit Grievance">Submit Grievance Form</option>
                  <option value="My Submissions">My Submissions Feed</option>
                  <option value="MP Dashboard">MP Decision Dashboard</option>
                  <option value="Heatmap & Map">Spatial Demand Heatmap</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="issue" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Describe the Technical Issue</label>
                <textarea 
                  id="issue"
                  name="issue"
                  required
                  rows={4}
                  placeholder="Describe the issue, bug, or layout problem you encountered on this page..."
                  value={formData.issue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="steps" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Steps to Reproduce (Optional)</label>
                <textarea 
                  id="steps"
                  name="steps"
                  rows={2}
                  placeholder="e.g. 1. Opened new grievance page, 2. clicked record audio, 3. play toggle clipped..."
                  value={formData.steps}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-100 hover:shadow-lg disabled:opacity-50 font-outfit"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Report
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Thank you for reporting!</span>
                    <p className="mt-0.5 text-emerald-700">Your report has been logged and queued to sync with our Google Sheets tracker.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Info pane */}
          <div className="lg:col-span-4 space-y-6">
            {/* Email listings */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 font-outfit flex items-center gap-2 border-b border-slate-100 pb-3">
                <Mail className="w-4.5 h-4.5 text-indigo-500" /> Direct Development Contacts
              </h3>
              
              <div className="space-y-3">
                {contacts.map((contact, idx) => (
                  <div key={idx} className="flex flex-col p-3.5 bg-slate-50/50 border border-slate-150 rounded-2xl">
                    <span className="text-xs font-bold text-slate-700 font-outfit">{contact.name}</span>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-xs font-semibold text-blue-600 hover:underline mt-0.5 break-all font-mono"
                    >
                      {contact.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Styled Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs">
        <p>© 2026 Pragathi Path. All rights reserved. Designed for Visakhapatnam Constituency.</p>
      </footer>
    </div>
  );
}
