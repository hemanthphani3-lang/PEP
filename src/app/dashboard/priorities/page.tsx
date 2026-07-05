"use client";

import React, { useState, useEffect } from "react";
import { DBService, Cluster, PublicData } from "@/services/db";
import { 
  Sparkles, 
  Users, 
  MapPin, 
  Database, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Play,
  RotateCcw,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PrioritiesPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [publicData, setPublicData] = useState<PublicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        const cls = await DBService.getClusters();
        const pData = await DBService.getPublicData();
        setClusters(cls);
        setPublicData(pData);
        
        // Auto-expand the first cluster on mount (only if none is active)
        if (cls.length > 0 && !expandedClusterId) {
          setExpandedClusterId(cls[0].clusterId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };
    loadData();

    const interval = setInterval(() => {
      loadData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [expandedClusterId]);

  // Update status (Pending, Approved, In Progress, Completed)
  const handleUpdateStatus = async (cluster: Cluster, newStatus: Cluster["status"]) => {
    const updated = { ...cluster, status: newStatus };
    
    // Save to DB
    await DBService.updateCluster(updated);
    
    // Update local state
    setClusters(prev => prev.map(c => c.clusterId === cluster.clusterId ? updated : c));
  };

  // Get public data matching village name
  const getVillagePopulation = (villages: string[]): number => {
    if (villages.length === 0) return 0;
    const matched = publicData.find(d => d.villageName === villages[0]);
    return matched ? matched.population : 8500;
  };

  const getRankBadge = (rank: number) => {
    const base = "flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs shadow-sm border";
    if (rank === 0) return `${base} bg-gradient-to-r from-amber-450 to-amber-300 text-amber-950 border-amber-400`; // Gold
    if (rank === 1) return `${base} bg-gradient-to-r from-slate-300 to-slate-200 text-slate-800 border-slate-300`; // Silver
    if (rank === 2) return `${base} bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 border-amber-600`; // Bronze
    return `${base} bg-white text-slate-500 border-slate-200`;
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 90) return { name: "Critical Need", color: "bg-red-500 text-white" };
    if (score >= 80) return { name: "High Urgency", color: "bg-orange-500 text-white" };
    if (score >= 70) return { name: "Medium Priority", color: "bg-amber-500 text-slate-900" };
    return { name: "Low Priority", color: "bg-emerald-500 text-white" };
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">Priority Intelligence Engine</h1>
          <p className="text-slate-500 text-sm mt-1">
            Explainable AI decision index ranking development needs based on a transparent 5-weight civic algorithm.
          </p>
        </div>
        <Link
          href="/dashboard/evidence"
          className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow flex items-center gap-1.5 self-start"
        >
          <Database className="w-3.5 h-3.5" /> Public Evidence Data
        </Link>
      </div>

      {/* Weights breakdown banner card */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-64 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-300" />
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Explainable AI Scoring Methodology</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-350 block uppercase">35% Weight</span>
            <p className="text-sm font-bold mt-1 text-blue-300">Citizen Demand</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">Complaint frequency</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-350 block uppercase">25% Weight</span>
            <p className="text-sm font-bold mt-1 text-emerald-300">Service Gap</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">Infrastructure lack</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-350 block uppercase">20% Weight</span>
            <p className="text-sm font-bold mt-1 text-orange-300">Equity Index</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">Deficits in region</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] font-bold text-slate-350 block uppercase">15% Weight</span>
            <p className="text-sm font-bold mt-1 text-amber-300">Public Validation</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">Official census verification</span>
          </div>
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 text-center col-span-2 md:col-span-1">
            <span className="text-[10px] font-bold text-slate-350 block uppercase">5% Weight</span>
            <p className="text-sm font-bold mt-1 text-purple-300">Strategic Alignment</p>
            <span className="text-[9px] text-slate-400 block mt-0.5">National dev programs</span>
          </div>
        </div>
      </div>

      {/* Ranked Proposals */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : clusters.length > 0 ? (
        <div className="space-y-6">
          {clusters.map((cluster, index) => {
            const isExpanded = expandedClusterId === cluster.clusterId;
            const label = getPriorityLabel(cluster.priorityScore);
            const population = getVillagePopulation(cluster.villagesAffected);

            return (
              <motion.div
                key={cluster.clusterId}
                layout
                className={`bg-white rounded-2xl border ${
                  isExpanded ? "border-blue-500 shadow-md ring-1 ring-blue-100/50" : "border-slate-200 hover:border-slate-350"
                } shadow-sm transition-all duration-300 overflow-hidden`}
              >
                {/* Accordion header */}
                <div 
                  onClick={() => setExpandedClusterId(isExpanded ? null : cluster.clusterId)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/40"
                >
                  <div className="flex items-center gap-4">
                    {/* Metallic Rank */}
                    <div className={getRankBadge(index)}>
                      #{index + 1}
                    </div>

                    {/* Title Specs */}
                    <div>
                      <h3 className="font-outfit font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                        {cluster.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] font-semibold text-slate-400">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase">{cluster.category}</span>
                        <span className="flex items-center gap-0.5 text-slate-500"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {cluster.villagesAffected.join(", ")}</span>
                        <span className="flex items-center gap-0.5 text-slate-500"><Users className="w-3.5 h-3.5 text-slate-400" /> {cluster.citizenCount} votes</span>
                      </div>
                    </div>
                  </div>

                  {/* Right hand score gauge */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between border-t border-slate-100 pt-3 sm:pt-0 sm:border-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Priority score</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xl font-extrabold text-slate-800 font-outfit">{cluster.priorityScore}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${label.color}`}>
                          {label.name}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                      cluster.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                      cluster.status === "Approved" ? "bg-blue-50 text-blue-700 border-blue-100" :
                      cluster.status === "In Progress" ? "bg-purple-50 text-purple-700 border-purple-100" :
                      "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {cluster.status}
                    </span>
                  </div>
                </div>

                {/* Accordion Content Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="border-t border-slate-150 overflow-hidden"
                    >
                      <div className="p-6 bg-slate-50/50 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left column: AI Priority details */}
                        <div className="lg:col-span-8 space-y-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-blue-600" /> Explainable priority explanation
                          </h4>
                          <div className="bg-white border border-slate-200 p-5 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium shadow-sm whitespace-pre-line">
                            {cluster.explanation}
                          </div>

                          {/* Quick details row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-sm text-center">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Primary Village</span>
                              <span className="text-xs font-bold text-slate-800 mt-1 block">{cluster.villagesAffected[0] || "Unknown"}</span>
                            </div>
                            <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-sm text-center">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Voter Demand</span>
                              <span className="text-xs font-bold text-slate-800 mt-1 block">{cluster.citizenCount} verified logs</span>
                            </div>
                            <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-sm text-center">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Est. Population</span>
                              <span className="text-xs font-bold text-slate-800 mt-1 block">{population.toLocaleString()} citizens</span>
                            </div>
                            <div className="bg-white border border-slate-150 p-3 rounded-xl shadow-sm text-center">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Strategic Priority</span>
                              <span className="text-xs font-bold text-slate-800 mt-1 block">{cluster.category} link</span>
                            </div>
                          </div>
                        </div>

                        {/* Right column: Actions and status transitions */}
                        <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Project Status Pipeline</h4>
                            <div className="space-y-2">
                              {[
                                { name: "Pending", icon: Clock, desc: "Awaiting MP authorization" },
                                { name: "Approved", icon: CheckCircle, desc: "Passed to local planning board" },
                                { name: "In Progress", icon: Play, desc: "On-site works initiated" },
                                { name: "Completed", icon: RotateCcw, desc: "Final verification sign-off" }
                              ].map((state) => {
                                const isCurrent = cluster.status === state.name;
                                return (
                                  <button
                                    key={state.name}
                                    onClick={() => handleUpdateStatus(cluster, state.name as Cluster["status"])}
                                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center justify-between group ${
                                      isCurrent 
                                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-150" 
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <state.icon className={`w-4 h-4 shrink-0 ${isCurrent ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                                      <div>
                                        <p className="font-bold">{state.name}</p>
                                        <span className={`text-[9px] leading-tight block ${isCurrent ? "text-blue-100" : "text-slate-400"}`}>
                                          {state.desc}
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                            <Link
                              href="/dashboard/reports"
                              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1 shadow-sm transition-colors"
                            >
                              <BookOpen className="w-4 h-4" /> Briefing Documentation
                            </Link>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 font-medium">
          No prioritized requests loaded.
        </div>
      )}
    </div>
  );
}
