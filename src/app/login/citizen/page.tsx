"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCircle, ArrowRight, ShieldCheck, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CitizenLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("civicpulse_citizen_phone", phone);
      router.push("/citizen/my-submissions");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 font-outfit">
          Citizen Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Login to view local issues and submit your voice.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          {step === 1 ? (
            <motion.form 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSendOtp} 
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700">
                  Mobile Number
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-slate-200 rounded-xl bg-slate-50 font-medium"
                    placeholder="Enter 10-digit number"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phone.length < 10 || isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:shadow-none transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Get OTP <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("civicpulse_citizen_phone", phone || "9876543210");
                  router.push("/citizen/my-submissions");
                }}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all duration-300 shadow-sm"
              >
                Bypass Auth (Quick Test)
              </button>
            </motion.form>
          ) : (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700">
                  Enter OTP sent to +91 {phone}
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-slate-200 rounded-xl bg-slate-50 font-medium tracking-widest text-lg"
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={otp.length < 4 || isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-300 disabled:shadow-none transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Verify & Secure Login</>
                )}
              </button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600"
                >
                  Change Mobile Number
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
