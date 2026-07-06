"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { DBService, Cluster } from "@/services/db";
import { 
  BarChart3, 
  MapPin, 
  Users, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Tag,
  Search
} from "lucide-react";
import { motion } from "framer-motion";

export default function PublicPrioritiesPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await DBService.getClusters();
      // Sort by priorityScore descending
      data.sort((a, b) => b.priorityScore - a.priorityScore);
      setClusters(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp className="w-3.5 h-3.5" /> Public Intelligence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Community Priorities
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Explore the most pressing civic issues identified by citizens and ranked in real-time by the CivicPulse AI engine.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {clusters.map((cluster, index) => {
              const isTop3 = index < 3;
              
              return (
                <motion.div
                  key={cluster.clusterId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-6 sm:p-8 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1
                            ${isTop3 ? "bg-rose-100 text-rose-700" : "bg-blue-50 text-blue-700"}
                          `}>
                            {isTop3 ? <AlertTriangle className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                            {isTop3 ? "Critical Urgency" : cluster.category}
                          </span>
                          {!isTop3 && (
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-semibold">{cluster.villageName}</span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                        {cluster.title}
                      </h3>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {cluster.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 sm:gap-8 border-t border-slate-100 pt-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            cluster.priorityScore >= 80 ? "bg-rose-50 text-rose-600" :
                            cluster.priorityScore >= 60 ? "bg-amber-50 text-amber-600" :
                            "bg-blue-50 text-blue-600"
                          }`}>
                            <BarChart3 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Priority Score</p>
                            <p className="text-lg font-extrabold text-slate-800">{cluster.priorityScore}/100</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Citizens Impacted</p>
                            <p className="text-lg font-extrabold text-slate-800">{cluster.citizenCount}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {cluster.images && cluster.images.length > 0 && (
                      <div className="sm:w-72 h-48 sm:h-auto border-l border-slate-100 overflow-hidden relative bg-slate-100 shrink-0">
                        <img 
                          src={cluster.images[0]} 
                          alt={cluster.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                          <span className="text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
                            <Search className="w-3.5 h-3.5" /> Evidence Attached
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
