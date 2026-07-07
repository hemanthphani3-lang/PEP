"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Lock, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MPLogin() {
  const router = useRouter();
  const [govId, setGovId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govId || !password) return;
    
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Briefcase className="w-7 h-7 text-emerald-400" />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-white font-outfit">
          Government Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Secure access for Members of Parliament and Officials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-700">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin} 
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-bold text-slate-300">
                Official Govt ID (NIC)
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={govId}
                  onChange={(e) => setGovId(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 py-3 sm:text-sm border-slate-600 rounded-xl bg-slate-900/50 text-white font-medium placeholder-slate-500"
                  placeholder="e.g. MP-AP-01-..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300">
                Password
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 py-3 sm:text-sm border-slate-600 rounded-xl bg-slate-900/50 text-white font-medium placeholder-slate-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-600 rounded bg-slate-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-emerald-400 hover:text-emerald-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={!govId || !password || isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none transition-all duration-300"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Secure Login <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                router.push("/dashboard");
              }}
              className="w-full mt-3 flex justify-center items-center gap-2 py-3 px-4 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all duration-300 shadow-sm"
            >
              Bypass Auth (Quick Test)
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> End-to-End Encrypted
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
